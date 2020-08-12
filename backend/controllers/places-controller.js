const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error');
const getCoordsForAdress = require('../utility/location');
const Place = require('../models/place');

const PLACES = [
  {
    id: 'p1',
    title: 'Empire State',
    description: 'Most famous sky scraper',
    location: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
    adress: '20 W 34th St, New York, NY 10001, Stany Zjednoczone',
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Empire State',
    description: 'Most famous sky scraper',
    location: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
    adress: '20 W 34th St, New York, NY 10001, Stany Zjednoczone',
    creator: 'u1'
  }
]

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

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId
  let places;

  try {
    places = await Place.find({ creator: userId })
  } catch (err) {
    const error = new HttpError('Fetchning places failed, please try again later.')
    return next(error);
  }
  if (places.length === 0) {
    return next(new HttpError('Could not found places for the provided id.', 404))
  }
  res.json({ places: places.map(place => place.toObject({ getters: true })) })
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed. Please check your data', 422))
  }
  const { title, description, address, creator } = req.body;

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
    image: 'https://gfx.wiadomosci.radiozet.pl/var/radiozetwiadomosci/storage/images/polska/warszawa/warszawa-miastem-przyjaznym-osobom-niepelnosprawnym/5412603-1-pol-PL/Warszawa-z-prestizowym-wyroznieniem.-Jest-wzorem-dla-europejskich-miast_article.jpg',
    creator
  })
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError('Creating place failed. Please try again.', 500)
    return next(error);
  }

  res.status(201).json({ place: createdPlace })
}

const updatePlace = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed. Please check your data.', 422)
  }
  const placeId = req.params.placeId;
  const updatedPlace = { ...PLACES.find(place => placeId === place.id) };
  const { title, description } = req.body;
  updatedPlace.title = title;
  updatedPlace.description = description;

  const placeIndex = PLACES.findIndex(place => place.id === placeId)
  PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace })
}

const deletePlace = (req, res, next) => {
  const placeId = req.params.placeId;
  const index = PLACES.indexOf(place => place.id === placeId)
  if (index === -1) {
    throw new HttpError('Invalid place id.', 404)
  }
  PLACES.splice(index - 1, 1);

  res.status(200).json({ deletedPlace: placeId })
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;