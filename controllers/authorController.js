//Model definition
const DBConnection = require('../models/dbConnection');
const Author = require('../models/author').getModel(DBConnection);
const articleFinder = require('./authorArticleController');

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
    res.render('listAuthorsView', {data: authorList});
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
      articleFinder.findArticles(id).then(function(articles) {
        res.render('showAuthorView', {data: {
          id: req.params.id,
          name: author.name,
          email: author.email,
          articles: articles
          }
        });
      });
    }).catch(function(err) {
      console.log("Error encountered: %s", err);
    })
}

//New Author
var add = (req, res, next) => {
  res.render('addAuthorView', {});
}

//Create Author
var create = (req, res, next) => {
  let newAuthor = new Author({
    name: req.body.name,
    email: req.body.email
  });

  //check if author already exists; create if not
  findExistingAuthor(newAuthor.name).then(function(author) {
    if (!author) {
      newAuthor.save().then(function(author){
        console.log("Author created.")
        res.redirect('/authors/view');
      }).catch(function(err) {
        console.log("Error encountered: %s", err);
      })
    } else {
      console.log("Author already exists.")
      res.render('addAuthorView', {});
    }
  }).catch(function(err) {
    console.log("Error encountered: %s", err);
  });
}

//Edit Author
var edit = (req, res, next) => {
  let id = req.params.id;

  Author.findOne({_id: id}).exec(function(err, author) {
    if(err) console.log("Cannot find author: %s", err);
    if(!author) return res.render('404');
    res.render('editAuthorView', {data: {
      id: author._id,
      author: author.name,
      email: author.email
    }
    });
  }).catch(function(err) {
    console.log("Error encountered: %s", err);
  })
}

//Update Author
var update = (req, res, next) => {
  let id = req.params.id;

  //Find Author by id
  Author.findById({_id: id}).exec(function(err, author) {
    if(err)console.log("Cannot find author: %s", err);
    if(!author) return res.sender('404');

    //Check if changes are not made
    if(author.name == req.body.name && author.email == req.body.email) {
      console.log("No changes made.");
      res.redirect('/authors/view');
    }

    //Check if edited author name is already taken; save if not
    if (author.name != req.body.name) {
      findExistingAuthor(req.body.name).then(function(err, existingAuthor) {
        if(existingAuthor) {
          console.log("Author with that new name already exists.");
          res.redirect('/authors/edit/' + id);
        } else {
          author.name = req.body.name;
          author.email = req.body.email;
          author.save().then(function(author){
            console.log("Author saved.")
            res.redirect('/authors/view');
          }).catch(function(err) {
            console.log("Error encountered: %s", err);
          })
        }
      }).catch(function(err) {
        console.log("Error encountered: %s", err);
      });
    }
  });
}

//Delete Author
var destroy = (req, res, next) => {
  let id = req.params.id;

  Author.findById(id, (err, author) => {
    if(err) console.log("Cannot find author: %s", err);
    if(!author) return res.render('404');

    author.remove( (err) => {
      if(err) console.log("Error deleting author: %s", err);
      res.redirect('/authors/view');
    });
  });
};

//Custom functions



//Validate an author is unique
var findExistingAuthor = (authorName) => {
  return Author.findOne({name: authorName}).exec().catch(function(err){
    console.log("Error encountered: %s", err);
  })
}

module.exports = {
  list,
  show,
  add,
  create,
  edit,
  update,
  destroy,
};

