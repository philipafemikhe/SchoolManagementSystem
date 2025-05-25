const db = require('_helpers/db');

module.exports = {
    getAll,
    insertOne,
    findByName
}

async function getAll(){
    return await db.roles.findAll();
}

async function insertOne(params){
    const role = new db.roles(params);        
    await role.save();
}

async function findByName(name){
    return await db.roles.findOne({
    where: {
        name: name
        }
    });
}