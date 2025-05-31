const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize){
    const attributes = {
        title:{
            type : DataTypes.STRING,
            allowNull : false
        },
        isAnswer:{
            type : DataTypes.BOOLEAN,
            allowNull : false
        }
    };
    return sequelize.define('QuestionOption', attributes);
}

