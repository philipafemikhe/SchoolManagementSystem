class CandidateDTO {
  constructor({ tenantId, candidateNo, firstName, lastName, email, username, password, phoneNo, address }) {
    this.tenantId = tenantId;
    this.candidateNo = candidateNo;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
    this.password = password;
    this.phoneNo = phoneNo;
    this.address = address;
  }
}

module.exports = CandidateDTO;