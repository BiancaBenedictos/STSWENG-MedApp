const db = require('../models/db.js');
const Clinic = require('../models/clinicModel.js');
const Doctor = require('../models/doctorModel.js')

const adminController = {
	clinics: function(req,res) {
		db.findMany(Clinic, {}, null, function(results) {
			if(results != null) {
				res.render('admin-clinics', {clinics: results})
			}
		})
    },
    
	doctors: function(req,res) {
		db.findMany(Doctor, {status: "verified"}, null, function(doctors) {
			db.findMany(Clinic, {}, null, function(clinics) {
				var results = {
					doctors: doctors,
					clinics: clinics
				}
				if(results != null) {
					res.render('admin-doctors', results)
				}
			})
		})
    },
    
	pending: function(req,res) {
		db.findMany(Doctor, {status: "unverified"}, null, function(doctors) {
			var user = req.session
			var results = {
				user: user,
				doctors: doctors
			}
			res.render('admin-pending', results)
		})
	}
}

module.exports = adminController