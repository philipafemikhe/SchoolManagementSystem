const { DataTypes} = require('sequelize');

module.exports = model;

function model(sequelize){
    const attributes = {
        score:{
            type: DataTypes.INTEGER,
            allowNull:true
        },remark:{
            type: DataTypes.STRING,
            allowNull:true
        },
    }
    return sequelize.define('Result', attributes);

}