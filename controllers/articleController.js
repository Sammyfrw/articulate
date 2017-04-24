//Module definition and setup
const DBConnection = require('../models/dbConnection');
const Article = require('../models/article').getModel(DBConnection);

//Controller function definition

//List articles
var list = (req, res, next) => {
  Article.find({}, (err, articles) => {
    if(err) console.log("Error encountered: %s", err);
    let results = articles.map( (article) => {
      return {
        id: article._id,
        title: article.title,
        category: article.category,
      }
    });
    res.render('listArticlesView', {data: results});
  });
};

//Show article
var show = (req, res, next) => {
  let id = req.params.id;

  Article.findById(id, (err, article) => {
    if (err) console.log("Cannot find article: %s ", err);
    if (!article) return res.render('404');

    res.render('showArticleView', {data: {
        title: article.title,
        category: article.category,
        introduction: article.introduction,
        contents: article.contents,
        conclusion: article.conclusion,
        published: article.published
      }
    })
  });
}

//Add article
var add = (req, res, next) => {
  res.render('addArticleView', {});
};

//Create article
var create = (req, res, next) => {
  let article = new Article({
    title: req.body.title,
    category: req.body.category,
    introduction: req.body.introduction,
    contents: req.body.contents,
    conclusion: req.body.conclusion,
    published: req.body.published
  });

  article.save((err) => {
    if(err) console.log("Error encountered: %s", err);
    res.redirect('/articles/view/');
  });
};

//Edit article
var edit = (req, res, next) => {
  let id = req.params.id;

  Article.findById(id, (err, article) => {
    if(err) console.log("Cannot find article: %s ", err);
    if(!article) return res.render('404');

    res.render('editArticleView', {data: {
        id: article._id,
        title: article.title,
        category: article.category,
        introduction: article.introduction,
        contents: article.contents,
        conclusion: article.conclusion,
        published: article.published
      }
    });
  });
};

//Update article
var update = (req, res, next) => {
  let id = req.params.id;

  Article.findById(id, (err, article) => {
    if(err) console.log("Cannot find article: %s ", err);
    if(!article) return res.sender('404');

    article.title = req.body.title;
    article.category = req.body.category;
    article.introduction = req.body.introduction;
    article.contents = req.body.contents;
    article.conclusion = req.body.conclusion;
    article.published = req.body.published;

    article.save((err) => {
      if(err) console.log("Error updating article: %s ", err);
      res.redirect('/articles/view/');
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
      res.redirect('/articles/view');
    });
  });
};

//Exporting functions
module.exports = {
  list,
  show,
  add,
  create,
  edit,
  update,
  destroy
}
