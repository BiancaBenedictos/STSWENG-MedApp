const db = require('../models/db.js');
const Clinic = require('../models/clinicModel.js');
const Doctor = require('../models/doctorModel.js')
const User = require('../models/userModel.js')
const Appointment = require('../models/appointmentModel.js')
const helper = require('../helpers/helper');

const doctorController = {
	doctorProfile: function(req, res) {
		var userId = req.query.id

		if(req.session.email) {
			db.findOne(Doctor, {_id: userId}, null, function(doctor) {
				db.findMany(Clinic, {_id: {$in: doctor.clinics}}, null, function(clinics) {
					clinics.doctorId = userId
	
					var details = {
						doctor: doctor,
						clinics: clinics
					}
					
					res.render('doctor-profile', details)
				})
			})
		}
		else {
			res.redirect('/')
		}
	},

	pendingAppointments: function(req, res) {
		var userId = req.session.userId

		var patientIds = []
		var apts = []

		if(req.session.type == 'doctor') {
			db.findOne(Doctor, {_id: userId}, null, function(doctor) {
				db.findMany(Appointment, {bookedDoctor: userId, status: 'Pending'}, null, function(appointments) {
					
					for(var i = 0; i < appointments.length; i++) {
						patientIds.push(appointments[i].patient)
					}
					
					User.find({ "_id": { "$in": patientIds } }).then(patients =>
						patientIds.map(e => patients.find(s => s._id.equals(e)))
					).then(patients => {
						for(var j = 0; j < patients.length; j++) {
							var details = {
								patient: patients[j].firstname + " " + patients[j].lastname,
								date: helper.formatDate(appointments[j].bookedDate),
								time: helper.getTime(appointments[j].bookedDate)
							}
							apts.push(details)
						}
						res.render('doctor-appointments-pending', {appointments: apts, doctor: doctor})
					})
				})
			})
		}
		else if(req.session.email) {
			res.redirect('/homeDoctors')
		}
		else {
			res.redirect('/')
		}
    },
    
	createAppointments: function(req, res) {
		var userId = req.session.userId
		
		if(req.session.type == 'doctor') {
			db.findOne(Doctor, {_id: userId}, null, function(doctor) {
				db.findMany(Clinic, {_id: {$in: doctor.clinics}}, null, function(clinics) {
					var details = {
						doctor: doctor,
						clinics: clinics
					}
					res.render('create-appointments', details)
				})
			})
		}
		else if(req.session.type == 'user' || req.session.type == 'admin') {
			res.redirect('homeDoctors')
		}
		else {
			res.redirect('/')
		}
    }
}

module.exports = doctorController