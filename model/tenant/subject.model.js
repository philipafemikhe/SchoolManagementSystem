const { DataTypes } = require('sequelize');
// const SubjectCategory = require('../../enum/subject_category.enum')

module.exports = model;

const SubjectCategory = {
    SCIENCE : 'SCIENCE',
    ART : 'ART',
    SOCIAL_SCIENCE :'SOCIAL_SCIENCE',
	FRONTEND :'FRONTEND',
	BACKEND : 'BACKEND'
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
		category: {
			type: DataTypes.ENUM(...Object.values(SubjectCategory)),
			allowNull : false
		},
		credit_unit:{
			type : DataTypes.INTEGER,
			allowNull : false
		}
	}
	return sequelize.define('Subject', attributes);
}