const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

const HttpError = require('../models/http-error');
const User = require('../models/user');
const Place = require('../models/place');

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
    const error = new HttpError('Could not fetch user, please try again later.', 401);
    return next(error);
  }
  if (!user) {
    const error = new HttpError('Could not find user with provided id..', 404);
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
    follows: [],
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

  res.status(201).json({ user: createdUser.id, email: createdUser.email, token: token, image: createdUser.image, name: createdUser.name, followers: createdUser.followers, follows: createdUser.follows })
}

const deleteAccount = async (req, res, next) => {
  const id = req.params.id;
  const userId = req.userData.userId;
  let user;
  try {
    user = await User.findById(id, '-password')
  } catch (err) {
    return next(new HttpError('User with provided id does not exist.', 401))
  }

  if (id !== userId) {
    return next(new HttpError('You are not allowed to delete this account.', 500))
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await user.remove({ session: sess })
    user.places.forEach(async placeId => {
      const place = await Place.findById(placeId)
      place.remove({ session: sess })
    })
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError('Deleting user failed, please try again later.', 500))
  }
  res.status(201).json({ user: user.toObject({ getters: true }) })
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
    name: user.name,
    followers: user.followers,
    following: user.following
  })
}

const followUser = async (req, res, next) => {
  const id = req.params.id;
  const userId = req.userData.userId;

  if (id === userId) {
    const error = new HttpError('Unable to follow yourself.', 403)
    return next(error);
  }

  let followedUser;
  try {
    followedUser = await User.findById(id)
  } catch (err) {
    const error = new HttpError('Unknown error accured, please try again later.', 500)
    return next(error);
  }

  let followingUser;
  try {
    followingUser = await User.findById(userId)
  } catch (err) {
    const error = new HttpError('Unknown error accured, please try again later.', 500)
    return next(error);
  }

  if (followedUser.followers.find(follower => follower === userId)) {
    followedUser.followers = followedUser.followers.filter(follower => follower !== userId)
    followingUser.following = followingUser.following.filter(followingUser => followingUser !== id)
  } else {
    followedUser.followers.push(userId);
    followingUser.following.push(id);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await followingUser.save({ session: sess })
    await followedUser.save({ session: sess })
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError('Following user failed, please try again later', 500))
  }
  res.status(201).json({ personId: id })
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteAccount = deleteAccount;
exports.followUser = followUser;