const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes)

app.use((req, res, next) => {          //for unsupported routes
  const error = newHttpError('Could not find this route', 404);
  throw error;
})

app.use((error, req, res, next) => {    //error middleware
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({ message: error.message || 'An unknown error  occurred!' })
})

app.listen(5000)