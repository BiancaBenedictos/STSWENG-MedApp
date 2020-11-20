const db = require('../models/db.js');
const Clinic = require('../models/clinicModel.js');

const userController = {
	login: function(req,res){
		res.render('login')
	},
    
	register: function(req,res){
		db.findMany(Clinic, {}, null, function(clinics) {
			res.render('register', {clinics: clinics})
		})
	}
}

module.exports = userController