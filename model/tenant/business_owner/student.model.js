const { DataTypes} = require('sequelize');
module.exports = model;

function model(sequelize){
    const attributes = {
        studentNo:{
            type : DataTypes.STRING,
            allowNull : true
        },
        firstName:{
            type : DataTypes.STRING,
            allowNull : false
        },
        lastName:{
            type : DataTypes.STRING,
            allowNull : false
        },
        email:{
            type : DataTypes.STRING,
            allowNull : false
        },
        username:{
            type : DataTypes.STRING,
            allowNull : false
        },
        password:{
            type : DataTypes.STRING,
            allowNull : false
        },
        phoneNo:{
            type : DataTypes.STRING,
            allowNull : false
        },
        address:{
            type : DataTypes.STRING,
            allowNull : true
        }
    }
    return sequelize.define('Student', attributes);
}