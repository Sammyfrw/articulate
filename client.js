//Script to be run to handle changes to database
//Module definitions
const mongoose = require('mongoose');
const credentials = require("./credentials.js");

//DB connection
const dbUrl = 'mongodb://' + credentials.host + ':27017/' + credentials.database;
const connection = mongoose.createConnection(dbUrl);

//Clientside model setup
const DBConnection = require('./models/dbConnection');
const Article = require('./models/article').getModel(DBConnection);

connection.on("open", () => {
  Article.collection.drop();
  console.log("Connected to server:");
});

connection.on("close", () => {
  console.log("Closed connection to server.")
});
