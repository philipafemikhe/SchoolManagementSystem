const { DataTypes} = require('sequelize');
// export {};
module.exports = model;

function model(sequelize){
    const attributes = {
        candidateNo:{
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
            allowNull : false
        }
    };
    const options = {
        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        scopes: {
            withHash: { attributes: {}, }
        }
    };
    return sequelize.define('Candidate', attributes, options);
}