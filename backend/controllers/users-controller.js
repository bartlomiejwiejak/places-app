const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');

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

const signup = (req, res, next) => {
  const { name, password, email } = req.body;

  USERS.forEach(user => {
    if (user.email === email) return next(new HttpError('Email already exists', 401));
  })
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password
  }
  USERS.push(newUser)
  res.status(201).json({ newUser })
}

const login = (req, res, next) => {
  const { password, email } = req.body;
  let userId = null;
  USERS.forEach(user => {
    if (user.email === email && user.password === password) {
      userId = user.id;
    }
  })
  if (userId === null) {
    return next(new HttpError('No account found', 401));
  }
  res.json({ userId })
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;