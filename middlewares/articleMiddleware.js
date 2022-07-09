const Article = require('../models/article');
const errorHelper = require('../config/errorHelper');

async function checkIfArticleExists(req, res, next) {
  const articleId = req.params.articleId;

  try {
    const existingArticle = await Article.findById(articleId);

    if (!existingArticle) {
      throw errorHelper.badRequest(`Article with id: ${articleId} does not exist`);
    }

    req.article = existingArticle._doc;

    next();
  } catch (err) {
    console.log(err);

    next(err);
  }
}

module.exports = {checkIfArticleExists};
