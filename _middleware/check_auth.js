const jwt = require('jsonwebtoken');
const config = require('config.json');
const jwtSecret = config.JWT_SECRET;
const resolveTenant = require('./resolveTenant');
const consoler = require('_helpers/consoler');
const userService = require('../service/user.service');
const tenantService = require('../service/tenant.service');


async function checkAuth(req, res, next ){
    consoler.log('global.isLogedOut ' + global.isLogedOut);
    var token = req.get('token');
    const refreshToken = req.get('refreshToken');
    if(global.isLogedOut){
        return res.status(401).json( { message: 'Your session has expired and you need to login again'} );
    }
    consoler.log('Retrieved token from request ' + token + ', refreshToken: ' + refreshToken);
    if(!token) {
        return res.status(401).json( { message: 'Not authorized'} );
    }

    if(isTokenExpired(token, jwtSecret)){
        consoler.log('Token has expired ');
        // return res.status(401).json( { message: 'Token has expired'} );
        //generate new token if there is a valid refresh token
        try{
            const refreshToken = req.get('refreshToken');
            if (null == refreshToken) {
                return res.status(401).json( { message: 'Not authorized!'} );
            }


            const decoded = jwt.verify(refreshToken, jwtSecret);
            req.userId = decoded.userId;
            consoler.log('User Id ' + decoded.userId);
            const r = await userService.getUserByRefreshToken(refreshToken, decoded.userId);
             if (null == r) {
                consoler.log('User not found with provided refresh token, r is null' );
                return res.status(401).json( { message: 'Not authorized!!'} );
            }
            try{
                consoler.log('getUserByRefreshToken r ' + JSON.stringify(r)); 
                consoler.log(refreshToken == r.refreshToken);
                const tokens = await generateNewToken(r.refreshToken);
                consoler.log('.... new token set ' + JSON.stringify(tokens));

                userService.updateRefreshTokenForUser(r.refreshToken, tokens.refreshToken, decoded.userId)
                .then((tokenRefreshed)=>{
                    if(null == tokenRefreshed){
                        consoler.log('Unable to obtain refresh token' );
                        return res.status(401).json( { message: 'User Not authorized'} );
                    }
                    req.token = tokens.accessToken;
                    req.refreshToken = tokens.accessToken;
                    consoler.log('Token has been updated');
                    next();
                }); 
            }catch(err){
                consoler.warn(err);
                return res.status(401).json( { message: 'Not authorized'} );
            }
        }catch(error){
            consoler.warn(error);
            return res.status(401).json( { message: 'Token has expired'} );
        }
    }else{
        try {
            consoler.log('TokenExpired = false' );
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
}



// async function checkTenantAuth(req, res, next ){
//     const token = req.get('token');
//       consoler.log('checkTenantAuth - request  token ' + token);
//       if(!token) {
//         return res.status(401).json( { message: 'No unauthorization token provided'} );
//       }

//       try {
//         const decoded = jwt.verify(token, jwtSecret);
//         req.userId = decoded.userId;
//         consoler.log('User identified with token, userId ' + decoded.userId);
//         const user = await userService.getById(decoded.userId);

//         if(user){
//             consoler.log('User details ' + JSON.stringify(user));
//             const tenant = await tenantService.getByEmail(user.email);
//             if(tenant){
//                 consoler.log('find by email ' + user.email + ', Tenant retrieved ' + JSON.stringify(tenant));
//                 const conn = await resolveTenant.resolveTenant(tenant.database);
//                 global.tenantConnection = conn;
//                 consoler.log('Tenant connection established!!!');
//             }
            
//         }else{
//             res.status(401).json( { message: 'User unauthorized'} ); 
//         }
        
//       } catch(error) {
//         consoler.log(error);
//         res.status(401).json( { message: 'User not found or invalid token provided'} );
//       }
//       next();
// }


async function checkTenantAuth(req, res, next ){
    consoler.log('global.isLogedOut ' + global.isLogedOut);
    var token = req.get('token');
    const refreshToken = req.get('refreshToken');
    if(global.isLogedOut){
        return res.status(401).json( { message: 'Your session has expired and you need to login again'} );
    }
    consoler.log('Retrieved token from request ' + token + ', refreshToken: ' + refreshToken);
    if(!token) {
        return res.status(401).json( { message: 'Not authorized'} );
    }

    if(isTokenExpired(token, jwtSecret)){
        consoler.log('Token has expired ');
        // return res.status(401).json( { message: 'Token has expired'} );
        //generate new token if there is a valid refresh token
        try{
            const refreshToken = req.get('refreshToken');
            if (null == refreshToken) {
                return res.status(401).json( { message: 'Not authorized!'} );
            }


            const decoded = jwt.verify(refreshToken, jwtSecret);
            req.userId = decoded.userId;
            consoler.log('User Id ' + decoded.userId);
            const r = await userService.getUserByRefreshToken(refreshToken, decoded.userId);
             if (null == r) {
                consoler.log('User not found with provided refresh token, r is null' );
                return res.status(401).json( { message: 'Not authorized!!'} );
            }
            try{
                consoler.log('getUserByRefreshToken r ' + JSON.stringify(r)); 
                consoler.log(refreshToken == r.refreshToken);
                const tokens = await generateNewToken(r.refreshToken);
                consoler.log('.... new token set ' + JSON.stringify(tokens));

                const tokenRefreshed = await userService.updateRefreshTokenForUser(r.refreshToken, tokens.refreshToken, decoded.userId)
                if(null == tokenRefreshed){
                    consoler.log('Unable to obtain refresh token' );
                    return res.status(401).json( { message: 'User Not authorized'} );
                }
                req.token = tokens.accessToken;
                req.refreshToken = tokens.accessToken;
                consoler.log('Token has been updated');

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

                next();
            }catch(err){
                consoler.warn(err);
                return res.status(401).json( { message: 'Not authorized'} );
            }
        }catch(error){
            consoler.warn(error);
            return res.status(401).json( { message: 'Token has expired'} );
        }
    }else{
        try {
            consoler.log('TokenExpired = false' );
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


async function generateNewToken(token){

    consoler.log('generating New Token ' +token);
    try{
        const decoded = jwt.verify(token, jwtSecret);
        consoler.log('generateNewToken decoded: ' + JSON.stringify(decoded));

        userId = decoded.userId;
        user = await userService.getById(userId);
        consoler.log('userId: ' + userId + ', user: ' + JSON.stringify(user));
        const accessToken = jwt.sign({ userId: user.id, email: user.email}, jwtSecret , {
                expiresIn: "2m"
            });

        const refreshToken = jwt.sign({ userId: user.id, email: user.email}, jwtSecret , {
            expiresIn: "24h"
        });
        consoler.log('accessToken ' + accessToken + ', refreshToken ' + refreshToken);
        const newTokenSet = {'accessToken':accessToken, 'refreshToken':refreshToken};
        consoler.log('****newTokenSet ' + JSON.stringify(newTokenSet));
        return newTokenSet;
        
    } catch(error) {
        consoler.log('Error ' + error);
        // res.status(401).json( { message: 'Unauthorized user'} );
        return null;
      }   
}

module.exports = {
    checkAuth : checkAuth,
    checkTenantAuth : checkTenantAuth
}