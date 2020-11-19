const db = require('../models/db.js');
const Clinic = require('../models/clinicModel.js');
const Doctor = require('../models/doctorModel.js')

const homeController = {
	doctors: function(req,res){
		db.findMany(Doctor, {}, null, function(results) {
			if(results != null) {
				res.render('home-doctors', {doctors: results})
			}
		})
  	},
    
	clinics: function(req,res){
		db.findMany(Clinic, {}, null, function(results) {
			if(results != null) {
				res.render('home-clinics', {clinics: results})
			}
		})
  	},
    
	viewDoctors: function(req,res){
		var id = req.query.id

		db.findMany(Doctor, {clinics: id}, null, function(doctors) {
			db.findMany(Clinic, {}, null, function(clinics) {
				var results = {
					doctors: doctors,
					clinics: clinics
				}
				if(results != null) {
					res.render('view-doctors', results)
				}
			})
		})
  	}
}

module.exports = homeController