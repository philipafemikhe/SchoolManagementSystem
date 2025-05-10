const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize){
	const attributes = {
		code:{
			type: DataTypes.STRING,
			allowNull:false
		},title:{
			type: DataTypes.STRING,
			allowNull:false
		},
		description:{
			type: DataTypes.STRING
		}
	}

	return sequelize.define('SchoolArm', attributes);

}