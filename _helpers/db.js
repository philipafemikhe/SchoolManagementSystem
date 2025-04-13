const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    Permission = require('../model/permission.model')(sequelize);
    Role = require('../model/role.model')(sequelize);
    User = require('../model/user.model')(sequelize);
    Tenant = require('../model/tenant.model')(sequelize);


    User.hasOne(Role);
    Tenant.hasOne(User);
    Role.belongsToMany(Permission, { through: 'Role_Permission' });
    Permission.belongsToMany(Role, { through: 'Role_Permission' });
    
    db.users = User;
    db.roles = Role;
    db.permissions = Permission;
    db.tenants = Tenant;

    // sync all models with database
    await sequelize.sync({ alter: true });
}