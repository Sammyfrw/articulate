const DBConnection = require('../models/dbConnection');
const Author = require('../models/author').getModel(DBConnection);

//Method to find an existing author or create an author if nonexistant
var findOrSaveAuthor = (authorName) => {
  console.log("checking for " + authorName + "...")
  return Author.findOne({name: authorName}).then(function(author) {
    if (!author) {
      console.log("Name not found");
      newAuthor = new Author({
        name: authorName,
        email: ""
      }).then(function(newAUthor) {
        newAuthor.save((err) => {
          if(err) console.log("Error encountered: %s", err);
          console.log("Author saved")
          author = newAuthor;
        });
      })
    };
    console.log("Author details: " + author._id + " " + author.name + " " + author.email);
    return author._id;
  }).catch(function(err) {
    console.log("Error encountered: %s", err);
  });
}


/*
      return exec();
  return promise;
}

  Author.findOne({name: authorName}, function(err, author){
    if (err) console.log ("Encountered: %s", err);

    if (!author) {
    console.log("Name not found");
    author = new Author({
      name: authorName,
      email: ""
    })
    author.save((err) => {
      if(err) console.log("Error encountered: %s", err);
      console.log("Author saved")
    });
  };
  console.log("Author details: " + author._id + " " + author.name + " " + author.email);
  foundAuthor = author;
  });
  return foundAuthor;
}
*/
module.exports = {
  findOrSaveAuthor
};
