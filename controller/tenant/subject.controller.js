const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('enum/role');
const subjectService = require('../../service/tenant/subject.service');
const tenantService = require('../../service/tenant.service');
const userService = require('../../service/user.service');
// const  tenantdb = require('../../_helpers/tenantdb');
const jwt = require('jsonwebtoken');
const config = require('config.json');
const jwtSecret = config.JWT_SECRET;
const resolveTenant = require('../../_middleware/resolveTenant');



const consoler = require('_helpers/consoler');



// router.use((req, res, next) => {
//   tenantdb.dbName = "sms_aimet1744435250123";
//   consoler.log('Middleware - Establiishing tenant connection to ' + tenantdb.dbName);
//   tenantdb.newConnetion;
//   // tenantdb;
//   // global.tenantdb = tenantdb.tenantdb(global.dbName);
//   // global.tenantdb = tenantdb(global.dbName);
//   // resolveTenant.tenant();
//   next()
// });


router.use((req, res, next ) => {
  // const token = req.cookies.token;
    const token = req.get('token');
  consoler.log('subject controller - token from request ' + token);
  if(!token) {
    return res.status(401).json( { message: 'Unauthorized'} );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    consoler.log('User identified with token, userId ' + decoded.userId);
    userService.getById(decoded.userId)
        .then((user)=>{
            if(user){
                consoler.log('User details ' + JSON.stringify(user));
                tenantService.getByEmail(user.email)
                    .then((tenant)=>{
                        consoler.log('Tenant retrieved ' + JSON.stringify(tenant));
                        resolveTenant.resolveTenant(tenant.database)
                        .then((conn)=>{
                            global.tenantConnection = conn;
                            consoler.log('Tenant connection established!!!');
                            next();
                        })
                        .catch((e)=>res.status(401).json( { message: 'Error ' + e} ));
                    })
                    .catch(next);
            }else{
                res.status(401).json( { message: 'User unauthorized'} ); 
            }
            next();
        })
        .catch(next);
    
  } catch(error) {
    consoler.log(error);
    res.status(401).json( { message: 'Unauthorized'} );
  }
})


router.get('/',getAll);
router.get('/:id', getById);
router.post('/', create);
// router.put('/:id', updateSchema, update);
router.put('/:id', update);
router.delete('/:id', _delete);


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