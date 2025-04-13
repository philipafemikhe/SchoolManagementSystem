const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('enum/role');
const subjectService = require('../../service/tenant/subject.service');

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
// router.put('/:id', updateSchema, update);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;


function getAll(req, res, next) {
    console.log('getAll subjectService-' + JSON.stringify(subjectService));
    subjectService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    subjectService.getById(req.params.id)
        .then(subject => res.json(subject))
        .catch(next);
}

function create(req, res, next) {
    console.log('create new subject');
    subjectService.create(req.body)
        .then(() => res.json({ message: 'Subject created' }))
        .catch(next);
}

function update(req, res, next) {
    subjectService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Subject updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    subjectService.delete(req.params.id)
        .then(() => res.json({ message: 'Subject deleted' }))
        .catch(next);
}

// schema functions

// function createSchema(req, res, next) {
//     console.log('createSchema');
//     const schema = Joi.object({
//         title: Joi.string().required(),
//         firstName: Joi.string().required(),
//         lastName: Joi.string().required(),
//         role: Joi.string().valid(Role.Admin, Role.Subject).required(),
//         email: Joi.string().email().required(),
//         password: Joi.string().min(6).required(),
//         confirmPassword: Joi.string().valid(Joi.ref('password')).required()
//     });
//     validateRequest(req, next, schema);
// }

// function updateSchema(req, res, next) {
//     const schema = Joi.object({
//         title: Joi.string().empty(''),
//         firstName: Joi.string().empty(''),
//         lastName: Joi.string().empty(''),
//         role: Joi.string().valid(Role.Admin, Role.Subject).empty(''),
//         email: Joi.string().email().empty(''),
//         password: Joi.string().min(6).empty(''),
//         confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
//     }).with('password', 'confirmPassword');
//     validateRequest(req, next, schema);
// }