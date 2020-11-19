const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const session = require('express-session');
const fs = require('fs');
const db = require('../models/db');
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const helper = require('../helpers/helper');
const saltRounds = 10;

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
//			console.log(req.body.firstname);
//			console.log(req.body.lastname);
//			console.log(req.body.email);
//			console.log(req.body.password);
//			console.log(req.files['picture']);

			//sanitize use inputs
			const fname = helper.sanitize(req.body.firstname);
			const lname = helper.sanitize(req.body.lastname);
			const email = helper.sanitize(req.body.email);
			var password = req.body.password;
			
			bcrypt.hash(password, saltRounds, (err, hash) => {
				if(!req.files['picture']) {
					console.log('NO PICTURE');

					var USER = new User({
						usertype: 'patient',
						firstname: fname,
						lastname: lname,
						email: email,
						password: hash
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
						firstname: fname,
						lastname: lname,
						email: email,
						password: hash
					});

					var picName = USER.firstname;
					var picFileName = helper.renameAvatar(req, picName);
					USER.profpic = picFileName;
					
					console.log(USER);

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
        
		}
	},
/*
	postRegisterDoc: function (req, res) {
		console.log(req.body);
		var errors = validationResult(req);

		if (!errors.isEmpty()) {
			errrors = errors.errors;

			var details = {};

			for (let i = 0; i < errors.length; i++) {
                // remove array indices for wildcard checks
                details[`${errors[i].param.replace(/\[\d\]/g, '')}Error`] =
                    errors[i].msg;
			}
			res.render('register', {
                inputs: req.body,
                details: details,
                title: 'Register | Med-Aid',
                register_active: true,
            });
		} else {
			const o = {};
			for (const field in req.body) {
				if(req.body.hasOwnProperty(field)) {
					o[field] = helper.sanitize(req.body[field]);
				}
			}

			var doctor = {
				firstname: o.firstname
			}
		}
	}
*/
}

module.exports = userController;