const db = require('../models/db.js');
const Clinic = require('../models/clinicModel.js');
const Doctor = require('../models/doctorModel.js')
const User = require('../models/userModel.js')
const Appointment = require('../models/appointmentModel.js')
const Availability = require('../models/availabilityModel.js')
const helper = require('../helpers/helper');

const appointmentController = {
	upcomingAppointments: function(req,res) {
		var userId = req.session.userId

		var doctorIds = []
		var patientIds = []
		var apts = []
		
		var professions = Doctor.schema.path('profession').enumValues

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

						var result = {
							appointments: apts,
							user: user,
							professions: professions
						}

						res.render('appointments-upcoming', result)
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
		var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

		var date = new Date();
		var day = date.getDay();
		days = days.slice(0);

		/*	for month/date header */
		var sun = new Date()
		sun.setDate(sun.getDate() - day)

		var dates = []

		for (i=0; i<7; i++) {
			if (i == day) {
				dates.push({date: sun.getDate() + i, day: days[i], class: 'active'})
			} else {
				dates.push({date: sun.getDate() + i, day: days[i], class: ''})
			}
		}

		/* for timeslots */

		var q = {
			doctorID: req.query.id,
			clinicID: req.query.c,
			day: days[day]
		}
		
		var times = [];

		db.findOne(Availability, q, "day startTime endTime intervalHours", function(results) {
			if (results) {
				var s = results.startTime
				var e = results.endTime
				var int = results.intervalHours
				var ampm = " AM"

				while ( +s <= +e ) {
					var h = s.getHours() % 12
					var m = s.getMinutes();

					if (s.getHours() >= 12)
						ampm = " PM"
					if (h == 0)
						h = 12

					h = h.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
					m = m.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})

					times.push({time: h + ":" + m + ampm})
					s.setMinutes(s.getMinutes() + (int * 60))
				}
			}

			db.findOne(Doctor, {_id: req.query.id}, null, function(doctor) {
				res.render('book-appointment', {doctor: doctor, clinic: q.clinicID, month: months[date.getMonth()], dates: dates, slots: times})
			})
		})
	},
	
	getSlots: function(req,res) {
		db.findOne(Availability, req.query, "day startTime endTime intervalHours", function(results) {
			var times = [];

			if (results) {
				var s = results.startTime
				var e = results.endTime
				var int = results.intervalHours
				var ampm = " AM"

				while ( +s <= +e ) {
					var h = s.getHours() % 12
					var m = s.getMinutes();

					if (s.getHours() >= 12)
						ampm = " PM"
					if (h == 0)
						h = 12

					h = h.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
					m = m.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})

					times.push(h + ":" + m + ampm)
					s.setMinutes(s.getMinutes() + (int * 60))
				}
			}

			res.send(times)
		})
	}
}

module.exports = appointmentController