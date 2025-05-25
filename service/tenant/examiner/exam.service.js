const consoler = require('../../../_helpers/consoler');
const db = require('../../../_helpers/db');
const resolveTenant = require('../../../_middleware/resolveTenant');
const { EXAMINER } = require('../../../enum/role');
const { Op } = require('sequelize');

module.exports = {
    createExam
};

async function createExam(examDTO) {
    consoler.log('service - examDTO' + JSON.stringify(examDTO));

    const tenant = await db.tenants.findOne({
    where: {
        id: 9
        }
    });
    if (!tenant) throw 'Tenant not found';
     
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
            return { data: null, message: 'Exam already exist' };
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
        return newExam;
    }catch(error){
        consoler.log('Error creating exam ' + error);
        return { data: null, message: 'Exam already exist' };
    }
    
}