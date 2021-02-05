const db = require('../models/db.js');
const Clinic = require('../models/clinicModel.js');
const Doctor = require('../models/doctorModel.js')

const adminController = {
	clinics: function(req,res) {
		if(req.session.type == 'admin') {
			db.findMany(Clinic, {}, null, function(results) {
				if(results != null) {
					res.render('admin-clinics', {clinics: results})
				}
			})
		}
		else if(req.session.email) {
			res.redirect('/error')
		}
		else {
			res.redirect('/')
		}
    },
    
	doctors: function(req,res) {
		if(req.session.type == 'admin') {
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
		}
		else if(req.session.email) {
			res.redirect('/error')
		}
		else {
			res.redirect('/')
		}
    },
    
	pending: function(req,res) {
		if(req.session.type == 'admin') {
			db.findMany(Doctor, {status: "unverified"}, null, function(doctors) {
				var user = req.session
				var results = {
					user: user,
					doctors: doctors
				}
				res.render('admin-pending', results)
			})
		}
		else if(req.session.email) {
			res.redirect('/error')
		}
		else {
			res.redirect('/')
		}
	},

	acceptDoctor: function(req,res) {
		if(req.session.type == 'admin') {
			db.updateOne(Doctor, {_id: req.body.id}, {status: 'verified'}, function(flag) {})
			db.updateMany(Clinic, {_id: {$in: req.body.clinics}}, {$push: {clinicDoctors: req.body.id}})
			res.send(true)
		}
		else if(req.session.email) {
			res.redirect('/error')
		}
		else {
			res.redirect('/')
		}
	},

	rejectDoctor: function(req,res) {
		if(req.session.type == 'admin') {
			db.deleteOne(Doctor, {_id: req.body.id})
			res.send(true)
		}
		else if(req.session.email) {
			res.redirect('/error')
		}
		else {
			res.redirect('/')
		}
	},

	addClinic: function(req,res) {
		db.insertOne(Clinic, req.body.newclinic, function(result){
			res.send(result);
		})
	},

	deleteClinic: function(req, res) {
		db.deleteOne(Clinic, {_id: req.body.id})
		res.send(true)
	}
}

module.exports = adminController