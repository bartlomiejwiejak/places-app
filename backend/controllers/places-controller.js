const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error')

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.placeId
  const place = PLACES.find(place => place.id === placeId)

  if (!place) {
    throw new HttpError('Could not found a place for the provided id.', 404)
  }

  res.json({ place })
}

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.userId
  const place = PLACES.find(place => place.creator === userId)
  if (!place) {
    return next(new HttpError('Could not found a place for the provided id.', 404))
  }
  res.json({ place })
}

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  PLACES.push(createdPlace)

  res.status(201).json({ place: createdPlace })
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;