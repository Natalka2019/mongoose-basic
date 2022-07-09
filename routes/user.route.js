const express = require('express');
const router = express.Router();

const userMiddleware = require('../middlewares/userMiddleware');
const userController = require('../controllers/user');

router.post('/', userController.createUser);

router.put('/:userId', userMiddleware.checkIfUserExists, userController.updateUser);

router.get('/:userId', userMiddleware.checkIfUserExists, userController.getUser);

router.delete('/:userId', userMiddleware.checkIfUserExists, userController.deleteUser);

router.get(
  '/:userId/articles',
  userMiddleware.checkIfUserExists,
  userController.getArticlesByUserId
);

module.exports = router;
