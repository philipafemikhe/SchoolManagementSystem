const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('enum/role');
const userService = require('../service/user.service');


const config = require('config.json');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const consoler = require('_helpers/consoler');
const jwtSecret = config.JWT_SECRET;


router.use((req, res, next ) => {
  // const token = req.cookies.token;
    const token = req.get('token');
    consoler.log('global.isLogedOut ' + global.isLogedOut);
    if(global.isLogedOut){
        return res.status(401).json( { message: 'Your session has expired and you need to login again'} );
    }
  consoler.log('Retrieved token from request ' + token);
  if(!token) {
    return res.status(401).json( { message: 'Unauthorized'} );
  }

  if(isTokenExpired(token, jwtSecret)){
    consoler.log('Token has expired ');
    return res.status(401).json( { message: 'Token has expired'} );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    consoler.log('User detail retrieved from token, userId ' + decoded.userId);
    const user = userService.getById(decoded.userId);
    if(user){
        consoler.log('User verified with token');
        next();
    }else{
        consoler.log('User not verified');
        res.status(401).json( { message: 'User unauthorized'} );
    }
  } catch(error) {
    consoler.log('Error ' + error);
    res.status(401).json( { message: 'Unauthorized'} );
  }
});

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// route functions 

function getAll(req, res, next) {
    consoler.log('Get all users from');
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'User updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    consoler.log('createSchema');
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().valid(Role.Admin, Role.User).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        role: Joi.string().valid(Role.Admin, Role.User).empty(''),
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
    }).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

// Function to check if a token is expired
function isTokenExpired(token, secret) {
    try {
        const decoded = jwt.verify(token, secret);
        return false; // Token is valid and not expired
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            consoler.log('Token expired error');
            return true; // Token is expired
        }
        throw err; // Other errors
    }
}
