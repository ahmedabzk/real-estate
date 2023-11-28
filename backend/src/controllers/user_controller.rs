use axum::extract::{Json, State};

use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use chrono::Utc;
use mongodb::bson::doc;

use axum::debug_handler;
use mongodb::Client;
use serde_json::{json, Value};

use crate::app_state::AppState;
use crate::errors::custom_error::MyError;
use crate::models::response::UserResponse;
use crate::models::user_model::{UserLogin, UserModel};
use crate::utils::hashPassword::{hash_password, verify_password};
use crate::utils::jwt::generate_token;
use crate::utils::token_wrapper::TokenWrapper;

#[debug_handler(state = mongodb::Client)]
pub async fn create_user(
    State(client): State<Client>,
    Json(payload): Json<UserModel>,
) -> Result<Json<Value>, MyError> {
    if payload.username.is_empty() || payload.password.is_empty() || payload.email.is_empty() {
        return Err(MyError::MissingCredential("missing credential".to_string()));
    }

    // let serialized_data =  bson::to_bson(&payload).map_err(MyError::MongoSerializeBsonError)?;
    // let document = serialized_data.as_document().unwrap();

    let hashed_password = hash_password(&payload.password).await?;

    let datetime = Utc::now();

    let new_user = doc! {
        "username": payload.username,
        "email": payload.email,
        "password": hashed_password,
        "createdAt": datetime,
        "updatedAt": datetime,

    };

    let users = client.database("real-estate").collection("users");

    let insert_result = users.insert_one(new_user.clone(), None).await;

    // let json_response = serde_json::json!({
    //     "status": "success",
    //     "id": insert_result.inserted_id
    // });

    match insert_result {
        Ok(result) => Ok(Json(json!({ "status": "success",
        "id": result.inserted_id}))),
        Err(e) => Err(MyError::MongoDuplicateError(e)),
    }
}

#[debug_handler(state = mongodb::Client)]
pub async fn login(
    State(client): State<Client>,
    State(secret): State<TokenWrapper>,
    Json(payload): Json<UserLogin>,
) -> impl IntoResponse {
    if payload.username.is_empty() || payload.password.is_empty() {
        return Err(MyError::MissingCredential(
            "missing credentials".to_string(),
        ));
    }

    let mut headers = HeaderMap::new();

    let user: Option<UserLogin> = client
        .database("real-estate")
        .collection("users")
        .find_one(doc! {"username": payload.username}, None)
        .await?;

    if let Some(user) = user {
        let password_verification = verify_password(&payload.password, &user.password).await?;
        if !password_verification {
            Err(MyError::WrongCredential(
                "check your password and username".to_string(),
            ))
        } else {
            let token = generate_token(secret.0, user.id.to_string()).await;
            let cookie_name = "auth-cookie".to_string();
            let cookie = format!("{}={} HttpOnly", cookie_name, token);
            headers.insert(
                axum::http::header::SET_COOKIE,
                cookie.as_str().parse().unwrap(),
            );

            let res = UserResponse {
                status: "success",
                id: user.id.to_string(),
                username: user.username,
                // token: cookie
            };

            let response = Response::builder()
                .status(StatusCode::OK)
                .header(axum::http::header::SET_COOKIE, cookie.as_str())
                .body(Json(res))
                .unwrap()
                .into_body();

            Ok(response)
        }
    } else {
        Err(MyError::UserDoesNotExist("User does not exist".to_string()))
    }
}
