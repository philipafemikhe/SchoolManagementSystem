const bcrypt = require('bcrypt');
const db = require('_helpers/db');
// const { tenantdb, dbName, initializeTenantDB } = require('_helpers/tenantdb');
const consoler = require('_helpers/consoler');
const resolveTenant = require('../_middleware/resolveTenant');
const User = require('../model/user.model');
const Tenant = require('../model/tenant.model');
const Role = require('../model/role.model');



module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    findOne
};

async function getAll() {
    consoler.error('User Service getAll...' + global.dbName);
    // return await db.users.findAll({ include : [db.roles, db.tenants ] });
    return await db.users.findAll({ include: { all: true, nested: true } });
     // return await db.users.findAll(
     //    {
     //        include: [
     //            {
     //            model: Role,
     //            as: 'Roles',
     //            through: {attributes: []},
     //            include: {
     //              model: Permission,
     //              through: {attributes: []}
     //            },
     //          },
     //          {
     //            model: Tenant
     //          }
     //        ]
     //    });
 }

async function getById(id) {
    return await getUser(id);
}


async function create(params) {
    try{
        if (await db.users.findOne({ where: { email: params.email } })) {
            throw 'Email "' + params.email + '" is already registered';
        }
        consoler.log('new user ' + JSON.stringify(params));
        

        const role = await db.roles.findOne({ where: {name : params.role } });
        consoler.log('Selected Role ' + JSON.stringify(role));
        var response = null;
        if(role){
            consoler.log('new user role ' + JSON.stringify(role));
            const passwordHash = await bcrypt.hash(params.password, 10);
            newdb  = 'sms_' + params.lastName.substring(0,5) + Date.now();
            const tenant = await db.tenants.create({
                email : params.email, 
                host: 'localhost', 
                port: 3306, 
                username : 'root', 
                password : '', 
                database : newdb,
                User: [
                    { 
                        title :  params.title, 
                        passwordHash : passwordHash, 
                        firstName : params.firstName, 
                        lastName : params.lastName, 
                        email : params.email
                    }
                ]
            },
            {
                include : [db.users] 
            })
            .then((res)=>{
                consoler.log('Tenant user created '+ JSON.stringify(res));
                res.User.addRole(role.id, res.User.id);
                response = res;
                consoler.log('User role created');
            });

            consoler.log('Tenant created ' + JSON.stringify(tenant) + ', initializing tenant database dbName = ' + newdb);
            const conn = await resolveTenant.resolveTenant(newdb);
            consoler.log('Tenant db setup completed ' + JSON.stringify(conn));
            global.tenantConnection = conn;
            consoler.log('Tenant databse migrated.');
            return response;                         
        }else{
            consoler.log('Role not found');
            throw Error('Provided role not valid');
        }
        
        
    }catch(e){
        consoler.log('Error creating user ' + e);
        throw Error(e);
    }    
}

async function update(id, params) {
    const user = await getUser(id); 

    // validate
    const emailChanged = params.email && user.email !== params.email;
    if (emailChanged && await db.users.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.users.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

async function createTenant(newdb, user){
    consoler.log('createTenant');
    const tenant = new db.tenants({email:user.email, host:'localhost', port:3306, username: 'root', password:'', database:newdb, user_id:user.id});
    return await tenant.save();
}


async function findOne(email){
    const user = await db.users.findOne({
    where: {
        email: email
        },
        attributes: { include: ['passwordHash'] }
    });
    if (!user) throw 'User not found';
    return user;
}
