use axum::extract::FromRef;
use mongodb::Client;

use crate::utils::token_wrapper::TokenWrapper;

#[derive(Clone)]
pub struct AppState{
    pub client: Client,
    pub jwt_secret: TokenWrapper
}

// impl FromRef<Client> for AppState {
//     fn from_ref(app_state: &AppState) -> Self {
//         // create TokenWrapper from Client
//         Self { client: app_state.client, jwt_secret: app_state.jwt_secret.clone() }
//     }
// }
