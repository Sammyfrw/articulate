//Model definition
const DBConnection = require('../models/dbConnection');
const Author = require('../models/author').getModel(DBConnection);

//Controller function definition

//list Authors
var list = (req, res, next) => {
  Author.find({}).exec(function(err, authors){
    let authorList = authors.map((author) => {
      return {
        id: author._id,
        name: author.name,
        email: author.email
      }
    });
    res.render('listAuthorsView', {data: authorsList});
  }).catch(function(err) {
    console.log("Error encountered: %s", err);
  });
}

//Show Author
var show = (req, res, next) => {
  let id = req.params.id;

  Author.findOne({_id: id}).exec(function(err, author){
    if (err) console.log("Cannot find author: %s", err);
    if (!author) return res.render('404');
    res.render('showAuthorView', data: {
      id: req.params.id,
      name: author.name,
      email: author.email
    });
  }).catch(function(err) {
    console.log("Error encountered: %s", err);
  });
}

//New Author
var new = (req, res, next) => {
  res.render('addAuthorView', {});
}

//Create Author

//Edit Author

//Update Author

//Delete Author


//Custom functions

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

module.exports = {
  findOrSaveAuthor
};

