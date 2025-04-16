const consoler = require('_helpers/consoler');
const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const db = require('../_helpers/db');
const resolveTenant = require('../_middleware/resolveTenant');

module.exports = {
    getByEmail
};

async function getByEmail(email) {
    consoler.log(email + ', db ' + JSON.stringify(db));
    const tenant = await db.tenants.findOne({
    where: {
        email: email
        }
    });
    consoler.log('Tenant -' + JSON.stringify(tenant));
    if (!tenant) throw 'Tenant not found';
    consoler.log('Tenant service, tenant retrieved ' + JSON.stringify(tenant));
    return tenant;
}
    


async function getById(id) {
    return await getSubject(id);
}