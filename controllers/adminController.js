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
		db.findMany(Doctor, {status: "Verified"}, null, function(doctors) {
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
		db.findMany(Doctor, {status: "Pending"}, null, function(doctors) {
			// temp since di pa na update yung user model
			var user = {
				firstname: "John",
				lastname: "Doe"
			}
			var results = {
				user: user,
				doctors: doctors
			}
			if(results != null) {
				res.render('admin-pending', results)
			}
		})
	},

	addClinic: function(req,res) {
		db.insertOne(Clinic, req.body.newclinic, function(result){
			console.log(result);
			res.send(result);
		})
	},

	deleteClinic: function(req, res) {
		console.log(req.body)
		db.deleteOne(Clinic, {_id: req.body.id})
		res.send(true)
	}
}

module.exports = adminController