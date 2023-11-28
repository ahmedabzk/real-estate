use chrono::prelude::*;
use mongodb::bson::oid::ObjectId;
use mongodb::{bson::doc, options::IndexOptions, Client, IndexModel};
use serde::{Deserialize, Serialize};

use validator::Validate;

#[derive(Serialize, Deserialize, Clone, Debug, Validate)]
#[serde(rename_all = "camelCase")]
pub struct UserModel {
    #[serde(rename = "_id")]
    #[serde(skip)]
    pub id: ObjectId,
    pub username: String,
    #[validate(email)]
    pub email: String,
    //  #[validate(length(min = 8, max =50))]
    pub password: String,
    #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    #[serde(skip)]
    pub created_at: DateTime<Utc>,
    #[serde(skip)]
    pub updated_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, Clone, Debug, Validate)]
#[serde(rename_all = "camelCase")]
pub struct UserLogin {
    #[serde(rename = "_id")]
     #[serde(skip)]
    pub id: ObjectId,
    pub username: String,
    pub password: String,
}

pub async fn create_name_unique(client: &Client) {
    let options = IndexOptions::builder().unique(true).build();
    let model = vec![
        IndexModel::builder()
            .keys(doc! {"username":1})
            .options(options.clone())
            .build(),
        IndexModel::builder()
            .keys(doc! {"email":1})
            .options(options)
            .build(),
    ];

    for index_model in model {
        client
            .database("real-estate") //name of our database
            .collection::<UserModel>("users") //name of our collection
            .create_index(index_model, None)
            .await
            .expect("error creating index!");
    }
}
