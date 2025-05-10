const { DataTypes } = require('sequelize');


module.exports = model;

function model(sequelize) {
    const attributes = {
        refreshToken: { type: DataTypes.STRING, allowNull: false }
    };
    return sequelize.define('UserToken', attributes);

}