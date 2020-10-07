const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')))
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join('build')))
}

app.use((req, res, next) => {   //prevents cors errors
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next()
})

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
  })
}

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
    })
  }  //error middleware
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({ message: error.message || 'An unknown error  occurred!' })
})
//database connection
const connectUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uwdgo.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const connectConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}

mongoose
  .connect(connectUrl, connectConfig)
  .then(() => {
    app.listen(PORT)
  })
  .catch(err => {
    console.log(err)
  })
