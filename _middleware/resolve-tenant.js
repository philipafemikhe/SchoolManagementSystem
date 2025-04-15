var  tenant = require('../_helpers/tenantdb');

function resolveTenant(req, res, next) {
  console.log('Resolving Tenant....' + dbName);
  global.dbName = "sms_aimet1744435250123";
  var tenant = tenant.tenantdb(global.dbName);
  console.log('tenant ' + tenant);
  next()
}

module.exports = {
  tenant: resolveTenant 
}


// const resolveTenant = function (req, res, next) {
//   req.dbName = "sms_aimet1744435250123";
//   const data = tenantdb.tenantdb(dbName)
//   console.log('Resolving Tenant....' + dbName);
//   next()
// }



// const cors = require('cors');
// const cookieParser = require('cookie-parser');

// export default function (app) {

//   app.use(cookieParser());

// }


// var  db = require('../_helpers/db');
// var  tenantdb = require('../_helpers/tenantdb');


// module.exports = resolveTenant;


// function resolveTenant(req, next, schema) {
//   const dbName="sms_aimet1744435250123";
//   const data = tenantdb.tenantdb(dbName)
//   console.log(data);
//   req.dbName = "sms_aimet1744435250123";
//   console.log('Resolving Tenant....' + dbName);
//   userId = req.params.id;

//   if(userId){
//     const user = db.users.findOne({id : userId});
//     if(user){
//       console.log('User retrieved ' + user);

//     }
//   }else{
//     console.log('userId not provided');
//   }
//   next();
    
// }
