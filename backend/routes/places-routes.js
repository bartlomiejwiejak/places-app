const express = require('express');
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controller');
const fileUpLoad = require('../middleware/file-upload');
const checkAuth = require('../middleware/auth');
const place = require('../models/place');

const router = express.Router();

router.get('/:placeId', placesControllers.getPlaceById)
router.get('/user/:userId', placesControllers.getPlacesByUserId)
router.get('/:placeId/comments', placesControllers.getCommentsByPlaceId)

router.use(checkAuth);

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
router.patch('/:placeId/comments', [
  check('content').not().isEmpty()
], placesControllers.addCommentToPlace)
router.delete('/:placeId/comments/:commentId', placesControllers.removeCommentByUserId)

module.exports = router;