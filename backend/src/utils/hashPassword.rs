use bcrypt::{hash, verify};

use crate::errors::custom_error::MyError;

// hash password function
pub async fn hash_password(password: &str) -> Result<String, MyError> {
    hash(password, 9).map_err(|err| {
        println!("failed to hash password {}", err);
        MyError::InternalServerError(err.to_string())
    })
}

// verify password
pub async fn verify_password(provided_password: &str, password: &str) -> Result<bool, MyError> {
    verify(provided_password, password).map_err(|err| MyError::WrongCredential(err.to_string()))
}
