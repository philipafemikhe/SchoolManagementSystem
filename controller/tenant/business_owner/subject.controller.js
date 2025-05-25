const express = require('express');
const router = express.Router();
// const Joi = require('joi');
// const validateRequest = require('_middleware/validate-request');
// const Role = require('enum/role');
const subjectService = require('../../../service/tenant/business_owner/subject.service');

const checkAuthMiddleware = require('../../../_middleware/check_auth');


const consoler = require('_helpers/consoler');

router.get('/', checkAuthMiddleware.checkTenantAuth, getAll);
router.get('/:id', getById);
router.post('/', checkAuthMiddleware.checkTenantAuth, create);
// router.put('/:id', updateSchema, update);
router.put('/:id', checkAuthMiddleware.checkTenantAuth, update);
router.delete('/:id', checkAuthMiddleware.checkTenantAuth, _delete);


module.exports = router;


function getAll(req, res, next) {
    consoler.log('getAll subjects');
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
    consoler.log('create new subject');
    subjectService.create(req.body)
        .then((data) => {
            consoler.log(JSON.stringify(data));
            if(null == data)
                return res.status(500).json({message:'Request processing error'});
            return res.status(201).json({message: 'Subject created', data});
        })
        .catch(next);
}

function update(req, res, next) {
    subjectService.update(req.params.id, req.body)
        .then((data) => {
            consoler.log(JSON.stringify(data));
            if(null == data)
                return res.status(500).json({message:'Request processing error'});
            return res.status(203).json({message: 'Subject updated', data});
        })
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