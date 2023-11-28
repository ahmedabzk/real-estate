use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::Serialize;
use serde_json::json;

#[derive(thiserror::Error, Debug)]
pub enum MyError {
    #[error("MongoDB error")]
    MongoError(#[from] mongodb::error::Error),
    #[error("duplicate key error: {0}")]
    MongoErrorKind(mongodb::error::ErrorKind),
    #[error("duplicate key error: {0}")]
    MongoDuplicateError(mongodb::error::Error),
    #[error("error during mongodb query: {0}")]
    MongoQueryError(mongodb::error::Error),
    #[error("error serializing BSON")]
    MongoSerializeBsonError(#[from] mongodb::bson::ser::Error),
    #[error("validation error")]
    MongoDataError(#[from] mongodb::bson::document::ValueAccessError),
    #[error("invalid ID: {0}")]
    InvalidIDError(String),
    #[error("Note with ID: {0} not found")]
    NotFoundError(String),
    #[error("Missing credentials: {0} not found")]
    MissingCredential(String),
    #[error("Wrong Credential: {0} not found")]
    WrongCredential(String),
    #[error("User Does Not Exist: {0} not found")]
    UserDoesNotExist(String),
    #[error("User Already Exist: {0} not found")]
    UserAlreadyExist(String),
    #[error("Unauthorized: {0} not found")]
    Unauthorized(String),
    #[error("Internal ServerError: {0} not found")]
    InternalServerError(String),
    #[error("Invalid Token: {0} not found")]
    InvalidToken(String),
}

#[derive(Serialize)]
struct ErrorResponse {
    status: &'static str,
    message: String,
}

impl IntoResponse for MyError {
    fn into_response(self) -> axum::response::Response {
        let (status, err_msg) = match self {
            Self::InternalServerError(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "an internal server error occured",
            ),
            Self::InvalidToken(_) => (StatusCode::BAD_REQUEST, "invalid token"),
            Self::MissingCredential(_) => (StatusCode::BAD_REQUEST, "missing credential"),
            Self::WrongCredential(_) => (StatusCode::UNAUTHORIZED, "wrong credential"),
            Self::UserDoesNotExist(_) => (StatusCode::UNAUTHORIZED, "User does not exist"),
            Self::UserAlreadyExist(_) => (StatusCode::BAD_REQUEST, "User already exist"),
            Self::Unauthorized(_) => (StatusCode::UNAUTHORIZED, "authentication failed"),
            Self::MongoDataError(_) => (StatusCode::INTERNAL_SERVER_ERROR, "data error"),
            Self::InvalidIDError(_) => (StatusCode::BAD_REQUEST, "Invalid ID"),
            Self::MongoErrorKind(_) => (StatusCode::INTERNAL_SERVER_ERROR, "mongo db error kind"),
            Self::MongoDuplicateError(_) => (StatusCode::CONFLICT, "username already in use"),
            Self::MongoQueryError(_) => (StatusCode::INTERNAL_SERVER_ERROR, "query error"),
            Self::MongoSerializeBsonError(_) => {
                (StatusCode::INTERNAL_SERVER_ERROR, "serialize error")
            }
            Self::NotFoundError(_) => (StatusCode::NOT_FOUND, "not found"),
            Self::MongoError(_) => (StatusCode::INTERNAL_SERVER_ERROR, "mongo error"),
        };

        (status, Json(json!({ "error": err_msg }))).into_response()
    }
}

// impl Into<(axum::http::StatusCode, Json<serde_json::Value>)>  for MyError {
//     fn into(self) -> (axum::http::StatusCode, Json<serde_json::Value>) {
//         let (status, error_response) = match self {
//             MyError::MongoErrorKind(e) => (
//                 StatusCode::INTERNAL_SERVER_ERROR,
//                 ErrorResponse {
//                     status: "error",
//                     message: format!("MongoDB error kind: {}", e),
//                 },
//             ),
//             MyError::MongoDuplicateError(_) => (
//                 StatusCode::CONFLICT,
//                 ErrorResponse {
//                     status: "fail",
//                     message: "Note with that title already exists".to_string(),
//                 },
//             ),
//             MyError::InvalidIDError(id) => (
//                 StatusCode::BAD_REQUEST,
//                 ErrorResponse {
//                     status: "fail",
//                     message: format!("invalid ID: {}", id),
//                 },
//             ),
//             MyError::NotFoundError(id) => (
//                 StatusCode::NOT_FOUND,
//                 ErrorResponse {
//                     status: "fail",
//                     message: format!("Note with ID: {} not found", id),
//                 },
//             ),
//             MyError::MongoError(e) => (
//                 StatusCode::INTERNAL_SERVER_ERROR,
//                 ErrorResponse {
//                     status: "error",
//                     message: format!("MongoDB error: {}", e),
//                 },
//             ),
//             MyError::MongoQueryError(e) => (
//                 StatusCode::INTERNAL_SERVER_ERROR,
//                 ErrorResponse {
//                     status: "error",
//                     message: format!("MongoDB error: {}", e),
//                 },
//             ),
//             MyError::MongoSerializeBsonError(e) => (
//                 StatusCode::INTERNAL_SERVER_ERROR,
//                 ErrorResponse {
//                     status: "error",
//                     message: format!("MongoDB error: {}", e),
//                 },
//             ),
//             MyError::MongoDataError(e) => (
//                 StatusCode::INTERNAL_SERVER_ERROR,
//                 ErrorResponse {
//                     status: "error",
//                     message: format!("MongoDB error: {}", e),
//                 },
//             ),
//         };
//         (status, Json(serde_json::to_value(error_response).unwrap()))
//     }
// }

impl From<MyError> for (StatusCode, ErrorResponse) {
    fn from(err: MyError) -> (StatusCode, ErrorResponse) {
        err.into()
    }
}
