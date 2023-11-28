use crate::errors::custom_error::MyError;
use mongodb::options::Compressor;
use mongodb::{bson::Document, Collection};
use std::time::Duration;

#[derive(Debug, Clone)]
pub struct DataBaseConfig {
    pub uri: String,
    pub connection_timeout: Option<Duration>,
    pub min_pool_size: Option<u32>,
    pub max_pool_size: Option<u32>,
}

type Result<T> = std::result::Result<T, MyError>;

impl DataBaseConfig {
    pub fn init() -> Result<Self> {
        let mongo_uri = std::env::var("MONGO_URL").expect("mongo db url must be here");
        let mongo_connection_timeout: u64 = std::env::var("MONGO_CONNECTION_TIMEOUT")
            .expect("Failed to load `MONGO_CONNECTION_TIMEOUT` environment variable.")
            .parse()
            .expect("Failed to parse `MONGO_CONNECTION_TIMEOUT` environment variable.");

        let mongo_min_pool_size: u32 = std::env::var("MONGO_MIN_POOL_SIZE")
            .expect("Failed to load `MONGO_MIN_POOL_SIZE` environment variable.")
            .parse()
            .expect("Failed to parse `MONGO_MIN_POOL_SIZE` environment variable.");

        let mongo_max_pool_size: u32 = std::env::var("MONGO_MAX_POOL_SIZE")
            .expect("Failed to load `MONGO_MAX_POOL_SIZE` environment variable.")
            .parse()
            .expect("Failed to parse `MONGO_MAX_POOL_SIZE` environment variable.");

        println!("✅ Database connected successfully");

        Ok(Self {
            uri: mongo_uri,
            connection_timeout: Some(Duration::from_secs(mongo_connection_timeout)),
            min_pool_size: Some(mongo_min_pool_size),
            max_pool_size: Some(mongo_max_pool_size),
        })
    }
}
