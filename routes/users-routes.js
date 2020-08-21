const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controller');
const fileUpLoad = require('../middleware/file-upload');
const checkAuth = require('../middleware/auth');

const router = express.Router();

router.get('/', usersController.getUsers)
router.get('/:userId', usersController.getUserById)
router.post('/signup', fileUpLoad.single('image'), [
  check('email').normalizeEmail().isEmail(),
  check('name').not().isEmpty(),
  check('password').isLength({ min: 6 })
], usersController.signup)
router.post('/login', usersController.login)

router.use(checkAuth);

router.patch('/:id', fileUpLoad.single('image'), [
  check('name').not().isEmpty()
], usersController.updateUser)
router.delete('/:id', usersController.deleteAccount)
router.patch('/:id/follow', usersController.followUser)

module.exports = router;