const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize){
    const attributes = {
        email:{ type: DataTypes.STRING, allowNull: false},
        host:{ type: DataTypes.STRING, allowNull: false},
        port:{ type: DataTypes.INTEGER, allowNull: false},
        username:{ type: DataTypes.STRING, allowNull: false},
        password:{ type: DataTypes.STRING, allowNull: false},
        database:{ type: DataTypes.STRING, allowNull: false},
        // user_id: { type: DataTypes.INTEGER, references: { model: User, key: 'id' }}
    }

    return sequelize.define('Tenant', attributes);
}