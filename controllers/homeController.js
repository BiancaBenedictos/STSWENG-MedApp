const db = require('../models/db.js');
const Clinic = require('../models/clinicModel.js');
const Doctor = require('../models/doctorModel.js')

const homeController = {
	doctors: function(req,res){
		db.findMany(Doctor, {status: 'verified'}, null, function(results) {
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

		var professions = []

		db.findOne(Clinic, {_id: id}, null, function(clinic) {
			db.findMany(Doctor, {clinics: id}, null, function(doctors) {
				for(var i = 0; i < doctors.length; i++) {
					if(professions.includes(doctors[i].profession) === false)
						professions.push(doctors[i].profession)
				}

				var results = {
					clinic: clinic.clinicName,
					doctors: doctors,
					professions: professions
				}
				console.log(results)
				res.render('view-doctors', results)
			})
		})
  	}
}

module.exports = homeController