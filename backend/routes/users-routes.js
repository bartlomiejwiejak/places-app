const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controller');
const fileUpLoad = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers)
router.get('/:userId', usersController.getUserById)
router.post('/signup', fileUpLoad.single('image'), [
  check('email').normalizeEmail().isEmail(),
  check('name').not().isEmpty(),
  check('password').isLength({ min: 6 })
], usersController.signup)
router.post('/login', usersController.login)

module.exports = router;