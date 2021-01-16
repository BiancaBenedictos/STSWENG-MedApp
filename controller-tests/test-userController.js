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

const userControllerTests = {
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
						res.send(user);
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
								res.send(doctor);
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
										res.send(admin);
									}
								})
							}
						})
					}
				})
			}
		})
	},

    postPatientRegister: function(req, res) {
		var errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            var details = {};
            for (let i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

            res.render('user-register', {
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
							//console.log(USER);
							req.session.email = USER.email;
							req.session.name = USER.firstname + " " + USER.lastname;
							req.session.userId = USER._id;
							req.session.type = 'user'
							req.session.age = USER.age,
							req.session.weight = USER.weight,
							req.session.height = USER.height
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
						}
                    });
                    
                    
				}

				res.send(USER);
			});
		}
	},

	postDoctorRegister: function(req, res) {
		var errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            var details = {};
            for (let i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

			db.findMany(Clinic, {}, null, function(clinics) {
				var professions = Doctor.schema.path('profession').enumValues
				// console.log(professions);
				// console.log(clinics);
				res.render('doctor-register', {title: 'Register | Med-Aid',
				inputs: req.body,
                details: details,
				register_active: true,
				clinics: clinics, professions: professions})
			})
        } else {
			const fname = helper.sanitize(req.body.firstname);
			const lname = helper.sanitize(req.body.lastname);
			const email = helper.sanitize(req.body.email);

			var password = req.body.password;

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
							
						}
                    });
                    
                    res.json(DOCTOR);
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
						}
                    });
                    
                    res.json(DOCTOR);
				}
			})
		}
	},
}

module.exports = userControllerTests;