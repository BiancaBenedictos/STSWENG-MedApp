const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const session = require('express-session');
const fs = require('fs');
const helper = require('../helpers/helper');
const saltRounds = 10;

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
						req.session.email = req.body.email;
						req.session.name = user.firstname + " " + user.lastname;
						req.session.userId = user._id;
						req.session.type = 'user'
						req.session.age = user.age,
						req.session.weight = user.weight,
						req.session.height = user.height,
						req.session.profpic = user.profpic
						res.redirect('/homeDoctors');
					}
                });	
			}
			else {
				db.findOne(Doctor, query, null, function(doctor) {
					if(doctor != null) {
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
			res.render('register', {title: 'Register | Med-Aid',
			register_active: true,
			clinics: clinics, professions: professions})
		})
	},

	getCheckEmail: function(req,res){
        var email = req.query.email
		db.findOne(User, {email:email}, 'email', function(user) {
			if(user)
				res.send(user)
			else {
				db.findOne(Doctor, {email:email}, 'email', function(doctor) {
					if(doctor)
						res.send(doctor)
					else {
						db.findOne(Admin, {email:email}, 'email', function(admin) {
							res.send(admin)
						})
					}
				})
			}
		}) 
	},

	postRegister: function(req, res) {
		var errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            var details = {};
            for (let i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

            res.render('register', {
                inputs: req.body,
                details: details,
                title: 'Register | Med-Aid',
                register_active: true,
            });
        } else {
			const fname = helper.sanitize(req.body.firstname);
			const lname = helper.sanitize(req.body.lastname);
			const email = helper.sanitize(req.body.email);

			var password = req.body.password;
			var doccheck = req.body.doctorCheck;

			if(doccheck != "on") {
				
				const age = helper.sanitize(req.body.age);
				const height = helper.sanitize(req.body.height);
				const weight = helper.sanitize(req.body.weight);
				
				var bookedappointments = [];

				bcrypt.hash(password, saltRounds, (err, hash) => {
					if(!req.files['picture']) {

						var USER = new User({
							email: email,
							password: hash,
							firstname: fname,
							lastname: lname,
							bookedAppointments: bookedappointments,
							age: age,
							height: height,
							weight: weight

						});

						db.insertOne(User, USER, function (flag) {
							if (flag) {
								req.session.email = USER.email;
								req.session.name = USER.firstname + " " + USER.lastname;
								req.session.userId = USER._id;
								req.session.type = 'user'
								req.session.age = USER.age,
								req.session.weight = USER.weight,
								req.session.height = USER.height
								res.redirect('/upcomingAppointments');
							}
						});
					}

					else {
						var USER = new User({
							email: email,
							password: hash,
							firstname: fname,
							lastname: lname,
							bookedAppointments: bookedappointments,
							age: age,
							height: height,
							weight: weight

						});

						var picName = USER.firstname;
						var picFileName = helper.renameAvatar(req, picName);
						USER.profpic = 'images/' + picFileName;
						

						db.insertOne(User, USER, function(flag) {
							if (flag){
								req.session.email = USER.email;
								req.session.name = USER.firstname + " " + USER.lastname;
								req.session.userId = USER._id;
								req.session.type = 'user'
								req.session.age = USER.age,
								req.session.weight = USER.weight,
								req.session.height = USER.height
								res.redirect('/upcomingAppointments');
							}
						});
					}
				});
			} else {
				const profess = req.body.profession;
				var clinics = [];
				clinics = req.body.clinics;
				
				// for(var i = 0; i < req.body.newName.length; i++) {
				// 	var address = {
				// 		street: req.body.newStreet[i],
				// 		city: req.body.newCity[i],
				// 		state: req.body.newState[i]
				// 	}
				// 	var clinic = {
				// 		clinicName: req.body.newName[i],
				// 		clinicAddress: address,
				// 		clinicDoctors: [],
				// 		status: 'unverified'
				// 	}
					
				// 	// console.log(clinic)
				// 	db.insertOne(Clinic, clinic, function() {})
				// 	db.findOne(Clinic, clinic, function(result) {
				// 		console.log(result)
				// 	})
				// }

				bcrypt.hash(password, saltRounds, (err, hash) => {
					if(!req.files['picture']) {
						var DOCTOR = new Doctor({
							email: email,
							password: hash,
							firstname: fname,
							lastname: lname,
							clinics: clinics,
							profession: profess,
							status: 'unverified',
							availability: [],
							bookedAppointments: [],
							// newClinics: newClinics
						});

						var credsName = DOCTOR.lastname;
						var credFileName = helper.renameCredentials(req, credsName);
						DOCTOR.credentials = credFileName;

						db.insertOne(Doctor, DOCTOR, function (flag) {
							if (flag) {
								req.session.email = DOCTOR.email;
								req.session.name = DOCTOR.firstname + " " + DOCTOR.lastname;
								req.session.userId = DOCTOR._id;
								req.session.type = 'doctor'
								req.session.profession = DOCTOR.profession
								res.redirect('/upcomingAppointments');
							}
						});
					} else {
						var DOCTOR = new Doctor({
							email: email,
							password: hash,
							firstname: fname,
							lastname: lname,
							clinics: clinics,
							profession: profess,
							status: 'unverified',
							availability: [],
							bookedAppointments: [],
							// newClinics: newClinics
						});

						var picName = DOCTOR.firstname;
						var picFileName = helper.renameAvatar(req, picName);
						DOCTOR.profpic = 'images/' + picFileName; 

						var credsName = DOCTOR.lastname;
						var credFileName = helper.renameCredentials(req, credsName);
						DOCTOR.credentials = credFileName;

						db.insertOne(Doctor, DOCTOR, function (flag) {
							if (flag) {
								req.session.email = DOCTOR.email;
								req.session.name = DOCTOR.firstname + " " + DOCTOR.lastname;
								req.session.userId = DOCTOR._id;
								req.session.type = 'doctor'
								req.session.profession = DOCTOR.profession
								res.redirect('/upcomingAppointments');
							}
						});
					}
				});

			}
        
		}
	},

	logout: function(req,res) {
		req.session.destroy(function(err){
			if(err) throw err;

			res.redirect('/');
		})
	},

	getEditProfile: function(req,res) {
		db.findOne(User, {_id: req.session.userId}, null, function(user) {
			if(user) {
				res.render('edit-profile', user)
			}
			else {
				db.findOne(Doctor, {_id: req.session.userId}, null, function(doctor) {
					if(doctor) {
						db.findMany(Clinic, {}, null, function(clinics) {
							db.findMany(Clinic, {_id: {$in: doctor.clinics}}, null, function(docClinics) {
								var professions = Doctor.schema.path('profession').enumValues
								res.render('doctor-edit-profile', {user: doctor, professions: professions, clinics: clinics, docClinics: docClinics})
							})
						})
					}
					else {
						res.render('error')
					}
				})
			}
		})
	},

	postEditProfile: function(req,res) {
		res.render('edit-profile')
	},

	error: function(req,res) {
		res.render('error')
	}
}

module.exports = userController;