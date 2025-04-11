const db = require('_helpers/db');

module.exports = {
    getAll,
    insertOne
}

async function getAll(){
    return await db.roles.findAll();
}

async function insertOne(params){
    const role = new db.roles(params);        
    await role.save();
}