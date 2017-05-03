//Model and controller definition
const DBConnection = require('../models/dbConnection');
const Article = require('../models/Article').getModel(DBConnection);
const xmlParser = require('./xmlController.js')
const authorFinder = require('./authorArticleController.js');
const S = require('string');
const _ = require('underscore');
const async = require('async');


//Controller function definition

//List articles
var list = (req, res, next) => {
  Article.find({}).populate('_author', 'name').exec(function(err, articles){
    if (!articles) return res.render('404');
    let articleList = articles.map( (article) => {
      return {
        id: article._id,
        title: article.title,
        author: article._author.name,
        category: article.category
      }
    });
    return res.render('listArticlesView', {data: articleList});
  }).catch(function(err) {
    console.log("Error encountered in outer articles: %s", err);
  });
}

//Show article
var show = (req, res, next) => {
  let id = req.params.id;
  Article.findOne({_id: id}).populate('_author', 'name').exec(function(err, article) {
    if(err) console.log("Cannot find article: %s", err);
    if(!article) return res.sender('404');

    return res.render('showArticleView', {data: {
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
}



//Alternate Show article
/*
var show = (req, res, next) => {
  let id = req.params.id;

  Article.findOne({_id : id}).populate('_author').then(function(article) {
    if (!article) return res.render('404');

    return Promise.resolve(replaceTextLinks(article.introduction)).then(function(text){
      console.log("Returned text is" + text)
    });


  });
}

var replaceTextLinks = (text) => {
  let regExp = /<<([a-zA-z0-9 ]+)>>/g;
  console.log("Initial passed in text is: " + text)
  return Promise.resolve(text.match(regExp)).then(function(matchArray){
    console.log("Matched array is: " + matchArray);
    async.each(matchArray, function(matchText){
      console.log("Matched Text is: " + matchText);
      return linkArticle(text, matchText);
    });
  }).catch(function(err){
    console.log("Error encountered: %s", err);
  });
}

var linkArticle = (text, matchText) => {
  let regExp = /([a-zA-Z]+)/g;
  return Promise.resolve(matchText.match(regExp)).then(function(linkedArticle){
    console.log("Linked Article is: " + linkedArticle);
    return Promise.resolve(matchArticle(text, matchText ,linkedArticle));
  })
}

var matchArticle = (text, matchText, linkedArticle) => {
  return Article.findOne({title:linkedArticle}).then(function(matchedArticle) {
    console.log("matchedArticle is: " + matchedArticle);
    if(matchedArticle) {
      return Promise.resolve(replaceTextWithArticle(text, matchText, matchedArticle, linkedArticle));
    }
  })
}

var replaceTextWithArticle = (text, matchText, matchedArticle, linkedArticle) => {
  console.log("Replacing initial text: " + text);
  replacedText = '<a href=' + '/articles/view/' + matchedArticle._id + ">" + linkedArticle + "</a>"
  return Promise.resolve(S(text).replaceAll(matchText, replacedText).s).then(function(newText){
    console.log("Replaced text is: " + newText);
    return Promise.resolve(newText);
  })
}
*/

// .then(function(promisedText){
//       console.log("Promised text is" + promisedText);
//       return Promise.resolve(promisedText);
//     });
  /*
    let articleData = {
      id: article._id,
      title: article.title,
      author: article._author.name,
      category: article.category,
      introduction: Promise.resolve(replaceTextLinks(article.introduction)),
      contents: "",
      conclusion: "",
      published: article.published
    }
    let newText = "abcd";
    console.log("newText is" + newText);
    */
/*
    Promise.resolve(replaceTextLinks(article.introduction)).then(function(linkedIntroduction){
      console.log('linked intro is  ' + linkedIntroduction);
      articleData.introduction = linkedIntroduction;
    }).then(replaceTextLinks(article.contents)).then(function(linkedContents){
      console.log("linked contents is " + linkedContents);
      articleData.contents = linkedContents;
    }).then(replaceTextLinks(article.conclusion)).then(function(linkedConclusion){
      articleData.conclusion = linkedConclusion;
    }).then(function(){
      return res.render('showArticleView', {data: articleData})
    //return Promise.resolve(promises);
    }).catch(function(err) {
      console.log("Error encountered: %s", err);
    });
  });

*/

/*
    return Article.findOne({_id : id}).populate('_author').then(function(innerArticle){
      let regExp = /<<([a-zA-z0-9 ]+)>>/g;
      text = innerArticle.introduction;
      // var newText = text;
      var matchArray = text.match(regExp);
      console.log(matchArray);
      var promises = _.each(matchArray,
        function(match) {

        console.log("Match " + match);
        linkedArticle = S(match).between('<<','>>').s;
        console.log("Linked Article " + linkedArticle);

        return Article.findOne({title:linkedArticle}).then(function(matchedArticle) {
          console.log("matchedArticle " + matchedArticle);
          if(matchedArticle) {
            console.log("Replacing start" + text);
            replaceText = '<a href=' + '/articles/view/' + matchedArticle._id + ">" + linkedArticle + "</a>"
            newText = S(text).replaceAll(match, replaceText).s;
            console.log("Replacing end?" + newText);
            return Promise.resolve(newText);
          }
        }).then(function(promisedText){
          console.log("Promisedtext" + promisedText)
          newText = promisedText;
          return promisedText;
        }).catch(function(err) {
          console.log("Error encounteredon innercatch: %s", err)
        });
      });
      return Promise.all(promises);
    }).then(function(){
      console.log("Newtext" + newText);
      return articleData.introduction = newText;
    }).then(function(){
      res.render('showArticleView', {data:articleData});
    }).catch(function(err) {
      console.log("Error encountered: %s", err);
    });
  });
}
*/

  /*
    // var linkedIntroduction = replaceTextLinks(article.introduction);
    // var linkedContents = replaceTextLinks(article.contents);

    // console.log(linkedIntroduction);
    /*
    var matchArray = linkedIntroduction.match(regExp)
    console.log(matchArray);
    _.each(matchArray,
      function(match) {

      console.log("Match " + match);
      linkedArticle = S(match).between('<<','>>').s;
      console.log("Linked Article " + linkedArticle);

      return Article.findOne({title:linkedArticle}).then(function(matchedArticle) {
        console.log("matchedArticle " + matchedArticle);
        if(matchedArticle) {
          console.log("Replacing start" + linkedIntroduction);
          let replaceText = '<a href=' + '/articles/view/' + matchedArticle._id + ">" + linkedArticle + "</a>"
          linkedIntroduction = S(linkedIntroduction).replaceAll(match, replaceText).s;
          console.log("Replacing end?" + linkedIntroduction);
        }
      }).catch(function(err) {
        console.log("Error encounteredon innercatch: %s", err)
      });

    });
    */
  //}).then(function(){



/*
  var promises = _.each(matchArray, function(match) {
    console.log("Match " + match);
    return asyncMatch(match, text)
  })
*/

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

//Custom functions



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
