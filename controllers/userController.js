const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const session = require('express-session');
const fs = require('fs');
const db = require('../models/db');
const User = require('../models/patientModel');
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
			//sanitize use inputs
			const fname = helper.sanitize(req.body.firstname);
			const lname = helper.sanitize(req.body.lastname);
			const email = helper.sanitize(req.body.email);
			
			bcrypt.hash(password, saltRounds, (err, hash) => {
				if(!req.files['picture']) {
					var USER = new User({
						usertype: 'patient',
						firstname: fname,
						lastname: lname,
						email: email,
						password: hash
					});

					db.findOne(User, USER, function(flag){
						if (flag) {
							res.redirect('/');
						}
					});
				}

				else {
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

					db.findOne(User, USER, function(flag){
						if (flag) {
							res.redirect('/');
						}
					});
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