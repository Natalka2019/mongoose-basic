const express = require('express');
const router = express.Router();

const articleMiddleware = require('../middlewares/articleMiddleware');
const articleController = require('../controllers/article');

router.post('/', articleController.createArticle);

router.put('/:articleId', articleMiddleware.checkIfArticleExists, articleController.updateArticle);

router.get('/', articleController.getArticles);

router.delete(
  '/:articleId',
  articleMiddleware.checkIfArticleExists,
  articleController.deleteArticle
);

module.exports = router;
