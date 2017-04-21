//Express definition and setup
const express = require('express');
const router = express.Router();

//Controller setup
const article = require("./articleController");

//Route specifications
router.get('/', (req, res, next) => {
  res.redirect('/articles');
});

//Set up controller routes
router.get('/articles', article.list);
router.get('/articles/:id', article.show);
router.get('/articles/add', article.add);
router.post('/articles/add', article.create);
router.get('/articles/edit/:id', article.edit);
router.post('/articles/edit/:id', article.update);
router.get('/articles/delete/:id', article.destroy);

//Export router
module.exports = router;

