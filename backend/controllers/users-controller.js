const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Fetching users failed, please try again later.', 400)
    return next(error)
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) })
}

const getUserById = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.userId, '-password')
  } catch (err) {
    const error = new HttpError('Could not find user with provided id.', 401);
    return next(error);
  }
  res.status(200).json({ name: user.name, places: user.places, image: user.image, description: user.description, followers: user.followers, following: user.following })
}

const updateUser = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {

    return next(new HttpError('Invalid inputs. Please check your data.'))
  }

  const reqId = req.params.id;
  const userId = req.userData.userId;

  if (reqId !== userId) {
    return next(new HttpError('You are not allowed to update provided user.', 500))
  }

  let user;

  try {
    user = await User.findById(reqId, '-password');
  } catch (err) {
    const error = new HttpError('Unknown error, please try again later.', 404)
    return next(error);
  }

  if (!user) {
    const error = new HttpError('User does not exist.', 500)
    return next(error);
  }

  user.name = req.body.name;
  user.description = req.body.description;
  if (req.file) {
    user.image = req.file.path;
  }

  try {
    user.save();
  } catch (err) {
    const error = new HttpError('Could not update your data, please try again later', 404);
    return next(error);
  }
  res.status(200).json({ user: user.toObject({ getters: true }) })
}

const signup = async (req, res, next) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {

    return next(new HttpError('Invalid inputs. Please check your data.'))
  }

  const { name, password, email } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.')
    return next(error)
  }
  if (existingUser) {
    const error = new HttpError('User exists already, please login instead.', 422)
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not create user, please try again.', 500)
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
    followers: [],
    followers: [],
    description: ''
  })
  try {
    await createdUser.save()
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.')
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, 'token_string', { expiresIn: '1h' })
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.')
    return next(error);
  }

  res.status(201).json({ user: createdUser.id, email: createdUser.email, token: token, image: createdUser.image, name: createdUser.name })
}

const login = async (req, res, next) => {
  const { password, email } = req.body;

  let user;

  try {
    user = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError('Loggin in failed, try again later.')
    return next(error);
  }
  if (!user) {
    return next(new HttpError('Invalid inputs, could not log you in.', 401));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password)
  } catch (err) {
    const error = new HttpError('Could not log you in with provided inputs, please check your credentials.', 500)
    return next(error);
  }

  if (!isValidPassword) {
    return next(new HttpError('Invalid inputs, could not log you in.', 403));
  }

  let token;
  try {
    token = jwt.sign({ userId: user.id, email: user.email }, 'token_string', { expiresIn: '1h' })
  } catch (err) {
    const error = new HttpError('Loggin in failed, please try again later.')
    return next(error);
  }


  res.json({
    user: user.id,
    email: user.email,
    token: token,
    image: user.image,
    name: user.name
  })
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById;
exports.updateUser = updateUser;