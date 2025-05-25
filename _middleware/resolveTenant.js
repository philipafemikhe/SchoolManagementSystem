const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const consoler = require('_helpers/consoler');
const Role = require('../enum/role');

global.tenantConnection = {};
global.isLogedOut = false;

async function resolveTenant(dbName, role) {    
    // create db if it doesn't already exist
    consoler.log('resolveTenant DB  ' + dbName + ', role ' + role);
    if((dbName != undefined) && (dbName != '')){
        const { host, port, user, password, database } = config.database;
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);

        // connect to db
        const sequelize = new Sequelize(dbName, user, password, { dialect: 'mysql' });
        
        if(role.name == Role.BUSINESS_OWNER.toString()){
            consoler.log('BUSINESS_OWNER DB');
            SchoolArm = require('../model/tenant/business_owner/school_arms.model')(sequelize);
            ArmClass = require('../model/tenant/business_owner/arm_class.model')(sequelize);
            Subject = require('../model/tenant/business_owner/subject.model')(sequelize);


            SchoolArm.hasMany(ArmClass);
            ArmClass.belongsTo(SchoolArm);
            Subject.belongsToMany(SchoolArm, { through: 'schoolArm_subject' });
            // SchoolArm.belongsToMany(Subject, { through: 'SchoolArm' });
            
            tenantConnection.schoolArm = SchoolArm;
            tenantConnection.armClass = ArmClass;
            tenantConnection.subject = Subject;
        }else if((role.name == Role.EXAMINER.toString()) || (role.name == Role.EXAM_CANDIDATE.toString())){
            consoler.log('EXAMINER DB');
            // Exam = require('../model/tenant/examiner/exam.model')(sequelize);
            Exam = require('../model/tenant/examiner/exam.model')(sequelize);
            Question = require('../model/tenant/examiner/question.model')(sequelize);
            Candidate = require('../model/tenant/examiner/candidate.model')(sequelize);
            Result = require('../model/tenant/examiner/result.model')(sequelize);
            
            Exam.hasMany(Question);
            Question.belongsTo(Exam);

            Candidate.belongsToMany(Exam, { through: 'candidate_exam' });
            Question.belongsToMany(Candidate, { through: 'candidate_question' });
            Candidate.hasMany(Result);

            tenantConnection.exam = Exam;
            tenantConnection.question = Question;
            tenantConnection.candidate = Candidate;
            tenantConnection.result = Result;

        }

        // sync all models with database
        await sequelize.sync({ alter: true });
        consoler.log(tenantConnection);
        consoler.log('Tenant connection established');
        global.tenantConnection = tenantConnection;
        consoler.log('global.tenantConnection ' + JSON.stringify(global.tenantConnection));
        return tenantConnection;
    }else{
        return null;  
    }
}

module.exports.resolveTenant = resolveTenant;


