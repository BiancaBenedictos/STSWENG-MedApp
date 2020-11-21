const db = require('../models/db.js');
const Clinic = require('../models/clinicModel.js');
const Doctor = require('../models/doctorModel.js')
const User = require('../models/userModel.js')
const Appointment = require('../models/appointmentModel.js')
const helper = require('../helpers/helper');

const appointmentController = {
	upcomingAppointments: function(req,res) {
		var userId = req.session.userId

		var doctorIds = []
		var patientIds = []
		var apts = []
		
		db.findOne(User, {_id: userId}, null, function(user) {
			if(user) {
				db.findMany(Appointment, {_id: user.bookedAppointments, status: 'Upcoming'}, null, function(appointments) {
	
					for(var i = 0; i < appointments.length; i++) {
						doctorIds.push(appointments[i].bookedDoctor)
					}
					
					Doctor.find({ "_id": { "$in": doctorIds } }).then(doctors =>
						doctorIds.map(e => doctors.find(s => s._id.equals(e)))
					).then(doctors => {
						for(var j = 0; j < doctors.length; j++) {
							var details = {
								doctor: doctors[j].firstname + " " + doctors[j].lastname,
								date: helper.formatDate(appointments[j].bookedDate),
								time: helper.getTime(appointments[j].bookedDate)
							}
							apts.push(details)
						}
						res.render('appointments-upcoming', {appointments: apts, user: user})
					})
				})
			}
			else {
				db.findOne(Doctor, {_id: userId}, null, function(doctor) {
					db.findMany(Appointment, {_id: doctor.bookedAppointments, status: 'Upcoming'}, null, function(appointments) {

						for(var i = 0; i < appointments.length; i++) {
							patientIds.push(appointments[i].patient)
						}
						
						User.find({ "_id": { "$in": patientIds } }).then(patients =>
							patientIds.map(e => patients.find(s => s._id.equals(e)))
						).then(patients => {
							for(var j = 0; j < patients.length; j++) {
								var details = {
									doctor: patients[j].firstname + " " + patients[j].lastname,
									date: helper.formatDate(appointments[j].bookedDate),
									time: helper.getTime(appointments[j].bookedDate)
								}
								apts.push(details)
							}
							res.render('appointments-upcoming', {appointments: apts, user: doctor})
						})
					})
				})
			}
		})
    },
    
	pendingAppointments: function(req,res) {
		var userId = req.session.userId

		var doctorIds = []
		var apts = []
		
		db.findOne(User, {_id: userId}, null, function(user) {
			db.findMany(Appointment, {_id: user.bookedAppointments, status: 'Pending'}, null, function(appointments) {

				for(var i = 0; i < appointments.length; i++) {
					doctorIds.push(appointments[i].bookedDoctor)
				}
				
				Doctor.find({ "_id": { "$in": doctorIds } }).then(doctors =>
					doctorIds.map(e => doctors.find(s => s._id.equals(e)))
				).then(doctors => {
					for(var j = 0; j < doctors.length; j++) {
						var details = {
							doctor: doctors[j].firstname + " " + doctors[j].lastname,
							date: helper.formatDate(appointments[j].bookedDate),
							time: helper.getTime(appointments[j].bookedDate)
						}
						apts.push(details)
					}
					res.render('appointments-pending', {appointments: apts, user: user})
				})
			})
		})
    },
    
	concludedAppointments: function(req,res) {
		var userId = req.session.userId

		var doctorIds = []
		var patientIds = []
		var apts = []
		
		db.findOne(User, {_id: userId}, null, function(user) {
			if(user) {
				db.findMany(Appointment, {_id: user.bookedAppointments, status: 'Concluded'}, null, function(appointments) {
	
					for(var i = 0; i < appointments.length; i++) {
						doctorIds.push(appointments[i].bookedDoctor)
					}
					
					Doctor.find({ "_id": { "$in": doctorIds } }).then(doctors =>
						doctorIds.map(e => doctors.find(s => s._id.equals(e)))
					).then(doctors => {
						for(var j = 0; j < doctors.length; j++) {
							var details = {
								doctor: doctors[j].firstname + " " + doctors[j].lastname,
								date: helper.formatDate(appointments[j].bookedDate),
								time: helper.getTime(appointments[j].bookedDate)
							}
							apts.push(details)
						}
						res.render('appointments-concluded', {appointments: apts, user: user})
					})
				})
			}
			else {
				db.findOne(Doctor, {_id: userId}, null, function(doctor) {
					db.findMany(Appointment, {_id: doctor.bookedAppointments, status: 'Concluded'}, null, function(appointments) {

						for(var i = 0; i < appointments.length; i++) {
							patientIds.push(appointments[i].patient)
						}
						
						User.find({ "_id": { "$in": patientIds } }).then(patients =>
							patientIds.map(e => patients.find(s => s._id.equals(e)))
						).then(patients => {
							for(var j = 0; j < patients.length; j++) {
								var details = {
									doctor: patients[j].firstname + " " + patients[j].lastname,
									date: helper.formatDate(appointments[j].bookedDate),
									time: helper.getTime(appointments[j].bookedDate)
								}
								apts.push(details)
							}
							res.render('appointments-concluded', {appointments: apts, user: doctor})
						})
					})
				})
			}
		})
    },
    
	cancelledAppointments: function(req,res) {
		var userId = req.session.userId

		var doctorIds = []
		var patientIds = []
		var apts = []
		
		db.findOne(User, {_id: userId}, null, function(user) {
			if(user) {
				db.findMany(Appointment, {_id: user.bookedAppointments, status: 'Cancelled'}, null, function(appointments) {
	
					for(var i = 0; i < appointments.length; i++) {
						doctorIds.push(appointments[i].bookedDoctor)
					}
					
					Doctor.find({ "_id": { "$in": doctorIds } }).then(doctors =>
						doctorIds.map(e => doctors.find(s => s._id.equals(e)))
					).then(doctors => {
						for(var j = 0; j < doctors.length; j++) {
							var details = {
								doctor: doctors[j].firstname + " " + doctors[j].lastname,
								date: helper.formatDate(appointments[j].bookedDate),
								time: helper.getTime(appointments[j].bookedDate)
							}
							apts.push(details)
						}
						res.render('appointments-cancelled', {appointments: apts, user: user})
					})
				})
			}
			else {
				db.findOne(Doctor, {_id: userId}, null, function(doctor) {
					db.findMany(Appointment, {_id: doctor.bookedAppointments, status: 'Cancelled'}, null, function(appointments) {

						for(var i = 0; i < appointments.length; i++) {
							patientIds.push(appointments[i].patient)
						}
						
						User.find({ "_id": { "$in": patientIds } }).then(patients =>
							patientIds.map(e => patients.find(s => s._id.equals(e)))
						).then(patients => {
							for(var j = 0; j < patients.length; j++) {
								var details = {
									doctor: patients[j].firstname + " " + patients[j].lastname,
									date: helper.formatDate(appointments[j].bookedDate),
									time: helper.getTime(appointments[j].bookedDate)
								}
								apts.push(details)
							}
							res.render('appointments-cancelled', {appointments: apts, user: doctor})
						})
					})
				})
			}
		})
    },

    bookAppointment: function(req,res) {
		var id = req.query.id
		
		db.findOne(Doctor, {_id: id}, null, function(doctor) {
			res.render('book-appointment', {doctor: doctor})
		})
    }
}

module.exports = appointmentController