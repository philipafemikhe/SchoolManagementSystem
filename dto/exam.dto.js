class ExamDTO {
  constructor({ code, title, description, passMark, status }) {
    this.code = code;
    this.title = title;
    this.description = description;
    this.passMark = passMark;
    this.status = status;
  }
}

module.exports = ExamDTO;