const bcrypt = require('bcrypt');

const db = require('../models/db');
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Admin = require('../models/adminModel');
const Clinic = require('../models/clinicModel');

const userController = {
	getLogin: function(req,res){
		res.render('login')
	},

	postLogin: function(req,res){
		var query = {email: req.body.email};
		var password = req.body.password;

		db.findOne(User, query, null, function (user) {
			if(user != null) {
				bcrypt.compare(password, user.password, function(err, equal) {
					if(equal){
						console.log("Patient")
						req.session.email = req.body.email;
						req.session.name = user.firstname + " " + user.lastname;
						req.session.userId = user._id;
						req.session.type = 'user'
						req.session.age = user.age,
						req.session.weight = user.weight,
						req.session.height = user.height
						res.redirect('/homeDoctors');
					}
                });	
			}
			else {
				db.findOne(Doctor, query, null, function(doctor) {
					if(doctor != null) {
						console.log("Doctor")
						bcrypt.compare(password, doctor.password, function(err, equal) {
							if(equal) {
								req.session.email = req.body.email;
								req.session.name = doctor.firstname + " " + doctor.lastname;
								req.session.userId = doctor._id;
								req.session.type = 'doctor'
								req.session.profession = doctor.profession
								res.redirect('/homeDoctors');
							}
						});	
					}
					else {
						db.findOne(Admin, query, null, function(admin) {
							if(admin != null) {
								console.log("Admin")
								bcrypt.compare(password, admin.password, function(err, equal) {
									if(equal) {
										req.session.email = req.body.email;
										req.session.name = admin.firstname + " " + admin.lastname;
										req.session.userId = admin._id;
										req.session.type = 'admin'
										res.redirect('/homeDoctors');
									}
								})
							}
						})
					}
				})
			}
		})
	},

	getCheckLogin: function(req, res) {
		var query = {email: req.query.email};
		var password = req.query.password

		db.findOne(User, query, null, function(user) {
			if(user != null) {
				bcrypt.compare(password, user.password, function(err, equal) {
					if(equal){
						res.send(true)
					}
                    else {
                    	res.send(false)
                    }
                });	
			}
			else {
				db.findOne(Doctor, query, null, function(doctor) {
					if(doctor != null) {
						bcrypt.compare(password, doctor.password, function(err, equal) {
							if(equal){
								res.send(true)
							}
							else {
								res.send(false)
							}
						});	
					}
					else {
						db.findOne(Admin, query, null, function(admin) {
							
							if(admin != null) {
								bcrypt.compare(password, admin.password, function(err, equal) {
									if(equal){
										res.send(true)
									}
									else {
										res.send(false)
									}
								});	
							}
							else {
								res.send(false)
							}
						})
					}
				})
			}
		})
	},
    
	getRegister: function(req,res){
		db.findMany(Clinic, {}, null, function(clinics) {
			var professions = Doctor.schema.path('profession').enumValues
			res.render('register', {clinics: clinics, professions: professions})
		})
	}
}

module.exports = userController