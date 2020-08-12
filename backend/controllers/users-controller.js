const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error');
const User = require('../models/user');

const USERS = [
  {
    id: 'u1',
    name: 'Bart',
    email: 'hello@bartlomiejwiejak.com',
    password: '123456'
  },
  {
    id: 'u2',
    name: 'Alex',
    email: 'hello@alex.com',
    password: '123456'
  }
]

const getUsers = (req, res, next) => {
  res.json({ users: USERS })
}

const signup = async (req, res, next) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs. Please check your data.'))
  }

  const { name, password, email, places } = req.body;
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

  const createdUser = new User({
    name,
    email,
    image: 'https://png.pngtree.com/element_our/png/20181206/users-vector-icon-png_260862.jpg',
    password,
    places
  })
  try {
    await createdUser.save()
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.')
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) })
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
  if (!user || user.password !== password) {
    return next(new HttpError('Invalid inputs, could not log you in.', 401));
  }

  res.json({ message: 'Logged in' })
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;