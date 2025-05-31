const consoler = require('../../../_helpers/consoler');
const db = require('../../../_helpers/db');
const resolveTenant = require('../../../_middleware/resolveTenant');
const bcrypt = require('bcrypt');

module.exports = {
    createCandidate,
    findOne,
    getAll,
    getById,
    update,
    _delete
};

async function createCandidate(candidateDTO) {
    consoler.log('service - candidateDTO' + JSON.stringify(candidateDTO));
    try{
        const candidate = await global.tenantConnection.candidate.create({
            candidateNo: candidateDTO.candidateNo,
            firstName : candidateDTO.firstName,
            lastName : candidateDTO.lastName,
            email : candidateDTO.email,
            username : candidateDTO.username,
            password : candidateDTO.password,
            phoneNo : candidateDTO.phoneNo,
            address : candidateDTO.address 
        });
        consoler.log('candidate created ' + JSON.stringify(candidate));
        return {message: 'Successful', data:candidate, code : 0};;
    }catch(error){
        consoler.log('Error creating candidate ' + error);
        return {message: error.message, data:null, code : 1};
    }    
}


async function findOne(email) {
    consoler.log('Find user by email ' + email);
    try{
        const user =await global.tenantConnection.candidate.findOne({
            where: {
                email: email
            },
            attributes: { include: ['password'] }
        });
        if (!user) return {message: 'Not Found', data:null, code : 1};
        return {message: 'Successful', data:user, code : 0};;
    }catch(error){
        consoler.log('Error retrieving record ' + error);
        return {message: error.message, data:null, code : 1};
    } 
}


async function getAll(){
    try{
        consoler.log('Retrieve all candidate');
        const candidates = await global.tenantConnection.candidate.findAll();
        consoler.log('users ' + JSON.stringify(candidates));
        return {message: 'Successful', data:candidates, code : 0};
    }catch(error){
        consoler.log('Error retrieving records ' + error);
        return {message: error.message, data:null, code : 1};
    } 
    
}


async function getById(id) {
    try{
        const candidate = await global.tenantConnection.candidate.findByPk(id);
        if (!candidate) throw 'Candidate not found';
        return {message: 'Successful', data:candidate, code : 0};
    }catch(error){
        consoler.log('Error deleting candidate ' + error);
        return {message: error.message, data:null, code : 1};
    }    
}

async function update(id, params) {
    try{
        const candidate = await getById(id); 
        const emailChanged = params.email && candidate.email !== params.email;
        if (emailChanged && await global.tenantConnection.candidate.findOne({ where: { email: params.email } })) {
            throw 'Email "' + params.email + '" is already registered';
        }
        if (params.password) {
            params.password = await bcrypt.hash(params.password, 10);
        }
        Object.assign(candidate, params);
        await candidate.save();
        return {message: 'Candidate Updated Successfully', data:candidate, code : 0};;
    }catch(error){
        consoler.log('Error Updating candidate ' + error);
        return {message: error.message, data:null, code : 1};
    } 
    
}

async function _delete(id) {
    try{
        const candidate = await getById(id);
        await candidate.destroy();
        return {message: 'Candidate deleted successfully', data:null, code : 0};
    }catch(error){
        consoler.log('Error deleting candidate ' + error);
        return {message: error.message, data:null, code : 1};
    }
}