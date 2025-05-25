const util = require('util');
const consoler = require('_helpers/consoler');
const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const resolveTenant = require('../../../_middleware/resolveTenant');


module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    consoler.log('Learning arm, getAll initiated');
    try{
       return await global.tenantConnection.schoolArm.findAll();
    }catch(e){
        consoler.error(e);
        throw Error ('There was an error ' + e);
    }
}
    


async function getById(id) {
    return await getLearningArm(id);
}

async function create(params) {
    consoler.log(JSON.stringify('global.tenantConnection ' + JSON.stringify(global.tenantConnection)));
    try{
        if (await global.tenantConnection.schoolArm.findOne({ where: { code: params.code } })) {
            throw 'Course Code "' + params.title + '" is already registered';
        }
    }catch(e){
        consoler.log('Error Checking if record exists ' + e);
    }

    try{
        consoler.log('creating new Arm of learning ' + JSON.stringify(params));
        const schoolArm = new global.tenantConnection.schoolArm(params);
        const arm = await schoolArm.save();
        consoler.log('new Arm of learning Created ' + JSON.stringify(arm));
        return arm;
    }catch(e){
        consoler.log('Error creating Arm of Leraning ' + e);
        throw new Error(e.message);
    }    
}


async function update(id, params) {
    const subject = await getLearningArm(id); 
}

async function _delete(id) {
    const schoolArm = await getLearningArm(id);
    await schoolArm.destroy();
}

// helper functions

async function getLearningArm(id) {
    const schoolArm = await global.tenantConnection.schoolArm.findByPk(id);
    if (!schoolArm) throw 'Learning Arm not found';
    return schoolArm;
}
