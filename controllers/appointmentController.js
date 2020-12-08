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
		var days = ['startWeekday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

		var today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		today.setMilliseconds(0);

		/*	for month/date header */
		var startWeek;

		if (req.query.date != null)
			startWeek = new Date(req.query.date)
		else {
			startWeek = new Date()
			startWeek.setHours(0);
			startWeek.setMinutes(0);
			startWeek.setSeconds(0);
			startWeek.setMilliseconds(0);
		}

		startWeek.setDate(startWeek.getDate() - startWeek.getDay())

		if (req.query.type == "next")
			startWeek.setDate(startWeek.getDate() + 7)
		else if (req.query.type == "prev")
			startWeek.setDate(startWeek.getDate() - 7)
			
		var month = startWeek.getMonth()
		var year = startWeek.getFullYear();
		var day = startWeek.getDay();
		days = days.slice(0);

		var dates = []
		var str, active, addClass, disabled = false;

		for (i=0; i<7; i++) {
			str = months[startWeek.getMonth()] + " " + startWeek.getDate() + ", " + startWeek.getFullYear()

			if (startWeek > today) {
				addClass = ''
			} else if (startWeek < today) {
				addClass = 'disabled'
				disabled = true
			} else {
				active = true;
				addClass = 'active'
			}

			dates.push({date: startWeek.getDate(), fulldate: str, day: days[i], class: addClass})
			startWeek.setDate(startWeek.getDate() + 1)
		}

		if (!active && !disabled) 
			dates[0].class = "active"

		console.log(dates)
		/* for timeslots */

		var q = {
			doctorID: req.query.id,
			clinicID: req.query.c,
			day: days[day]
		}
		
		var times = [];
		if (disabled)
			disabled = "disabled"
		db.findOne(Doctor, {_id: req.query.id}, null, function(doctor) {
			res.render('book-appointment', {doctor: doctor, clinic: q.clinicID, month: months[month], year: year, dates: dates, disabled: disabled})
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
					var h2 = s.getHours()
					var m = s.getMinutes();

					if (s.getHours() >= 12)
						ampm = " PM"
					if (h == 0)
						h = 12

					h = h.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
					h2 = h2.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
					m = m.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})

					times.push({H12: h + ":" + m + ampm, H24: h2 + ":" + m + ":00"})
					s.setMinutes(s.getMinutes() + (int * 60))
				}
			}

			res.send(times)
		})
	},

	requestAppointment: function(req, res) {
		var bookTime = new Date(req.body.fulldate + " " + req.body.time)
		var today = new Date();

		if (+bookTime <= +today) {
			res.send(false)
		} else {
			db.findOne(Appointment, {bookedDate: bookTime}, "", function(conflict){
				if (conflict && conflict.status == "Upcoming")
					res.send(false);
				else {
					var a = {
						bookedDoctor: req.body.doctor,
						patient: req.session.id,
						bookedDate: bookTime, 
						status: "Pending"
					}
					
					db.insertOne(Appointment, a, function(result) {
						if (result)
							res.send(true);
						else res.send(false)
					})
				}
			})
		}
	}
}

module.exports = appointmentController