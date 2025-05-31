const { DataTypes } = require('sequelize');
// export {};
module.exports = model;


const ExamStatus = {
    PENDING : 'PENDING',
    STARTED : 'STARTED',
    STOPPED :'STOPPED'
}

function model(sequelize){
    const attributes = {
        code:{
            type : DataTypes.STRING,
            allowNull : false
        },
        title:{
            type : DataTypes.STRING,
            allowNull : false
        },
        description:{
            type : DataTypes.STRING
        },
        passMark:{
            type : DataTypes.INTEGER,
            allowNull : false
        },
        status:{
            type : DataTypes.ENUM(...Object.values(ExamStatus)),
            allowNull : false
        }
    };
    return sequelize.define('Exam', attributes);
}