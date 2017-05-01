//Express definition and setup
const express = require('express');
const router = express.Router();

//Controller setup
const article = require("./articleController");
const author = require("./authorController");

//Route specifications
router.get('/', (req, res, next) => {
  res.redirect('/articles/view');
});

//Article routes
router.get('/articles/view', article.list);
router.get('/articles/view/:id', article.show);
router.get('/articles/add', article.add);
router.post('/articles/add', article.create);
router.get('/articles/edit/:id', article.edit);
router.post('/articles/edit/:id', article.update);
router.get('/articles/delete/:id', article.destroy);
router.get('/articles/view/:id/xml', article.showXml);
router.post('/articles/uploadXml', article.uploadXml);

//Author routes
router.get('/authors/view', author.list);
router.get('/authors/view/:id', author.show);
router.get('/authors/add', author.add);
router.post('/authors/add', author.create);
router.get('/authors/edit/:id', author.edit);
router.post('/authors/edit/:id', author.update);
router.get('/authors/delete/:id', author.destroy);



//Export router
module.exports = router;

