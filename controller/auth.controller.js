const express = require('express');
const consoler = require('_helpers/consoler');
const userService = require('../service/user.service');
const config = require('config.json');


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = config.JWT_SECRET;

const router = express.Router();

router.post('/login', login);
router.post('/signup', create);
router.get('/logout', logout);

module.exports = router;


function login(req, res, next){
    const { email, password } = req.body;
    consoler.log('Attempting login with email ' + email);
    userService.findOne(email)
    .then(usr=>{
        if(!usr) {
          return res.status(401).json( { message: 'Invalid credentials' } );
        }
        consoler.log('User found, validating password.  user ' + JSON.stringify(usr));
        const isPasswordValid = bcrypt.compare(password, usr.passwordHash);
        if(!isPasswordValid) {
          return res.status(401).json( { message: 'Invalid credentials' } );
        }
        consoler.log('Password validated');

        const accessToken = jwt.sign({ userId: usr.id, email: usr.email}, jwtSecret , {
            expiresIn: "2m"
        });

        const refreshToken = jwt.sign({ userId: usr.id, email: usr.email}, jwtSecret , {
            expiresIn: "24h"
        });

        // res.cookie('token', token, { httpOnly: true });
        global.isLogedOut = false;
        return res.status(200).json({ 'accessToken' : accessToken,  'refreshToken' : refreshToken });
    })
    .catch(next); 
}


function create(req, res, next) {
    consoler.log('create new user');
    userService.create(req.body)
        .then((r) => {
            consoler.log('Create user response ' + r);
            if(undefined != r) res.json({ tenant: r });
            throw Error('Provided role not valid');
        })
        .catch(next);
}

function logout(req, res, next){
  consoler.log('Loging out user');
  req.token = null;
  global.isLogedOut = true;
  return res.status(200).json({ 'message' : 'You have successfully loged out' });
}

