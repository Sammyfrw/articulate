//DB and schema setup
const mongoose = require('mongoose');
const credentials = require("../credentials.js");
const dbUrl = 'mongodb://' + credentials.host + ':27017/' + credentials.database;

mongoose.Promise = global.Promise;

//Create connection
const connection = mongoose.createConnection(dbUrl);

connection.on("open", () => {
  console.log("Connected to server:");
});

connection.on("close", () => {
  console.log("Closed connection to server.")
});

module.exports = connection

