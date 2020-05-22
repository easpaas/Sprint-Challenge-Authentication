// router.post('/login', (req, res) => {
//   // implement login
// });

const db = require('../database/dbConfig.js');
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const router = require("express").Router();

const { isValid } = require("./auth-services.js");

router.post("/register", (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = 5;

    // hash the password
    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    console.log(credentials);
    // save the user to the database
    db("users")
      .insert(credentials)
      .then(user => {
        res.status(201).json({ data: user });
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body
  
  if(!username || !password) {
      res.status(403).json({message: 'invalid username and password'})
  } else {
    db("users")
      .where({ username })
      .then(user => {
        console.log(user)
          if(user && bcryptjs.compareSync(password, user[0].password)) {
          const token = createToken(user)
          res.status(200).json({message: 'login successful', username: username, token})
          }
      })
      .catch(err => {
          console.log(err)
          res.status(500).json({message: 'failed to login'})
      })
  } 
});

function createToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
  }
  const options = {
      expiresIn: '1d'
  }
  return jwt.sign(payload, process.env.JWT_SECRET || 'duh', options)
}


module.exports = router;

