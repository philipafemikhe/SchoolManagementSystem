const express =  require('express');
const router = express.Router();
const examService = require('../../../service/tenant/examiner/exam.service');
const consoler = require('_helpers/consoler');


// router.get('/', checkAuthMiddleware.checkTenantAuth, getAll);
// router.get('/:id', getById);
router.post('/', create);
// router.put('/:id', checkAuthMiddleware.checkTenantAuth, update);
// router.delete('/:id', checkAuthMiddleware.checkTenantAuth, _delete);


module.exports = router;

function create(req, res, next){
    consoler.log('create new exam');
    const examDTO = {...req.body};
    consoler.log('create exam with details: ' + JSON.stringify(examDTO));
    examService.createExam(examDTO)
        .then((result)=>{
            if((null == result) || (null == result.data))
                return res.status(500).json({message:result.message, code:1});
            return res.status(200).json({message:'Exam successfully created', code:0 ,data});
        })
        .catch(error => {
            console.error('Error creating exam:', error);
            return res.status(500).json(error);
        });
    
}