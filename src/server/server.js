/*
  Evan MacHale - N00150552
  25.05.19
  server.js
*/

const { ObjectID } = require('mongodb');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo')(session);
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const passport = require('./passport');

// loads environment variables from a .env file into process.env
require('dotenv').config();

const server = express();

/*
  Connection
*/

// URL to our DB - loaded from an env variables
const dbURI = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;

mongoose.connect(dbURI, { useNewUrlParser: true }, (err) => {
  if (err) {
    throw err;
  } else {
    server.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
  }
});

/*
  Middleware
*/

// serve files from the dist directory
server.use(express.static(path.join(__dirname, '/public'))); // Needed?
server.use(express.static('dist'));
// bodyParser, parses the request body to be a readable json format
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false,
}));
server.use(passport.initialize());
server.use(passport.session());

/*
  Authentication Routes
*/

/*
  Request made in App.jsx
  Using JWT Check to see if the user has logged in recently
*/
server.get('/api/token', (req, res, next) => {
  if (req.cookies.token) {
    req.headers.authorization = `Bearer ${req.cookies.token}`;
    passport.authenticate('jwt', (err, user) => {
      if (user) res.send(user.id);
    })(req, res, next);
  } else {
    res.status(401).send('No token found');
  }
});

/*
  Request made in Register.jsx
  Validates the req.body + saves a new User
*/
server.post('/api/register', (req, res) => {
  const {
    username,
    email,
    password,
    confirm,
  } = req.body;
  if (username === '' || email === '' || password === '' || confirm === '') {
    res.status(500).send('Missing credentials');
    return;
  }
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!regex.test(email)) {
    res.status(500).send('Invalid email');
    return;
  }
  if (password !== confirm || password === '' || confirm === '') {
    res.status(500).send('Passwords do not match');
    return;
  }
  const user = new User({ username, email, password });
  /*
    Watch out in console for:
    Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    res.send()
  */
  user.save((err) => {
    if (err) {
      res.status(500).send('Error registering new user please try again.');
      return;
    }
    res.status(200).send('Successful sign up');
  });
});

/*
  Request made in Login.jsx
  Using local strategy from Passport.js w/ custom callback
  If strategy successful, initialise a new JWT
*/
server.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    /*
      If this function gets called, authentication was successful.
      `req.user` contains the authenticated user.
    */
    if (err || !user) {
      res.status(400).json({
        message: info,
        user,
      });
      return;
    }
    req.login(user, { session: false }, (er) => {
      if (er) {
        res.send(er);
        return;
      }
      const token = jwt.sign(user.username, process.env.SECRET);
      res.cookie('token', token, { httpOnly: true });
      res.send(user.id);
    });
    /*
      Watch out in console for:
      Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
      res.send()
    */
  })(req, res, next);
});

/*
  Request made in AppBar.js
  Removes the JWT cookie
*/
server.get('/api/logout', (req, res) => {
  req.logout();
  res.cookie('token', '', { httpOnly: true }).sendStatus(200);
});

/*
  Request made in Saves.jsx
  Read a user's id (Send back Weights)
*/
server.get('/api/users/:id', (req, res) => {
  User.findOne({ _id: req.params.id }, (err, data) => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send('error at /api/users/:id');
    }
  });
});

/*
  Request made in World.jsx
  Update a user's weights array with the new geometry
*/
server.put('/api/users/save', (req, res) => {
  const { weightId, globalUserId } = req.body;
  if (weightId === '') {
    User.update(
      { _id: new ObjectID(globalUserId) },
      {
        $push: {
          weights: {
            weight_id: new ObjectID(),
            name: req.body.name,
            geometry: req.body.geometry,
            subdivisions: req.body.subdivisions,
            adjacentWeight: req.body.adjacentWeight,
            edgePointWeight: req.body.edgePointWeight,
            connectingEdgesWeight: req.body.connectingEdgesWeight,
          },
        },
      },
      (err, data) => {
        if (data) {
          res.send('successful');
        } else {
          res.status(404).send('error at /api/users/save');
        }
      },
    );
  } else {
    User.update(
      { 'weights.weight_id': new ObjectID(weightId) },
      {
        $set: {
          'weights.$.name': req.body.name,
          'weights.$.geometry': req.body.geometry,
          'weights.$.subdivisions': req.body.subdivisions,
          'weights.$.adjacentWeight': req.body.adjacentWeight,
          'weights.$.edgePointWeight': req.body.edgePointWeight,
          'weights.$.connectingEdgesWeight': req.body.connectingEdgesWeight,
        },
      },
      (err, data) => {
        if (data) {
          res.send('successful');
        } else {
          res.status(404).send('error at /api/users/save');
        }
      },
    );
  }
});

/*
  Request made in Saves.jsx
  Update a user's weights array, removing the desired geometry
*/
server.put('/api/users/delete/:id', (req, res) => {
  const { id } = req.params;
  User.update(
    { 'weights.weight_id': new ObjectID(id) },
    { $pull: { weights: { weight_id: new ObjectID(id) } } },
    (err, result) => {
      if (err) throw err;
      res.send(result);
    },
  );
});
