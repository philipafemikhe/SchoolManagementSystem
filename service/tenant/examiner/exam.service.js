const consoler = require('../../../_helpers/consoler');
const db = require('../../../_helpers/db');
const resolveTenant = require('../../../_middleware/resolveTenant');
const { Op } = require('sequelize');

module.exports = {
    createExam,
    getAll,
    getById,
    update,
    _delete
};

async function createExam(examDTO) {
    consoler.log('service - examDTO' + JSON.stringify(examDTO));

    const tenant = await db.tenants.findOne({
    where: {
        id: examDTO.tenantId
        }
    });
    if (!tenant) return { message: 'Tenant not found', data:null, code:1, isSuccess:false };
     
    const examinerRole = await db.roles.findOne({ where: {name : 'EXAMINER' } });
    await resolveTenant.resolveTenant(tenant.database, examinerRole);

    try{
        const exam = await global.tenantConnection.exam.findOne({
            where: {
                [Op.or]: [
                    {
                        code: examDTO.code
                    },
                    {
                        title: examDTO.title
                    }
                ]
            }
        });
        if (exam){
            return { message: 'Exam already exist', data:null, code:1, isSuccess:false };
        }
        consoler.log('Exam service, creating exam ');
        
        const newExam = await global.tenantConnection.exam.create({
            code: examDTO.code,
            title : examDTO.title,
            description : examDTO.description,
            passMark : examDTO.passMark,
            status : examDTO.status 
        });
        consoler.log('exam created ' + JSON.stringify(newExam));
        return { message: 'Exam created successfully', data:newExam, code:0, isSuccess:true };
    }catch(error){
        consoler.log('Error creating exam ' + error);
        return { message: 'Error creating exam', data:error.message, code:1, isSuccess:false };
    }
    
}


async function getAll(){
    try{
        consoler.log('Retrieve all exams');
        const exams = await global.tenantConnection.exam.findAll();
        consoler.log('Exams ' + JSON.stringify(exams));
        return { message: 'Successful', data:exams, code:0, isSuccess:true };
    }catch(error){
        consoler.log('Error retrieving records ' + error);
        return {message: error.message, data:null, code : 1, isSuccess:false };
    }     
}


async function getById(id) {
    consoler.log('get exam by id ' + id);
    try{
        const exam = await global.tenantConnection.exam.findByPk(id);
        if (!exam) throw 'Exam with given Id not found';
        return {message: 'Successful', data:exam, code : 0, isSuccess:true };
    }catch(error){
        consoler.log('Error retrieving exam ' + error);
        return {message: error.message, data:null, code : 1, isSuccess:false };
    }    
}

async function update(id, params) {
    try{
        const res = await getById(id); 
        if (!res.data) {
            return {message: 'Exam with given Id not found', data:null, code : 1, isSuccess:false };
        }
        const exam = res.data;
        consoler.log('Updating exam ' + JSON.stringify(exam));
        Object.assign(exam, params);
        await exam.save();
        return { message: 'Exam Updated Successfully', data:exam, code : 0, isSuccess:true };
    }catch(error){
        consoler.log('Error Updating exam ' + error);
        return { message: error.message, data:null, code : 1, isSuccess:false};
    } 
    
}

async function _delete(id) {
    try{
        const res = await getById(id);
        const exam = res.data;
        await exam.destroy();
        return {message: 'Exam deleted successfully', data:null, code : 0, isSuccess:true};
    }catch(error){
        consoler.log('Error deleting exam ' + error);
        return {message: error.message, data:null, code : 1, isSuccess:false};
    }
}