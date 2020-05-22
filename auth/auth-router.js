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
  let {username, password} = req.body;
  const {id} = req.params;

//   function findByUsername(username) {
//     return db('users').where({username}).first()
// }

db("users")
  .where({ username })
  .then(user => {
    console.log(user);
    res.status(200).json({ data: user })
  })
  .catch(error => {
    res.status(404).json({ message: 'cannot find user' });
  });


  // db("users").where({id})
  //     .first()
  //     .then(someone => {
  //         if (someone && bcryptjs.compareSync(password, someone.password)) {
  //             const token = createToken(someone);
  //             res.status(200).json({ message: `Welcome ${someone.username}`, token})
  //         } else {
  //             res.status(401).json({ message: 'Invalid Credentials!' })
  //         }
  //     })
  //     .catch(err => {
  //         console.log('error logging in', err)
  //         res.status(500).json({ errorMessage: 'Could not log in!' })
  //     })
})

function createToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
    role: user.role,
  };

  const secret = process.env.JWT_SECRET || "keepitsecret,keepitsafe!";

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;

