const consoler = require('../../../_helpers/consoler');
const db = require('../../../_helpers/db');
const resolveTenant = require('../../../_middleware/resolveTenant');
const bcrypt = require('bcrypt');

module.exports = {
    createCandidate
};

async function createCandidate(candidateDTO) {
    consoler.log('service - candidateDTO' + JSON.stringify(candidateDTO));
    try{
        const tenant = await db.tenants.findOne({
        where: {
            id: candidateDTO.tenantId
            }
        });
        if (!tenant) throw 'Tenant not found';
        consoler.log('Candidate service, tenant retrieved ' + JSON.stringify(tenant));
        const candidateRole = await db.roles.findOne({ where: {name : 'EXAM_CANDIDATE' } });
        const passwordHash = await bcrypt.hash(candidateDTO.password, 10);
        await resolveTenant.resolveTenant(tenant.database, candidateRole);
        const candidate = await global.tenantConnection.candidate.create({
            candidateNo: candidateDTO.candidateNo,
            firstName : candidateDTO.firstName,
            lastName : candidateDTO.lastName,
            email : candidateDTO.email,
            username : candidateDTO.username,
            password : passwordHash,
            phoneNo : candidateDTO.phoneNo,
            address : candidateDTO.address 
        });
        consoler.log('candidate created ' + JSON.stringify(candidate));
        return candidate;
    }catch(error){
        consoler.log('Error creating candidate ' + error);
        return null;
    }
    
}