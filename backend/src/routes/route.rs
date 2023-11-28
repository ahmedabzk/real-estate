use mongodb::Client;

use axum::{
    http::Method,
    routing::{get, post},
    Router,
};

use axum::http::{
    header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE},
    HeaderValue,
};

use tower_http::cors::{Any, CorsLayer};

use crate::{controllers::healthy_checker::health_checker_handler, app_state::AppState};
use crate::controllers::user_controller::{create_user, login};


pub async fn create_routes(app_state: AppState) -> Router<()> {
    let cors = CorsLayer::new()
        .allow_origin("http://localhost:5173".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST, Method::PATCH, Method::DELETE])
        .allow_credentials(true)
        .allow_headers([AUTHORIZATION, ACCEPT, CONTENT_TYPE]);

    Router::new()
        .route("/hello", get(health_checker_handler))
        .route("/auth/sign-up", post(create_user))
        .route("/auth/sign-in", post(login))
        .layer(cors)
        .with_state(app_state.client)
}
