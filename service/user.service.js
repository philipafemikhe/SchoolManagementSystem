﻿const bcrypt = require('bcrypt');
const db = require('_helpers/db');
const { tenantdb, dbName, initializeTenantDB } = require('_helpers/tenantdb');
const consoler = require('_helpers/consoler');
const resolveTenant = require('../_middleware/resolveTenant');



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
    return await db.users.findAll({ include : Role });
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    try{
    if (await db.users.findOne({ where: { email: params.email } })) {
            throw 'Email "' + params.email + '" is already registered';
        }
        consoler.log('new user ' + params);
        const user = new db.users(params);
        
        // hash password
        user.passwordHash = await bcrypt.hash(params.password, 10);
        const role = db.roles.findOne({ where: {name : params.role } })
            .then((r)=>{
                        // save user
                user.role_id = r.id;
                user.save();
                consoler.log('new user saved');
                newdb  = 'sms_' + params.lastName.substring(0,5) + Date.now();
                consoler.log('User created, initializing tenant database dbName = ' + newdb);
                resolveTenant.resolveTenant(newdb)
                    .then((conn)=>{
                        global.tenantConnection = conn;
                        consoler.log('Tenant databse migrated.');
                        return createTenant(newdb, user);
                    })
            })
        
    }catch(e){
        consoler.error('Error creating user ' + e);
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
    const tenant = new db.tenants({email:user.email, host:'localhost', port:3306, username: 'root', password:'', database:newdb, user_id:user.id});
    await tenant.save();
    console.log('Tenant details created');
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
