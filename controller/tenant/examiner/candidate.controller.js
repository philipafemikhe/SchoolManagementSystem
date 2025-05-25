const express =  require('express');
const router = express.Router();
const candidateService = require('../../../service/tenant/examiner/candidate.service');
const consoler = require('_helpers/consoler');


// router.get('/', checkAuthMiddleware.checkTenantAuth, getAll);
// router.get('/:id', getById);
router.post('/', create);
// router.put('/:id', checkAuthMiddleware.checkTenantAuth, update);
// router.delete('/:id', checkAuthMiddleware.checkTenantAuth, _delete);


module.exports = router;

function create(req, res, next){
    consoler.log('create new examiner candidate');
    const candidateDTO = {...req.body};
    consoler.log('create candidate with details: ' + JSON.stringify(candidateDTO));
    candidateService.createCandidate(candidateDTO)
        .then((data)=>{
            if(null == data)
                return res.status(500).json({message:'Request processing error', code:1});
            return res.status(200).json({message:'Candidate successfully created', code:0 ,data});
        })
        .catch(error => {
            console.error('Error creating candidate:', error);
            return res.status(500).json(error);
        });
    
}