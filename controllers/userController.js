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
						// console.log(req.session);
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
    
	getPatientRegister: function(req,res){
		res.render('user-register', {title: 'Register | Med-Aid',
		register_active: true})
	},

	getDoctorRegister: function(req, res) {
		db.findMany(Clinic, {}, null, function(clinics) {
			var professions = Doctor.schema.path('profession').enumValues
			console.log(professions);
			console.log(clinics);
			res.render('doctor-register', {title: 'Register | Med-Aid',
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

	postPatientRegister: function(req, res) {
		console.log(req.body);
		var errors = validationResult(req);
		console.log(errors);

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
		}
	},

	postDoctorRegister: function(req, res) {
		var errors = validationResult(req);
		console.log(errors);

        if (!errors.isEmpty()) {
            errors = errors.errors;

            var details = {};
            for (let i = 0; i < errors.length; i++)
                details[errors[i].param + 'Error'] = errors[i].msg;

			db.findMany(Clinic, {}, null, function(clinics) {
				var professions = Doctor.schema.path('profession').enumValues
				console.log(professions);
				console.log(clinics);
				res.render('doctor-register', {title: 'Register | Med-Aid',
				inputs: req.body,
                details: details,
				register_active: true,
				clinics: clinics, professions: professions})
			})
        } else {
			console.log("valid doctor");
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
						// console.log(flag);
						if (flag) {
							console.log("inserted");
							req.session.email = DOCTOR.email;
							req.session.name = DOCTOR.firstname + " " + DOCTOR.lastname;
							req.session.userId = DOCTOR._id;
							req.session.type = 'doctor'
							req.session.profession = DOCTOR.profession
							console.log("inserted");
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
			})
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
								var p = Doctor.schema.path('profession').enumValues
								var professions = [];

								for (var i in p) {
									professions.push({name: p[i], class: ""})
									if (p[i] == req.session.profession)
										professions[i].class = 'selected'
								}

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
		var userID = mongoose.Types.ObjectId(req.session.userId)

		if (req.session.type == 'doctor') {
			var clinics = req.body.info.clinics
			
			db.findOne(Doctor, {_id: userID}, "clinics", function(resClinics) {
				var addClinics = clinics.filter( 
					function(i) { 
						return this.indexOf(i) < 0; 
					}, resClinics.clinics).map(s => mongoose.Types.ObjectId(s));

				var removeClinics = resClinics.clinics.filter( 
					function(i) { 
						return this.indexOf(i) < 0; 
					}, clinics).map(s => mongoose.Types.ObjectId(s));

				db.updateMany(Clinic, {_id: {$in: removeClinics}}, {$pull: {clinicDoctors: req.session.userId}})
				db.updateMany(Clinic, {_id: {$in: addClinics}}, {$push: {clinicDoctors: req.session.userId}})

				db.updateOne(Doctor, {_id: userID}, req.body.info, function(results) {
					// update session info
					req.session.email = req.body.info.email;
					req.session.name = req.body.info.firstname + " " + req.body.info.lastname;
					req.session.profession = req.body.info.profession;
					
					if (results) {
						res.send("Changes to Dr. " + req.session.name + "'s information is saved")
					} else {
						res.send("Changes to Dr. " + req.session.name + "'s information failed to save. Please try again.")
					}
				})
			})
		} else {
			var newInfo = req.body
			var oldEmail = req.session.email
			var newEmail = req.body.email

			if(req.files['picture']) {
				var picName = req.body.firstname;
				var picFileName = helper.renameAvatar(req, picName);
				newInfo.profpic = 'images/' + picFileName;
			}

			db.findOne(User, {email:newEmail}, null, function(user) {
				if(oldEmail != newEmail && user) {
					res.send('email')
				}
				else {
					db.updateOne(User, {_id: userID}, newInfo, function(flag) {
						req.session.name = req.body.firstname + " " + req.body.lastname
						req.session.email = req.body.email

						if(req.files['picture']) flag = true
						res.send(flag)
					})
				}
			})
		}
	},

	error: function(req,res) {
		res.render('error')
	},

	changePassword: function(req, res) {
		var oldPass = req.body.oldPassword
		var newPass = req.body.newPassword
		
		if(!newPass) {
			res.send('empty')
		}
		else {
			if(req.session.type = 'user') {
				db.findOne(User, {_id: req.session.userId}, null, function (user) {
					bcrypt.compare(oldPass, user.password, function(err, equal) {
						if(equal){
							bcrypt.hash(newPass, saltRounds, (err, hash) => {
								db.updateOne(User, {_id: req.session.userId}, {password: hash}, function(flag){
									res.send(true)
								})
							})
						}
						else {
							res.send(false)
						}
					});
				})
			}
			else {
				db.findOne(Doctor, {_id: req.session.userId}, null, function (doctor) {
					bcrypt.compare(oldPass, doctor.password, function(err, equal) {
						if(equal){
							bcrypt.hash(newPass, saltRounds, (err, hash) => {
								db.updateOne(Doctor, {_id: req.session.userId}, {password: hash}, function(flag){
									res.send(true)
								})
							})
						}
						else {
							res.send(false)
						}
					});	
				})
			}
		}
	}
}

module.exports = userController;