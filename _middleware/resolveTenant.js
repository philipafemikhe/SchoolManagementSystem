const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const consoler = require('_helpers/consoler');

global.tenantConnection = {};
global.isLogedOut = false;

async function resolveTenant(dbName) {    
    // create db if it doesn't already exist
    consoler.log('connecting to tenant DB  ' + dbName);
    if((dbName != undefined) && (dbName != '')){
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
        consoler.log(tenantConnection);
        consoler.log('Tenant connection established');
        global.tenantConnection = tenantConnection;
        return tenantConnection;
    }  
}

module.exports.resolveTenant = resolveTenant;


