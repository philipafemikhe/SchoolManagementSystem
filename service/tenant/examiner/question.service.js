const { array } = require('joi');
const consoler = require('../../../_helpers/consoler');
const db = require('../../../_helpers/db');
const resolveTenant = require('../../../_middleware/resolveTenant');
const { Op } = require('sequelize');

module.exports = {
    create,
    getAll,
    getById,
    update,
    _delete
}


async function create(questionDTO, tenantId){
    consoler.log('questionDTO ' + JSON.stringify(questionDTO));
    const examinerRole = await db.roles.findOne({ where: {name : 'EXAMINER' } });
    const tenant = await db.tenants.findOne({
        where: {
            id: tenantId
            }
        });
        if (!tenant) return { data: null, message: 'Tenant not found', code : 1 };
    await resolveTenant.resolveTenant(tenant.database, examinerRole);

    try{
        const question = await global.tenantConnection.question.findOne({
            where: {
                [Op.and]: [
                    {
                        question: questionDTO.question
                    },
                    {
                        ExamId: questionDTO.examId
                    }
                ]
            }
        });
        if (question){
            return { data: null, message: 'Question already exist', code : 1 };
        }
        consoler.log('Question service, creating question ');

        var optionArray = [];
        
        const newQuestion = await global.tenantConnection.question.create({
            question: questionDTO.question,
            type : questionDTO.type,
            marks : questionDTO.marks,
            ExamId : questionDTO.examId 
        });
        await questionDTO.options.forEach((option)=>{
            const questionOption = global.tenantConnection.questionOption.create({
                title: option.title,
                isAnswer : option.isAnswer,
                QuestionId : newQuestion.id
            }); 
            optionArray.push(questionOption);
        })

        // const newQuestion = await global.tenantConnection.question.create({
        //     question: questionDTO.question,
        //     type : questionDTO.type,
        //     marks : questionDTO.marks,
        //     ExamId : questionDTO.examId,
        //     questionOption:[
        //         {...questionDTO.options} 
        //     ]           
        // },
        // {
        //     include : [
        //         {association: global.tenantConnection.questionOption}
        //     ] 
        // })

        consoler.log('Question created ' + JSON.stringify(newQuestion));
        consoler.log('Question Options ' + JSON.stringify(optionArray));
        return {data:newQuestion, message: 'Question created successfully', code: 0};
    }catch(error){
        consoler.log('Error creating question ' + error);
        return { data: null, message: error.message, code : 1 };
    }
}


async function getAll(){
    try{
        consoler.log('Retrieve all questions');
        const questions = await global.tenantConnection.question.findAll();
        consoler.log('questions ' + JSON.stringify(questions));
        return { message: 'Successful', data:questions, code:0, isSuccess:true };
    }catch(error){
        consoler.log('Error retrieving records ' + error);
        return {message: error.message, data:null, code : 1, isSuccess:false };
    }     
}


async function getById(id) {
    consoler.log('get question by id ' + id);
    try{
        const question = await global.tenantConnection.question.findByPk(id);
        if (!question) throw 'Question with given Id not found';
        return {message: 'Successful', data:question, code : 0, isSuccess:true };
    }catch(error){
        consoler.log('Error retrieving question ' + error);
        return {message: error.message, data:null, code : 1, isSuccess:false };
    }    
}

async function update(id, params) {
    try{
        const res = await getById(id); 
        if (!res.data) {
            return {message: 'Question with given Id not found', data:null, code : 1, isSuccess:false };
        }
        const question = res.data;
        consoler.log('Updating question ' + JSON.stringify(question));
        Object.assign(question, params);
        await question.save();
        return { message: 'Question Updated Successfully', data:question, code : 0, isSuccess:true };
    }catch(error){
        consoler.log('Error Updating question ' + error);
        return { message: error.message, data:null, code : 1, isSuccess:false};
    } 
    
}

async function _delete(id) {
    try{
        const res = await getById(id);
        const question = res.data;
        await question.destroy();
        return {message: 'Question deleted successfully', data:null, code : 0, isSuccess:true};
    }catch(error){
        consoler.log('Error deleting question ' + error);
        return {message: error.message, data:null, code : 1, isSuccess:false};
    }
}