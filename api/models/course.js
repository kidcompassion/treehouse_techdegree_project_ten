'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) =>{
	class Course extends Sequelize.Model{}

	Course.init({
		id: {
			type:Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: Sequelize.STRING,
			nullable: false,
			validate:{
				notEmpty:true
			}
		},
		description: {
			type: Sequelize.TEXT,
			nullable: false,
			validate:{
				notEmpty:true
			}
		},
		estimatedTime: {
			type: Sequelize.STRING,
			nullable: true
		},
		materialsNeeded: {
			type: Sequelize.STRING,
			nullable: true,
		}
		
	},{sequelize});

	// Get the User model so we can associate to it
	const User = sequelize.define('User');

	Course.associate = function(models) {
		Course.belongsTo(User, {
			// Set the foreign key to be the userid, referencing the id field in the User model
			foreignKey: {
				fieldName: 'userId',
				allowNull: false,
			},
		});
	}
	return Course;
}