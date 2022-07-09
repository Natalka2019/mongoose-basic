const User = require('../models/user');
const Article = require('../models/article');
const errorHelper = require('../config/errorHelper');

async function createUser(req, res, next) {
  try {
    const user = await User.create(req.body);

    return res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  const userId = req.params.userId;
  const body = req.body;

  console.log(body);

  try {
    const existingUser = await User.findByIdAndUpdate(userId, body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    if (!existingUser) {
      throw errorHelper.badRequest('User does not exists');
      //return res.status(404).send();
      //return next(errorHelper.badRequest('User does not exist'));
    }

    res.status(201).json(existingUser);
  } catch (err) {
    console.log(err);
    //res.status(400).send(err);
    next(err);
  }
}

async function getUser(req, res, next) {
  const userId = req.params.userId;

  try {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).send();
      //return next(errorHelper.badRequest('User does not exist'));
    }

    const userArticles = await Article.find({owner: userId});

    console.log(userArticles);

    const user = {...existingUser._doc, articles: userArticles};

    console.log(user);

    res.status(201).json(user);
  } catch (err) {
    console.log(err);

    next(err);
  }
}

async function deleteUser(req, res, next) {
  const userId = req.params.userId;

  try {
    await User.findOneAndDelete({_id: userId});

    return res.status(200).json({});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function getArticlesByUserId(req, res, next) {
  const userId = req.params.userId;

  try {
    const userArticles = await Article.find({owner: userId});

    console.log(userArticles);

    res.status(201).json(userArticles);
  } catch (err) {
    console.log(err);

    next(err);
  }
}

module.exports = {createUser, updateUser, getUser, deleteUser, getArticlesByUserId};
