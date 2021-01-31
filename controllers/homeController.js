const db = require('../models/db.js');
const Clinic = require('../models/clinicModel.js');
const Doctor = require('../models/doctorModel.js')

const homeController = {
	doctors: function(req,res) {
		if(req.session.email) {
			db.findMany(Doctor, {status: 'verified'}, null, function(results) {
				if(results != null) {
					res.render('home-doctors', {doctors: results})
				}
			})
		}
		else {
			res.redirect('/')
		}
  	},
    
	clinics: function(req,res) {
		if(req.session.email) {
			db.findMany(Clinic, {}, null, function(results) {
				if(results != null) {
					res.render('home-clinics', {clinics: results})
				}
			})
		}
		else {
			res.redirect('/')
		}
  	},
    
	viewDoctors: function(req,res){
		var id = req.query.id
		var professions = []

		if(req.session.email) {
			db.findOne(Clinic, {_id: id}, null, function(clinic) {
				if (!clinic) {
					res.redirect('/error');
					return;
				}

				db.findMany(Doctor, {clinics: id, status: 'verified'}, null, function(doctors) {
					for(var i = 0; i < doctors.length; i++) {
						if(professions.includes(doctors[i].profession) === false)
							professions.push(doctors[i].profession)
					}

					var results = {
						clinic: clinic.clinicName,
						doctors: doctors,
						professions: professions
					}
					
					res.render('view-doctors', results)
				})
			})
		}
		else {
			res.redirect('/')
		}
  	}
}

module.exports = homeController