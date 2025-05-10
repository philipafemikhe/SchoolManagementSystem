const jwt = require('jsonwebtoken');
const config = require('config.json');
const jwtSecret = config.JWT_SECRET;
const resolveTenant = require('./resolveTenant');
const consoler = require('_helpers/consoler');
const userService = require('../service/user.service');
const tenantService = require('../service/tenant.service');



async function checkTenantAuth(req, res, next ){
    const token = req.get('token');
      consoler.log('checkTenantAuth - request  token ' + token);
      if(!token) {
        return res.status(401).json( { message: 'No unauthorization token provided'} );
      }

      try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        consoler.log('User identified with token, userId ' + decoded.userId);
        const user = await userService.getById(decoded.userId);

        if(user){
            consoler.log('User details ' + JSON.stringify(user));
            const tenant = await tenantService.getByEmail(user.email);
            if(tenant){
                consoler.log('find by email ' + user.email + ', Tenant retrieved ' + JSON.stringify(tenant));
                const conn = await resolveTenant.resolveTenant(tenant.database);
                global.tenantConnection = conn;
                consoler.log('Tenant connection established!!!');
            }
            
        }else{
            res.status(401).json( { message: 'User unauthorized'} ); 
        }
        
      } catch(error) {
        consoler.log(error);
        res.status(401).json( { message: 'User not found or invalid token provided'} );
      }
      next();
}


// Function to check if a token is expired
function isTokenExpired(token, secret) {
    try {
        const decoded = jwt.verify(token, secret);
        return false; // Token is valid and not expired
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            consoler.log('Token expired error');
            return true; // Token is expired
        }
        throw err; // Other errors
    }
}


function checkAuth(req, res, next ){
    const token = req.get('token');
    consoler.log('global.isLogedOut ' + global.isLogedOut);
    if(global.isLogedOut){
        return res.status(401).json( { message: 'Your session has expired and you need to login again'} );
    }
  consoler.log('Retrieved token from request ' + token);
  if(!token) {
    return res.status(401).json( { message: 'Not authorized'} );
  }

  if(isTokenExpired(token, jwtSecret)){
    consoler.log('Token has expired ');
    return res.status(401).json( { message: 'Token has expired'} );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    consoler.log('User detail retrieved from token, userId ' + decoded.userId);
    const user = userService.getById(decoded.userId);
    if(user){
        consoler.log('User verified with token');
        next();
    }else{
        consoler.log('User not verified');
        res.status(401).json( { message: 'User unauthorized'} );
    }
  } catch(error) {
    consoler.log('Error ' + error);
    res.status(401).json( { message: 'Unauthorized user'} );
  }
}

module.exports = {
    checkAuth : checkAuth,
    checkTenantAuth : checkTenantAuth
}