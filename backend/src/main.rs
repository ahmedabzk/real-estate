mod controllers;
mod errors;
mod models;
mod routes;
mod utils;
pub mod app_state;
//use std::io;
use std::net::SocketAddr;


use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use dotenv::dotenv;
use mongodb::{options::ClientOptions, Client};

use crate::models::db::DataBaseConfig;
use crate::models::user_model::create_name_unique;
use crate::routes::route::create_routes;
use crate::app_state::AppState;
use crate::utils::token_wrapper::TokenWrapper;

#[tokio::main]
async fn main() {
    dotenv().ok();

    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| {
                "rust_axum=debug,axum=debug,tower_http=debug,mongodb=debug".into()
            }),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let jwt = dotenv::var("SECRET").expect("failed to load the secret key");

    let database_config = DataBaseConfig::init().unwrap();
    let mut client_options = ClientOptions::parse(database_config.uri).await.unwrap();
    client_options.connect_timeout = database_config.connection_timeout;
    client_options.max_pool_size = database_config.max_pool_size;
    client_options.min_pool_size = database_config.min_pool_size;
    let client = Client::with_options(client_options).unwrap();

    create_name_unique(&client).await;

    let app_state = AppState{
        client,
        jwt_secret: TokenWrapper(jwt)
    };

    let app = create_routes(app_state).await;

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
