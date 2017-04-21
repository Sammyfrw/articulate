//Module definition and setup
const DBConnection = require('../models/dbConnection');
const Article = require('../models/article').getModel(DBConnection);

//Controller function definition

//List articles
var show = (req, res, next) => {
  console.log("Show function called");
  Article.find({}, (err, articles) => {
    if(err) console.log("Error encountered: %s", err);
    console.log("Trying to find articles");
    let results = articles.map( (article) => {
      return {
        id: article._id,
        category: article.category,
        introduction: article.introduction,
        contents: article.contents,
        conclusion: article.conclusion
      }
    });
    console.log("Results returned; trying to render view");
    res.render('showArticlesView', {data: results});
  });
};

//Add article
var add = (req, res, next) => {
  res.render('addArticleView', {});
};

//Create article
var create = (req, res, next) => {
  let article = new Article({
    firstName: req.body.fname,
    lastName: req.body.lname
  });

  article.save((err) => {
    if(err) console.log("Error encountered: %s", err);
    res.redirect('/articles');
  });
};

//Edit article
var edit = (req, res, next) => {
  let id = req.params.id;

  Article.findById(id, (err, article) => {
    if(err) console.log("Cannot find article: %s ", err);
    if(!article) return res.render('404');

    res.render('editArticleView', {data: {id: article._id,
              firstName: article.firstName,
              lastName: article.lastName}
            });
  });
};

//Update article
var update = (req, res, next) => {
  let id = req.params.id;

  Article.findById(id, (err, article) => {
    if(err) console.log("Cannot find article: %s ", err);
    if(!article) return res.sender('404');
    article.firstName = req.body.fname;
    article.lastName = req.body.lname;

    article.save((err) => {
      if(err) console.log("Error updating article: %s ", err);
      res.redirect('/articles');
    });
  });
};

//Delete article
var destroy = (req, res, next) => {
  let id = req.params.id;

  Article.findById(id, (err, article) => {
    if(err) console.log("Cannot find article: %s", err);
    if(!article) return res.render('404');

    article.remove( (err) => {
      if(err) console.log("Error deleting article: %s", err);
      res.redirect('/articles');
    });
  });
};

//Exporting functions
module.exports = {
  show,
  add,
  create,
  edit,
  update,
  destroy
}
