const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const util = require('util');


let dbName = 'sms_afemi1744434399262';


async function tenantdb(dbName) {
    tenantConnection = {};
    // create db if it doesn't already exist
    console.log('running initializeTenantDB with db ' + dbName);
    if(dbName != ''){
        const { host, port, user, password, database } = config.database;
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);

        // connect to db
        const sequelize = new Sequelize(dbName, user, password, { dialect: 'mysql' });

        SchoolArm = require('../model/tenant/school_arms.model')(sequelize);
        ArmClass = require('../model/tenant/arm_class.model')(sequelize);
        Subject = require('../model/tenant/subject.model')(sequelize);


        SchoolArm.hasMany(ArmClass);
        ArmClass.belongsTo(SchoolArm);
        Subject.belongsToMany(SchoolArm, { through: 'SchoolArm_Subject' });
        SchoolArm.belongsToMany(Subject, { through: 'SchoolArm_Subject' });
        
        tenantConnection.schoolArm = SchoolArm;
        tenantConnection.armClass = ArmClass;
        tenantConnection.subject = Subject;

        // sync all models with database
        await sequelize.sync({ alter: true });
        console.log(util.inspect(tenantConnection, { showHidden: false, depth: null, colors: true }));
        return tenantConnection;
    }  
}

module.exports.tenantdb = tenantdb;
