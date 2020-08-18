const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');
const getCoordsForAdress = require('../utility/location');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId
  let place;
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place',
      500
    )
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not found a place for the provided id.', 404)
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) })
}

const addCommentToPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed. Please check your data', 422))
  }

  const placeId = req.params.placeId;
  let place;

  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError('Placing comment failed, try again later.', 500)
    return next(error);
  }
  if (!place) {
    const error = new HttpError('Place does not exist.', 404)
    return next(error);
  }

  let user;
  try {
    user = await User.findById(req.userData.userId)
  } catch (err) {
    const error = new HttpError('An unknown error accured.', 404)
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find an owner of a place.', 403)
    return next(error);
  }
  const comment = {
    id: uuidv4(),
    author: req.userData.userId,
    content: req.body.content
  }

  place.comments.push(comment)

  try {
    await place.save()
  } catch (err) {
    const error = new HttpError('Saving your comment failed, please try again later.', 401)
    return next(error);
  }
  res.json({ comment: comment })
}

const removeCommentByUserId = async (req, res, next) => {
  const userId = req.userData.userId;
  const placeId = req.params.placeId;
  const commentId = req.params.commentId;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Place does not exist.', 401)
    return next(error);
  }

  const comment = place.comments.find(comment => comment.id.toString() === commentId)

  if (!comment) {
    const error = new HttpError('Comment with provided id does not exist.', 401)
    return next(error);
  }

  if (comment.author !== userId) {
    const error = new HttpError('You are not allowed to delete this comment.', 401)
    return next(error);
  }

  place.comments = place.comments.filter(comment => comment.id.toString() !== commentId);

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError('Unknown error accured, please try again later.', 500);
    return next(error);
  }
  res.status(200).json({ comment: comment })
}

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId
  let places;

  try {
    places = await Place.find({ creator: userId })
  } catch (err) {
    const error = new HttpError('Fetchning places failed, please try again later.', 403)
    return next(error);
  }

  if (!places) {
    const error = new HttpError('User does not exist.', 500)
    return next(error);
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) })
}

const getPlacesByUsersId = async (req, res, next) => {
  const usersId = req.body.users;

  let places = [];
  if (usersId) {
    try {
      for (const userId of usersId) {
        const usersPlaces = await Place.find({ creator: userId })
        places = [...places, ...usersPlaces]
      }
    } catch (err) {
      const error = new HttpError('Something went wrong, please try again later.', 404)
      return next(error);
    }
  }

  res.status(200).json({ places: places })
}

const getCommentsByPlaceId = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Place doesnt exist.', 403)
    return next(error);
  }

  comments = place.comments;

  res.json({ comments: comments })
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed. Please check your data', 422))
  }

  const { title, description, address, date } = req.body;

  let coordinates;

  try {
    coordinates = await getCoordsForAdress(address);
  } catch (error) {
    return next(error)
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId,
    date
  })

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again later.', 500)
    return next(error)
  }

  if (!user) {
    const error = new HttpError('User with provided id does not exist', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess })
    user.places.push(createdPlace)
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Creating place failed. Please try again.', 500)
    return next(error);
  }

  res.status(201).json({ place: createdPlace })
}

const likePlace = async (req, res, next) => {
  const placeId = req.params.placeId;
  const userId = req.userData.userId;

  let place;
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError('Place does not exist.', 404);
    return next(error)
  }

  let isLiked = false;

  if (place.likes.find(id => id === userId)) {
    isLiked = true;
  }

  if (!isLiked) {
    place.likes.push(userId);
  } else {
    place.likes = place.likes.filter(id => id !== userId)
  }

  try {
    await place.save()
  } catch (err) {
    const error = new HttpError('Liking place failed, please try again later.', 404)
    return next(error)
  }

  res.status(200).json({ place: place.toObject({ getters: true }) })
}

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed. Please check your data.', 422))
  }

  const placeId = req.params.placeId;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Updating place failed. Please try again later.', 404)
    return next(error);
  }
  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this place.', 401)
    return next(error);
  }

  place.description = description;
  place.title = title;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update place.', 402)
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) })
}

const deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId).populate('creator'); //only when connection is set up, gets access to different colection
  } catch (err) {
    const error = new HttpError('Deleting place failed, please try again later.', 500)
    return next(error);
  }

  if (!place) {
    return next(new Error('Could not find place for this id.', 404))
  }

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError('You are not allowed to delete this place.', 401)
    return next(error);
  }

  const imagePath = place.image;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess })
    place.creator.places.pull(place)
    await place.creator.save({ session: sess })
    await sess.commitTransaction();
  } catch (err) {
    const error = new Http('Deleting place failed, please try again later.', 500)
    return next(error)
  }
  fs.unlink(imagePath, (err => {
    console.log(err);
  }));

  res.status(200).json({ deletedPlace: placeId })
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
exports.addCommentToPlace = addCommentToPlace;
exports.getCommentsByPlaceId = getCommentsByPlaceId;
exports.removeCommentByUserId = removeCommentByUserId;
exports.likePlace = likePlace;
exports.getPlacesByUsersId = getPlacesByUsersId;