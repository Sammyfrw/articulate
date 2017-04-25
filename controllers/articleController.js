//Module definition and setup
const DBConnection = require('../models/dbConnection');
const Article = require('../models/Article').getModel(DBConnection);
const authorFinder = require('./authorController.js');
const xmlParser = require('./xmlController.js');

//Controller function definition

//List articles
var list = (req, res, next) => {
  Article.find({}, (err, articles) => {
    if(err) console.log("Error encountered: %s", err);
    let results = articles.map( (article) => {
      return {
        id: article._id,
        title: article.title,
        category: article.category
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

    article.populate('_author');
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
  });
}

//Show Article in Xml format
var showXml = (req, res, next) => {
 let id = req.params.id;

  Article.findById(id, (err, article) => {
    if (err) console.log("Cannot find article: %s ", err);
    if (!article) return res.render('404');
    article.populate('_author');

    let xml =
    '<?xml version="1.0"?>\n' +
    '<article id="' + article.id + '">\n' +
    '<title>' + article.title + '</title>\n' +
    '<introduction>' + article.introduction + '</introduction>\n' +
    '<contents>' + article.contents + '</contents>\n' +
    '<conclusion>' + article.conclusion + '</conclusion>\n' +
    '<category>' + article.category + '</category>\n' +
    '</article>' +
    '<author id="' + article.author._id + '">\n' +
    '<name>' + article.author.name + '</name>\n' +
    '<email>' + article.author.email + '</email>\n' +
    '</author>';

    res.type('application/xml');
    res.send(xml);
  });
}


//Add article
var add = (req, res, next) => {
  res.render('addArticleView', {});
};

//Create article
var create = (req, res, next) => {

  //Check if author already exists
  authorFinder.findOrSaveAuthor(req.body.author).then(function(author_id) {
    console.log("author id is"  + author_id);
    let article = new Article({
      title: req.body.title,
      _author: author_id,
      category: req.body.category,
      introduction: req.body.introduction,
      contents: req.body.contents,
      conclusion: req.body.conclusion,
      published: req.body.published
    });
    article.save((err) => {
      if(err) console.log("Error encountered: %s", err)
        res.redirect('/articles/view');
    });
  });
}

    /*.then(function(article) {
      article.save((err) => {
        if(err) console.log("Error encountered: %s", err)
      })
       res.redirect('/articles/view/');
    }).catch(function(err) {
      console.log("Error encountered: %s", err);
    });
  });
};
*/
/*
//Show xml form
var addXml = (req, res, next) => {
  res.render('xmlArticleView', {});
}
*/

//Upload article via xml
var uploadXml = (req, res, next) => {
  //Parse xml code through xmlController
  let result = xmlParser.parseXml(req.body.xml);

  //Check if author already exists
  let articleAuthor = authorFinder.findOrSaveAuthor(result.article.author);

  //Create new article through xml parsing
  let article = new Article({
    title: result.article.title,
    _author: articleAuthor._id,
    category: result.article.category,
    introduction: result.article.introduction,
    contents: result.article.contents,
    conclusion: result.article.conclusion,
    published: result.article.published
  });

  article.save((err) => {
    if(err) console.log("Error encountered: %s", err);
    res.redirect('/articles/view/');
  });
}


//Edit article
var edit = (req, res, next) => {
  let id = req.params.id;

  Article.findById(id, (err, article) => {
    if(err) console.log("Cannot find article: %s ", err);
    if(!article) return res.render('404');
    article.populate('_author');
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
  });
};

//Update article
var update = (req, res, next) => {
  let id = req.params.id;

  //Check if author already exists
  let articleAuthor = authorFinder.findOrSaveAuthor(result.article.author);

  Article.findById(id, (err, article) => {
    if(err) console.log("Cannot find article: %s ", err);
    if(!article) return res.sender('404');

    article.title = req.body.title;
    article._author = articleAuthor._id;
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
  destroy,
  //  addXml,
  showXml,
  uploadXml
}
