const User = require('../models/user');
const Article = require('../models/article');

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

  try {
    const existingUser = await User.findByIdAndUpdate(userId, body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    res.status(201).json(existingUser);
  } catch (err) {
    console.log(err);

    next(err);
  }
}

async function getUser(req, res, next) {
  const userId = req.params.userId;

  try {
    const userArticles = await Article.find({owner: userId});

    const user = {...req.user, articles: userArticles};

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

    return res.status(200).json('User successfully deleted');
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function getArticlesByUserId(req, res, next) {
  const userId = req.params.userId;

  try {
    const userArticles = await Article.find({owner: userId}).populate('owner');

    res.status(201).json(userArticles);
  } catch (err) {
    console.log(err);

    next(err);
  }
}

module.exports = {createUser, updateUser, getUser, deleteUser, getArticlesByUserId};
