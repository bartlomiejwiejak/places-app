const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)

app.use((req, res, next) => {          //for unsupported routes
  const error = new HttpError('Could not find this route', 404);
  throw error;
})

app.use((error, req, res, next) => {    //error middleware
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({ message: error.message || 'An unknown error  occurred!' })
})
//database connection
const connectUrl = 'mongodb+srv://bartek:ETIpEVnxlZmd8yfC@cluster0.uwdgo.gcp.mongodb.net/places?retryWrites=true&w=majority';
const connectConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}

mongoose
  .connect(connectUrl, connectConfig)
  .then(() => {
    app.listen(5000)
  })
  .catch(err => {
    console.log(err)
  })