'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
	class User extends Sequelize.Model{}
	User.init({
		id: {
			type:Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			validate:{
				notEmpty:true
			}
		},
		firstName: {
			type: Sequelize.STRING,
			allowNull: false,
			validate:{
				notEmpty:true
			}
		  },
		  lastName: {
			type: Sequelize.STRING,
			allowNull: false,
			validate:{
				notEmpty:true
			}
		  },
		  emailAddress: {
			type: Sequelize.STRING,
			allowNull: false,
			validate:{
				notEmpty: true,
				isEmail:true
			}
		  },
		  password: {
			type: Sequelize.STRING,
			allowNull: false,
			validate:{
				notEmpty:true
			}
			
		  },
	},{sequelize});

	// Set hasMany relationship to Course
	User.associate = function(models) {
		User.hasMany(models.Course)
	  };
	

	return User;
}