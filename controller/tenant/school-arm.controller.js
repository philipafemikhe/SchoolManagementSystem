const express = require('express');
const router = express.Router();

const schoolArmService = require('../../service/tenant/school-arm.service.js');

const checkAuthMiddleware = require('../../_middleware/check_auth');


const consoler = require('_helpers/consoler');

router.get('/', checkAuthMiddleware.checkTenantAuth, getAll);
router.get('/:id', checkAuthMiddleware.checkTenantAuth, getById);
router.post('/', checkAuthMiddleware.checkTenantAuth, create);
router.put('/:id', checkAuthMiddleware.checkTenantAuth, update);
router.delete('/:id', checkAuthMiddleware.checkTenantAuth, _delete);


module.exports = router;


function getAll(req, res, next) {
    consoler.log('getAll School Arms');
    schoolArmService.getAll()
        .then((data) => {
            consoler.log(JSON.stringify(data));
            if(null == data)
                return res.status(500).json({message:'Request processing error'});
            return res.status(200).json({message: 'Learning Arm retrieved', data});
        })
        .catch(next);
}

function getById(req, res, next) {
    schoolArmService.getById(req.params.id)
        .then((data) => {
            consoler.log(JSON.stringify(data));
            if(null == data)
                return res.status(500).json({message:'Request processing error'});
            return res.status(200).json({message: 'Learning Arm retrieved', data});
        })
        .catch(next);
}

function create(req, res, next) {
    consoler.log('create new Learning Arm');
    schoolArmService.create(req.body)
        .then((data) => {
            consoler.log(JSON.stringify(data));
            if(null == data)
                return res.status(500).json({message:'Request processing error'});
            return res.status(201).json({message: 'Learning Arm created', data});
        })
        .catch(next);
}

function update(req, res, next) {
    schoolArmService.update(req.params.id, req.body)
        .then((data) => {
            consoler.log(JSON.stringify(data));
            if(null == data)
                return res.status(500).json({message:'Request processing error'});
            return res.status(203).json({message: 'Learning Arm updated', data});
        })
        .catch(next);
}

function _delete(req, res, next) {
    schoolArmService.delete(req.params.id)
        .then(() => res.status(200).json({ message: 'Subject deleted' }))
        .catch(next);
}