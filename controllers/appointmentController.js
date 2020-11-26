const db = require('../models/db.js');
const Clinic = require('../models/clinicModel.js');
const Doctor = require('../models/doctorModel.js')
const User = require('../models/userModel.js')
const Appointment = require('../models/appointmentModel.js')
const Availability = require('../models/availabilityModel.js')
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
    },

    bookAppointment: function(req,res) {
		var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

		var doctor = req.query.id
		var clinic = req.query.c;
		var date = new Date();
		var day = date.getDay();
		days = days.slice(0);
		console.log(days)

		console.log(date)
		console.log(day)
		console.log(req.query)

		var q = {
			doctorID: doctor,
			clinicID: clinic,
			day: {'$in': days}
		}

		db.findMany(Availability, q, "day startTime endTime intervalHours", function(results) {
			var sun = new Date()
			var sat = new Date()

			sun.setDate(sun.getDate() - day)

			var dates = []

			for (i=0; i<7; i++) {
				if (i == day) {
					dates.push({date: sun.getDate() + i, day: days[i], class: 'active'})
				} else {
					dates.push({date: sun.getDate() + i, day: days[i], class: ''})
				}
			}


			

			var availabilities = [];

			for (i=0; i < results.length; i++) {
				var s = results[i].startTime
				var e = results[i].endTime
				var int = results[i].intervalHours
				var times = [];

				while ( +s <= +e ) {
					times.push(s.getHours() + ":" + s.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}))
					s.setMinutes(s.getMinutes() + (int * 60))
				}

				availabilities.push({
					day: days[i],
					avail: times
				})
			}

			db.findOne(Doctor, {_id: doctor}, null, function(doctor) {
				res.render('book-appointment', {doctor: doctor, month: months[date.getMonth()], dates: dates, avail: availabilities})
			})
		})
    }
}

module.exports = appointmentController