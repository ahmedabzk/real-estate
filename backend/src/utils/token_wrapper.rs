use axum::extract::FromRef;
use mongodb::Client;



#[derive(Clone)]
pub struct TokenWrapper(pub String);

impl FromRef<Client> for TokenWrapper {
    fn from_ref(client: &Client) -> Self {
        // create TokenWrapper from Client
        TokenWrapper("some_token".to_string())
    }
}