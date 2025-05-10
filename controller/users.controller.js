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

const checkAuthMiddleware = require('../_middleware/check_auth');
// routes

router.get('/', checkAuthMiddleware.checkAuth, getAll);
router.get('/:id', checkAuthMiddleware.checkAuth, getById);
router.put('/:id', checkAuthMiddleware.checkAuth, updateSchema, update);
router.delete('/:id', checkAuthMiddleware.checkAuth, _delete);

module.exports = router;

// route functions 

function getAll(req, res, next) {
    consoler.log('Get all users');
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
