const { DataTypes } = require('sequelize');

// { DataTypes}

module.exports = model;

const QuestionType = {
    MULTIPLE_CHOICE : 'MULTIPLE_CHOICE',
    SHORT_ANSWER : 'SHORT_ANSWER',
    DRAG_DROP : 'DRAG_DROP'
}

function model(sequelize){
    const attributes = {
        question:{
            type : DataTypes.STRING,
            allowNull : false
        },
        type:{
            type : DataTypes.ENUM(...Object.values(QuestionType)),
            allowNull : false
        },
        marks:{
            type : DataTypes.INTEGER
        }
    }

    return sequelize.define('Question', attributes);
}