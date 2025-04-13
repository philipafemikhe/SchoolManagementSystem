var  tenantdb = require('../../_helpers/tenantdb');
const util = require('util');


module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {

    const dbName="sms_aimet1744435250123";
    tenantdb.tenantdb(dbName)
        .then(db => db.subject.findAll())        
        .catch(err=>console.log(err));
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
