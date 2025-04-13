const { DataTypes } = require('sequelize');
// const SubjectCategory = require('../../enum/subject_category.enum')

module.exports = model;

const SubjectCategory = {
    SCIENCE : 'SCIENCE',
    ART : 'ART',
    SOCIAL_SCIENCE :'SOCIAL_SCIENCE'
}

function model(sequelize){
	const attributes = {
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
		}
	}
	return sequelize.define('Subject', attributes);
}