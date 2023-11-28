use axum::{http::{header, Response}, response::IntoResponse, Json};
use jsonwebtoken::{Algorithm, encode, Header, EncodingKey};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    id: String,
    // Add more claims as needed
}

pub async fn generate_token(secret: String, id: String) -> String {
    let claims = Claims { id: id.to_owned() };
    let key = EncodingKey::from_secret(secret.as_bytes());
    encode(&Header::new(Algorithm::HS256), &claims, &key).unwrap()
}

// fn set_cookie(token: String) -> Response<Json<&'static str>> {
//     let hd = Response::new("Cookie set successfully").headers();
//     if hd.is_empty(){
//         hd.insert("jwt", token.)
//     }
// }