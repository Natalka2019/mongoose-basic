const Article = require('../models/article');
const User = require('../models/user');
const mongoose = require('mongoose');
const errorHelper = require('../config/errorHelper');
const util = require('../config/util');

async function createArticle(req, res, next) {
  try {
    if (!req.body.owner || !mongoose.isValidObjectId(req.body.owner)) {
      return next(errorHelper.badRequest("Owner's id is not valid"));
    }

    const existingArticle = await Article.findOne({title: req.body.title});

    if (existingArticle) {
      throw errorHelper.badRequest('Article exists');
    }

    const owner = await User.findById(req.body.owner);

    if (!owner) {
      return next(errorHelper.badRequest('There is no owner with such id'));
    }

    const article = await Article.create(req.body);

    owner.numberOfArticles += 1;

    await owner.save();

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
}

async function updateArticle(req, res, next) {
  const articleId = req.params.articleId;
  const body = req.body;

  try {
    const existingArticle = await Article.findByIdAndUpdate(articleId, body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    if (!existingArticle) {
      throw errorHelper.badRequest('Article does not exists');
      //return res.status(404).send();
      //return next(errorHelper.badRequest('User does not exist'));
    }

    res.status(201).json(existingArticle);
  } catch (err) {
    console.log(err);
    //res.status(400).send(err);
    next(err);
  }
}

async function deleteArticle(req, res, next) {
  const articleId = req.params.articleId;

  try {
    await Article.findOneAndDelete({_id: articleId});

    const owner = await User.findById(req.body.owner);

    owner.numberOfArticles -= 1;

    await owner.save();

    return res.status(200).json({});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function getArticles(req, res, next) {
  try {
    const {
      query: {skip = 0, limit = 10, search = '', sort: sortFromClient}
    } = req;
    const sort = util.sort(sortFromClient);
    const filter = {$regex: new RegExp(util.escapeRegExpChars(search), 'i')};
    const query = {
      $or: [
        {title: filter},
        {description: filter},
        {owner: filter},
        {category: filter},
        {createdAt: filter},
        {updatedAt: filter}
      ]
    };
    const result = await Article.find(query).populate('owner').sort(sort).skip(skip).limit(limit);

    res.status(201).json(result);
  } catch (err) {
    console.log(err);

    next(err);
  }
}

module.exports = {createArticle, updateArticle, deleteArticle, getArticles};
