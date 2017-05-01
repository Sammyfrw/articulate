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
const Author = require('./models/author').getModel(DBConnection);

connection.on("open", () => {
  Article.collection.drop();
  Author.collection.drop();

  author = new Author({
    name: 'Sammy A Rachman',
    email: ''
  })
  author.save();

  author = new Author({
    name: 'Joel Wylde',
    email: ''
  })
  author.save();

  Article.find({}, '_id title _author',
    (err, results) => {
      if (err) throw err;
      console.log(results);
    });

 Author.find({}, '_id name',
    (err, results) => {
      if (err) throw err;
      console.log(results);
    })
  console.log("Connected to server:");




});

connection.on("close", () => {
  console.log("Closed connection to server.")
});
