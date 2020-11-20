const db = require('../models/db.js');
const Clinic = require('../models/clinicModel.js');
const Doctor = require('../models/doctorModel.js')
const User = require('../models/userModel.js')
const Appointment = require('../models/appointmentModel.js')
const helper = require('../helpers/helper');

const appointmentController = {
	upcomingAppointments: function(req,res) {
		// var userId = req.session.id

		// temp user
		var userId = '5fb59a0731422020ec5fb2e2'

		var doctorIds = []
		var apts = []
		
		db.findOne(User, {_id: userId}, null, function(user) {
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
		})
    },
    
	pendingAppointments: function(req,res) {
		// temp user
		var userId = '5fb59a0731422020ec5fb2e2'

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
		// temp user
		var userId = '5fb59a0731422020ec5fb2e2'

		var doctorIds = []
		var apts = []
		
		db.findOne(User, {_id: userId}, null, function(user) {
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
		})
		// res.render('appointments-concluded')
    },
    
	cancelledAppointments: function(req,res) {
		// temp user
		var userId = '5fb59a0731422020ec5fb2e2'

		var doctorIds = []
		var apts = []
		
		db.findOne(User, {_id: userId}, null, function(user) {
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
		})
		// res.render('appointments-cancelled')
    },

    bookAppointment: function(req,res) {
        res.render('book-appointment')
    }
}

module.exports = appointmentController