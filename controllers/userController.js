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
const Clinic = require('../models/clinicModel');

const userController = {
	getLogin: function(req,res){
		res.render('login')
	},
    
	getRegister: function(req,res){
		res.render('register', {
			title: 'Register | Med-Aid',
			register_active: true,
		});
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
				bcrypt.hash(password, saltRounds, (err, hash) => {
					if(!req.files['picture']) {
						console.log('NO PICTURE');

						var USER = new User({
							usertype: 'patient',
							email: email,
							password: hash,
							firstname: fname,
							lastname: lname
						});

						db.insertOne(User, USER, function (flag) {
							if (flag) {
								res.redirect('/upcomingAppointments');
							}
						});
					}

					else {
						console.log('HAS PICTURE; SAVING...')
						var USER = new User({
							usertype: 'patient',
							email: email,
							password: hash,
							firstname: fname,
							lastname: lname
						});

						var picName = USER.firstname;
						var picFileName = helper.renameAvatar(req, picName);
						USER.profpic = picFileName;
						
			//			console.log(USER);

						db.insertOne(User, USER, function(flag) {
							if (flag){
								res.redirect('/upcomingAppointments');
							}
						});

						// db.insertOne(User, USER, function (flag) {
						// 	console.log('inside insert function....');
						// 	console.log(flag);
						// 	if (!flag) {
						// 		res.redirect('/upcomingAppointments');
						// 	}
						// });
					}
				});
			} else {
				const profess = req.body.profession;
				var clinics = [];
				clinics = req.body.clinics;

				bcrypt.hash(password, saltRounds, (err, hash) => {
					if(!req.files['picture']) {
						console.log('NO PICTURE');

						var DOCTOR = new Doctor({
							email: email,
							password: hash,
							firstname: fname,
							lastname: lname,
							clinics: clinics,
							profession: profess,
							status: 'unverified'
						});

						var credsName = DOCTOR.lastname;
						var credFileName = helper.renameCredentials(req, credsName);
						DOCTOR.credentials = credFileName;

						db.insertOne(Doctor, DOCTOR, function (flag) {
							if (flag) {
								res.redirect('/upcomingAppointments');
							}
						});
					} else {
						console.log('HAS PICTURE; SAVING...')

						var DOCTOR = new Doctor({
							email: email,
							password: hash,
							firstname: fname,
							lastname: lname,
							clinics: clinics,
							profession: profess,
							status: 'unverified'
						});

						var picName = DOCTOR.firstname;
						var picFileName = helper.renameAvatar(req, picName);
						DOCTOR.profpic = picFileName; 

						var credsName = DOCTOR.lastname;
						var credFileName = helper.renameCredentials(req, credsName);
						DOCTOR.credentials = credFileName;

						db.insertOne(Doctor, DOCTOR, function (flag) {
							if (flag) {
								res.redirect('/upcomingAppointments');
							}
						});
					}
				});

			}
        
		}
	},
	register: function(req,res){
		db.findMany(Clinic, {}, null, function(clinics) {
			var professions = Doctor.schema.path('profession').enumValues
			res.render('register', {clinics: clinics, professions: professions})
		})
	}
}

module.exports = userController;