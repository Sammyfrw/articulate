const DBConnection = require('../models/dbConnection');
const Author = require('../models/author').getModel(DBConnection);

//Method to find an existing author or create an author if nonexistant
var findOrSaveAuthor = (authorName) => {
  let author = Author.findOne({name: authorName});

    if (!author) {
    author = new Author({
      name: authorName,
      email: ""
    })
    author.save((err) => {
      if(err) console.log("Error encountered: %s", err);
    });
  };
  return author;
}

module.exports = {
  findOrSaveAuthor
};
