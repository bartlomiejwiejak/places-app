const express = require('express');
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controller');
const fileUpLoad = require('../middleware/file-upload');

const router = express.Router();

router.get('/:placeId', placesControllers.getPlaceById)
router.get('/user/:userId', placesControllers.getPlacesByUserId)

router.post('/', fileUpLoad.single('image'), [
  check('title').not().isEmpty(),
  check('description').isLength({ min: 5 }),
  check('address').not().isEmpty()
], placesControllers.createPlace)
router.patch('/:placeId', [
  check('title').not().isEmpty(),
  check('description').isLength({ min: 5 })
], placesControllers.updatePlace)
router.delete('/:placeId', placesControllers.deletePlace)

module.exports = router;