const db = require('../models/db.js');
const Clinic = require('../models/clinicModel.js');
const Doctor = require('../models/doctorModel.js')
const User = require('../models/userModel.js')
const Appointment = require('../models/appointmentModel.js')
const Availability = require('../models/availabilityModel.js')
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
			res.redirect('/error')
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
			res.redirect('/error')
		}
		else {
			res.redirect('/')
		}
    },

	getClinicHours: function(req, res) {
		var query = {
			clinicID: req.query.clinicID,
			doctorID: '5fb59a0731422020ec5fb2e1'		// replace with logged in doctorID
		}
		db.findMany(Availability, query, '', function(results){
			var r = []
			for (i=0; i < results.length; i++) {
				r.push({
					day: results[i].day,
					start: results[i].startTime.getHours(),
					end: results[i].endTime.getHours(),
					interval: results[i].intervalHours
				})
			}
			
			res.send(r);
		})
	},
	
	setAvailability: function(req, res) {
		var avail = req.body.avail;

		for (i=0; i < avail.length; i++) {
			avail[i].doctorID = '5fb59a0731422020ec5fb2e1'		// replace with logged in doctorID
			avail[i].startTime = new Date(0, 0, 0, parseInt(avail[i].startTime), 0, 0, 0)
			avail[i].endTime = new Date(0, 0, 0, parseInt(avail[i].endTime), 0, 0, 0)

			db.upsertOne(Availability, {doctorID: avail[i].doctorID, clinicID: avail[i].clinicID,
				day: avail[i].day}, avail[i])
		}
	}
}

module.exports = doctorController