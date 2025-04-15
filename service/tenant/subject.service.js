const  tenantdb = require('../../_helpers/tenantdb');
const util = require('util');
const consoler = require('_helpers/consoler');
const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');


async function connectToDb(){
    consoler.log('connecting to tenant DB  ' + tenantdb.dbName);
    var tenantConnection = {};
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${tenantdb.dbName}\`;`);

    // connect to db
    const sequelize = new Sequelize(tenantdb.dbName, user, password, { dialect: 'mysql' });

    SchoolArm = require('../../model/tenant/school_arms.model')(sequelize);
    ArmClass = require('../../model/tenant/arm_class.model')(sequelize);
    Subject = require('../../model/tenant/subject.model')(sequelize);


    SchoolArm.hasMany(ArmClass);
    ArmClass.belongsTo(SchoolArm);
    Subject.belongsToMany(SchoolArm, { through: 'SchoolArm_Subject' });
    SchoolArm.belongsToMany(Subject, { through: 'SchoolArm_Subject' });
    
    tenantConnection.schoolArm = SchoolArm;
    tenantConnection.armClass = ArmClass;
    tenantConnection.subject = Subject;

    // sync all models with database
    await sequelize.sync({ alter: true });
    return tenantConnection;
}



module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    try{
        consoler.log('Fetching data from db ' + tenantdb.dbName);
        var conn = await connectToDb();
        return conn.subject.findAll();
    }catch(e){
        consoler.error(e);
        throw Error ('There was an error ' + e);
    }
}
    


async function getById(id) {
    return await getSubject(id);
}

async function create(params) {
    // validate
    try{
    if (await tenantdb.subject.findOne({ where: { title: params.title } })) {
            throw 'Title "' + params.title + '" is already registered';
        }
        console.log('new subject ' + params);
        const subject = new tenantdb.subject(params);
        // save subject
        await subject.save();
        console.log('new subject saved');
        
    }catch(e){
        console.log('Error creating subject ' + e);
    }
    
}

async function update(id, params) {
    const subject = await getSubject(id); 

    // validate
    // const emailChanged = params.email && subject.email !== params.email;
    // if (emailChanged && await tenantdb.subject.findOne({ where: { email: params.email } })) {
    //     throw 'Email "' + params.email + '" is already registered';
    // }

    // // hash password if it was entered
    // if (params.password) {
    //     params.passwordHash = await bcrypt.hash(params.password, 10);
    // }

    // // copy params to subject and save
    // Object.assign(subject, params);
    // await subject.save();
}

async function _delete(id) {
    const subject = await getSubject(id);
    await subject.destroy();
}

// helper functions

async function getSubject(id) {
    const subject = await tenantdb.subject.findByPk(id);
    if (!subject) throw 'Subject not found';
    return subject;
}
