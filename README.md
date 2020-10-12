# Places App
![user-profile](https://user-images.githubusercontent.com/63016300/91147148-26599f00-e6b8-11ea-8e9d-c49b5592fcf1.jpg)
This is a repository of my personal project "Places App". 

## Overview
Places App is full stack application. The project connects four main technologies which are React, Express, MongoDB and Node.js, as well Mongoose to model application data.

## Getting started
You need to have Node.js and npm installed to run this project locally. In your terminal provide commands below:

```
# Clone the project.
git clone https://github.com/bartlomiejwiejak/places-app.git

# Install npm dependencies.
npm install
```

Application uses env variables, so you have to create .env file in the root of this application as well as nodemon.json file for backend data:

```
# .env file
REACT_APP_GOOGLE_API=YOUR_GOOGLE_API_KEY
REACT_APP_BACKEND_URL=http://localhost:5000
```

```
# nodemon.json file
{
  "env": {
    "DB_USER": "DATABASE_USER_NAME",
    "DB_PASSWORD": "DATABASE_PASSWORD",
    "DB_NAME": "DATABASE_NAME",
    "GOOGLE_API_KEY": "YOUR_GOOGLEMAPS_API_KEY",
    "JWT_KEY": "YOUR_TOKEN_KEY"
  }
}
```

After that, you are able to run this project without any problems, by running commands:

```
# runs backend server:
npm run nodemon

# runs frontend:
npm start
