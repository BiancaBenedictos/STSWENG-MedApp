const db = require('../models/db.js');
const Clinic = require('../models/clinicModel.js');
const Doctor = require('../models/doctorModel.js')

const userController = {
	login: function(req,res){
		res.render('login')
	},
    
	register: function(req,res){
		db.findMany(Clinic, {}, null, function(clinics) {
			var professions = Doctor.schema.path('profession').enumValues
			res.render('register', {clinics: clinics, professions: professions})
		})
	}
}

module.exports = userController