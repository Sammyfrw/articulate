//Model and controller definition
const DBConnection = require('../models/dbConnection');
const Article = require('../models/Article').getModel(DBConnection);
const async = require('async');
const S = require('string');

var show = (req, res, next) => {
  let id = req.params.id;

//Start by searching for article from the URL
  Article.findOne({_id : id}).populate('_author').then(function(article) {
    if (!article) return res.render('404');

//Define data to be sent to user's show page; introduction, contents and conclusion will be modified with replaceTextLinks below
    let articleData = {
      id: article._id,
      title: article.title,
      author: article._author.name,
      category: article.category,
      introduction: article.introduction,
      contents: "",
      conclusion: "",
      published: article.published
    }

//Only article introduction is examined right now
    return Promise.resolve(replaceTextLinks(article.introduction)).then(function(text){
      // articleData.introduction = text;
      console.log("Returned text is" + text)
    }).then(function(){
      return res.render('showArticleView', {data: articleData});
    }).catch(function(err){
      console.log("Error encountered: %s", err);
    });
  });
}

//Initial function, match all instances of text that matches the Regexp (e.g. <<ArticleTitle>> -- creates an array)
var replaceTextLinks = (text) => {
  let regExp = /<<([a-zA-z0-9 ]+)>>/g;
  console.log("Initial passed in text is: " + text)
  return Promise.resolve(text.match(regExp)).then(function(matchArray){
    console.log("Matched array is: " + matchArray);
    //Async module used to run through each  string in the array, where linkArticle function is used
    async.each(matchArray, function(matchText){
      console.log("Matched Text is: " + matchText);
      return linkArticle(text, matchText);
    });
  }).catch(function(err){
    console.log("Error encountered: %s", err);
  });
}


//second function, pulls out Article's name from inside the brackets (e.g. <<ArticleTitle>> will return ArticleTitle) and runs matchArticle
var linkArticle = (text, matchText) => {
  let regExp = /([a-zA-Z]+)/g;
  return Promise.resolve(matchText.match(regExp)).then(function(linkedArticle){
    console.log("Linked Article is: " + linkedArticle);
    return Promise.resolve(matchArticle(text, matchText ,linkedArticle));
  })
}

//Third function, finds an article name based on the string passed in. Name is compared to the Article collection for a match, then article is passed in
var matchArticle = (text, matchText, linkedArticle) => {
  return Article.findOne({title:linkedArticle}).then(function(matchedArticle) {
    console.log("matchedArticle is: " + matchedArticle);
    if(matchedArticle) {
      return Promise.resolve(replaceTextWithArticle(text, matchText, matchedArticle, linkedArticle));
    }
  })
}

//Fourth function replaces the initial text with a new text that changes all instances of the tag in the text to an HTML link
var replaceTextWithArticle = (text, matchText, matchedArticle, linkedArticle) => {
  console.log("Replacing initial text: " + text);
  replacedText = '<a href=' + '/articles/view/' + matchedArticle._id + ">" + linkedArticle + "</a>"
  //Using stringjs module to replace all (matchText) in (text) with (replacedText)
  return Promise.resolve(S(text).replaceAll(matchText, replacedText).s).then(function(newText) {
    console.log("Replaced text is: " + newText);
    return Promise.resolve(newText);
  })
}

/*
Console Log:

Initial passed in text is: This article contains a tag, <<Privacy>>.
Matched array is: <<Privacy>>
Matched Text is: <<Privacy>>
Linked Article is: Privacy
Returned text isundefined
matchedArticle is: { _id: 5909f3efe8d05c4e3827c4d1,
  title: 'Privacy',
  _author: 5909f3eee8d05c4e3827c4d0,
  category: 'Security',
  introduction: 'Type your article\'s introduction here...',
  contents: 'Type your article\'s content here...',
  conclusion: 'Type your article\'s conclusion here...',
  __v: 0,
  published: false }
Replacing initial text: This article contains a tag, <<Privacy>>.
Replaced text is: This article contains a tag, <a href=/articles/view/5909f3efe8d05c4e3827c4d1>Privacy</a>.
*/
