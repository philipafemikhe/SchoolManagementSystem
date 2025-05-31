const express = require('express');
const router = express.Router();
const checkAuthMiddleware = require('../../../_middleware/check_auth');
const consoler = require('_helpers/consoler');
const questionService = require('../../../service/tenant/examiner/question.service');

router.get('/', checkAuthMiddleware.checkTenantAuth, getAll);
router.get('/:id', checkAuthMiddleware.checkTenantAuth, getById);
router.post('/', checkAuthMiddleware.checkTenantAuth, create);
router.put('/:id', checkAuthMiddleware.checkTenantAuth, update);
router.delete('/:id', checkAuthMiddleware.checkTenantAuth, _delete);

module.exports = router;


function create(req, res, next){
    const questionDTO = req.body;
    consoler.log('tenantId from request ' + req.tenantId);
    questionService.create(questionDTO, req.tenantId)
        .then((result)=>{
            if((null == result) || (null == result.data))
                return res.status(500).json(result);
            return res.status(200).json(result);
        })
        .catch((error)=>{
            console.error('Error creating question:', error);
            return res.status(500).json(error);
        })
}

function getAll(req, res, next){
    consoler.log('Get all questions for current tenant');
    questionService.getAll()
        .then((result)=>{
            if((null == result) || (null == result.data))
                return res.status(500).json(result);
            consoler.log(JSON.stringify(result));
            return res.status(200).json(result);
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            return res.status(500).json({ message: error.message, code: 1 } );
        });
}


function getById(req, res, next) {
    questionService.getById(req.params.id)
        .then(question => res.status(200).json(question))
        .catch(next);
}

function update(req, res, next) {
    questionService.update(req.params.id, req.body)
        .then((result) => res.status(200).json(result))
        .catch(next);
}

function _delete(req, res, next) {
    questionService.delete(req.params.id)
        .then((result) => res.status(200).json(result))
        .catch(next);
}