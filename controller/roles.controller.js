const express = require('express');
const router = express.Router();
const Joi = require('joi');
const roleService = require('../service/role.service');

// routes

router.get('/', getAll);
// router.get('/:id', getById);
router.post('/', insertOne);
// router.put('/:id', update);
// router.delete('/:id', _delete);

module.exports = router;


function getAll(req, res, next){
    roleService.getAll()
        .then(roles => res.status(200).json(roles))
        .catch(next);
}

function insertOne(req, res, next){
    roleService.insertOne(req.body)
            .then(() => res.json({ message: 'Role created' }))
            .catch(next);
}