const express =  require('express');
const router = express.Router();
const candidateService = require('../../../service/tenant/examiner/candidate.service');
const consoler = require('_helpers/consoler');
const checkAuthMiddleware = require('../../../_middleware/check_auth');


router.get('/candidate', checkAuthMiddleware.checkTenantAuth, getAll);
router.get('/candidate/:id', checkAuthMiddleware.checkTenantAuth, getById);
router.post('/candidate', checkAuthMiddleware.checkTenantAuth, create);
router.put('/candidate/:id', checkAuthMiddleware.checkTenantAuth, update);
router.delete('/candidate/:id', checkAuthMiddleware.checkTenantAuth, _delete);


module.exports = router;

function create(req, res, next){
    consoler.log('create new examiner candidate');
    const candidateDTO = {...req.body};
    consoler.log('create candidate with details: ' + JSON.stringify(candidateDTO));
    candidateService.createCandidate(candidateDTO)
        .then((result)=>{
            if((null == result) || (null == result.data))
                return res.status(500).json(result);
            consoler.log(JSON.stringify(result));
            return res.status(200).json(result);
        })
        .catch(error => {
            console.error('Error creating candidate:', error);
            return res.status(500).json({ message: error.message, code: 1 } );
        });
    
}


function getAll(req, res, next){
    consoler.log('Get all candidates for current tenant');
    candidateService.getAll()
        .then((result)=>{
            if((null == result) || (null == result.data))
                return res.status(500).json(result);
            consoler.log(JSON.stringify(result));
            return res.status(200).json(result);
        })
        .catch(error => {
            console.error('Error retrieving candidates:', error);
            return res.status(500).json({ message: error.message, code: 1 } );
        });
}


function getById(req, res, next) {
    candidateService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function update(req, res, next) {
    candidateService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Candidate updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    candidateService.delete(req.params.id)
        .then(() => res.json({ message: 'Candidate deleted' }))
        .catch(next);
}