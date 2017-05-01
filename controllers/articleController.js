//Model and controller definition
const DBConnection = require('../models/dbConnection');
const Article = require('../models/Article').getModel(DBConnection);
const xmlParser = require('./xmlController.js')
const authorFinder = require('./authorController.js');

//Controller function definition

//List articles
var list = (req, res, next) => {
  Article.find({}).populate('_author', 'name').exec(function(err, articles){
    let articleList = articles.map( (article) => {
      return {
        id: article._id,
        title: article.title,
        author: article._author.name,
        category: article.category
      }
    });
    res.render('listArticlesView', {data: articleList});
  }).catch(function(err) {
    console.log("Error encountered: %s", err);
  });
}

//Show article
var show = (req, res, next) => {
  let id = req.params.id;

  Article.findOne({_id : id}).populate('_author').exec(function(err, article) {
    if (err) console.log("Cannot find article: %s ", err);
    if (!article) return res.render('404');
    res.render('showArticleView', {data: {
        id: req.params.id,
        title: article.title,
        author: article._author.name,
        category: article.category,
        introduction: article.introduction,
        contents: article.contents,
        conclusion: article.conclusion,
        published: article.published
      }
    })
  }).catch(function(err) {
    console.log("Error encountered: %s", err);
  });
}

//Show Article in Xml format
var showXml = (req, res, next) => {
 let id = req.params.id;

  Article.findOne({_id : id}).populate('_author').exec(function(err, article) {
    if (err) console.log("Cannot find article: %s ", err);
    if (!article) return res.render('404');
    let xml =
    '<?xml version="1.0"?>\n' +
    '<article id="' + article.id + '">\n' +
    '<title>' + article.title + '</title>\n' +
    '<introduction>' + article.introduction + '</introduction>\n' +
    '<contents>' + article.contents + '</contents>\n' +
    '<conclusion>' + article.conclusion + '</conclusion>\n' +
    '<category>' + article.category + '</category>\n' +
    '<author id="' + article._author._id + '">\n' +
    '<name>' + article._author.name + '</name>\n' +
    '<email>' + article._author.email + '</email>\n' +
    '</author>' + '</article>';

    res.type('application/xml');
    res.send(xml);
  }).catch(function(err) {
    console.log("Error encountered: %s", err);
  });
}


//Add article
var add = (req, res, next) => {
  res.render('addArticleView', {});
}

//Create article
var create = (req, res, next) => {

  //Check and create if author does not exist yet before creating article
  authorFinder.findOrSaveAuthor(req.body.author).then(function(author) {
    let article = new Article({
      title: req.body.title,
      _author: author._id,
      category: req.body.category,
      introduction: req.body.introduction,
      contents: req.body.contents,
      conclusion: req.body.conclusion,
      published: req.body.published
    });
    article.save((err) => {
      if(err) console.log("Error encountered: %s", err)
      console.log("Article created.");
      res.redirect('/articles/view');
    });
  }).catch(function(err) {
    console.log("Error encountered: %s", err);
  });
}

//Upload article via xml
var uploadXml = (req, res, next) => {
  let xmlResult
  let authorResult

  //Parse XML file then check if author in XML exists; create if nonexistant
  xmlParser.parseXml(req.body.xml)
  .then(function(result) {
    return xmlResult = result;
  }).then(function(xmlResult) {
    return authorResult = authorFinder.findOrSaveAuthor(xmlResult.article.author)
  }).then(function(authorResult) {

    let article = new Article({
      title: xmlResult.article.title,
      _author: authorResult._id,
      category: xmlResult.article.category,
      introduction: xmlResult.article.introduction,
      contents: xmlResult.article.contents,
      conclusion: xmlResult.article.conclusion,
      published: xmlResult.article.published
    });

    return article.save((err) => {
    if(err) console.log("Error encountered: %s", err)
      console.log("Article is saved.");
      res.redirect('/articles/view');
    });
  }).catch(function(err) {
    console.log("Error encountered: %s", err);
  });
}

//Edit article
var edit = (req, res, next) => {
  let id = req.params.id;

  Article.findOne({_id: id }).populate('_author').exec(function(err, article) {
    if(err) console.log("Cannot find article: %s ", err);
    if(!article) return res.render('404');
    res.render('editArticleView', {data: {
        id: article._id,
        title: article.title,
        author: article._author.name,
        category: article.category,
        introduction: article.introduction,
        contents: article.contents,
        conclusion: article.conclusion,
        published: article.published
      }
    });
  }).catch(function(err) {
    console.log("Error encountered: %s", err);
  });
};

//Update article
var update = (req, res, next) => {
  let id = req.params.id;

  //Check or create if author doesn't exist yet before updating
  authorFinder.findOrSaveAuthor(req.body.author).then(function(author) {
    Article.findById({_id: id}).populate('_author', 'name').exec(function (err, article) {
      if(err) console.log("Cannot find article: %s ", err);
      if(!article) return res.sender('404');

      article.title = req.body.title;
      article._author = author._id;
      article.category = req.body.category;
      article.introduction = req.body.introduction;
      article.contents = req.body.contents;
      article.conclusion = req.body.conclusion;
      article.published = req.body.published;

      return article.save((err) => {
        if(err) console.log("Error updating article: %s ", err);
      }).then(function() {
        console.log("Article is saved.");
        res.redirect('/articles/view/');
      });
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
  destroy,
  showXml,
  uploadXml
}
