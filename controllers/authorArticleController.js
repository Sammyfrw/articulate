/*Controller to handle all cross-controller/model functions between
Author and Article*/

//Module requirements definition
const DBConnection = require('../models/dbConnection');
const Article = require('../models/Article').getModel(DBConnection);
const Author = require('../models/author').getModel(DBConnection);

//Method to get all articles belonging to an author
var findArticles = (authorId) => {
  var query = Article.find({_author: authorId});
  return query.exec().then(function(articles) {
    return articles;
  }).catch(function(err){
    console.log("Error encountered in findArticles: %s", err);
  });
};

//Method to find an existing author or create an author if nonexistant
var findOrSaveAuthor = (authorName) => {
  var query = Author.findOne({name: authorName});
  return query.exec().then(function(author) {
    if (!author) {
      return createAuthor(authorName);
    }
  }).then(function(author) {
    return query.exec().catch(function(err) {
      console.log("Error encountered: %s", err);
    });
  });
}

//Method to create a new author
var createAuthor = (authorName) => {
  newAuthor = new Author ({
    name: authorName,
    email: ""
  })
  return newAuthor.save().then(function() {
    console.log("Created newAuthor " + newAuthor.name);
  }).catch(function(err) {
    console.log("Error creating new author: %s ", err);
  });
}

//Function exports
module.exports = {
  findArticles,
  findOrSaveAuthor,
  createAuthor
}
