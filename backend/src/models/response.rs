use serde::{Serialize, Deserialize};
use axum::response::IntoResponse;
#[derive(Serialize,Deserialize, Debug)]
pub struct UserResponse {
    pub status: &'static str,
    pub id: String,
    pub username: String,
    // pub token: String,
}



