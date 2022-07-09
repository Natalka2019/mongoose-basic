const User = require('../models/user');
const errorHelper = require('../config/errorHelper');

async function checkIfUserExists(req, res, next) {
  const userId = req.params.userId;

  try {
    const existingUser = await User.findById(userId).lean();

    if (!existingUser) {
      throw errorHelper.badRequest(`User with id: ${userId} does not exist`);
    }

    req.user = existingUser;

    next();
  } catch (err) {
    console.log(err);

    next(err);
  }
}

module.exports = {checkIfUserExists};
