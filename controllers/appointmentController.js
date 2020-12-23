const db = require('../models/db.js');
const Clinic = require('../models/clinicModel.js');
const Doctor = require('../models/doctorModel.js')
const User = require('../models/userModel.js')
const Appointment = require('../models/appointmentModel.js')
const Availability = require('../models/availabilityModel.js')
const helper = require('../helpers/helper');
const { now } = require('moment');

const appointmentController = {
	upcomingAppointments: function(req,res) {
		var userId = req.session.userId
		var apts = []
		var currentDate = new Date().toString()

		if(req.session.email) {
			db.findOne(User, {_id: userId}, null, function(user) {
				if(user) {
					db.updateMany(Appointment, {patient: user._id, status: 'Upcoming', bookedDate: {$lte: currentDate}}, {status: 'Concluded'})

					Appointment.find({patient: user._id, status: 'Upcoming', bookedDate: {$gte: currentDate}}).sort({bookedDate: 1}).exec(function(err,appointments) {
					
						for(var i = 0; i < appointments.length; i++) {
							var details = {
								_id: appointments[i]._id,
								user: appointments[i].doctorName,
								date: helper.getDate(appointments[i].bookedDate),
								time: helper.getTime(appointments[i].bookedDate),
								profpic: appointments[i].doctorPic
							}
							apts.push(details)
						}
						res.render('appointments-upcoming', {appointments: apts, user: user})
					})
				}
				else {
					db.findOne(Doctor, {_id: userId}, null, function(doctor) {
						db.updateMany(Appointment, {bookedDoctor: doctor._id, status: 'Upcoming', bookedDate: {$lte: currentDate}}, {status: 'Concluded'})

						Appointment.find({bookedDoctor: doctor._id, status: 'Upcoming', bookedDate: {$gte: currentDate}}).sort({bookedDate: 1}).exec(function(err,appointments) {
							for(var i = 0; i < appointments.length; i++) {
								var details = {
									_id: appointments[i]._id,
									user: appointments[i].patientName,
									date: helper.getDate(appointments[i].bookedDate),
									time: helper.getTime(appointments[i].bookedDate),
									profpic: appointments[i].patientPic
								}
								apts.push(details)
							}
							res.render('appointments-upcoming', {appointments: apts, user: doctor})
						})
					})
				}
			})
		}
		else if(req.session.type == 'admin') {
			res.redirect('/error')
		}
		else {
			res.redirect('/')
		}
    },
    
	pendingAppointments: function(req,res) {
		var userId = req.session.userId
		var apts = []
		var currentDate = new Date().toString()

		if(req.session.email) {
			db.findOne(User, {_id: userId}, null, function(user) {
				if(user) {
					db.updateMany(Appointment, {patient: user._id, status: 'Pending', bookedDate: {$lte: currentDate}}, {status: 'Concluded'})

					Appointment.find({patient: user._id, status: 'Pending', bookedDate: {$gte: currentDate}}).sort({bookedDate: 1}).exec(function(err,appointments) {
					
						for(var i = 0; i < appointments.length; i++) {
							var details = {
								_id: appointments[i]._id,
								user: appointments[i].doctorName,
								date: helper.getDate(appointments[i].bookedDate),
								time: helper.getTime(appointments[i].bookedDate),
								profpic: appointments[i].doctorPic
							}
							apts.push(details)
						}
						res.render('appointments-pending', {appointments: apts, user: user})
					})
				}
				else {
					db.findOne(Doctor, {_id: userId}, null, function(doctor) {
						db.updateMany(Appointment, {bookedDoctor: doctor._id, status: 'Pending', bookedDate: {$lte: currentDate}}, {status: 'Concluded'})

						Appointment.find({bookedDoctor: doctor._id, status: 'Pending', bookedDate: {$gte: currentDate}}).sort({bookedDate: 1}).exec(function(err,appointments) {
							for(var i = 0; i < appointments.length; i++) {
								var details = {
									_id: appointments[i]._id,
									user: appointments[i].patientName,
									date: helper.getDate(appointments[i].bookedDate),
									time: helper.getTime(appointments[i].bookedDate),
									profpic: appointments[i].patientPic
								}
								apts.push(details)
							}
							res.render('doctor-appointments-pending', {appointments: apts, user: doctor})
						})
					})
				}
			})
		}
		else if(req.session.type == 'admin') {
			res.redirect('/error')
		}
		else {
			res.redirect('/')
		}
    },
	
	acceptAppointment: function(req, res) {
		
		var appointmentId = req.body.id

		db.findOne(Appointment, {_id:appointmentId}, null, function(result) {
			db.updateOne(
				Appointment,
				{ _id: appointmentId },
				{ status: 'Upcoming' },
				function (result) {
					// res.redirect('/upcomingAppointments');
				},
			);
		
			db.updateOne(Doctor, {_id:result.bookedDoctor}, {$push: {bookedAppointments:appointmentId}}, function(flag){})
			db.updateOne(User, {_id:result.patient}, {$push: {bookedAppointments:appointmentId}}, function(flag){})
			
			res.redirect('/upcomingAppointments')
		})
	},

	concludedAppointments: function(req,res) {
		var userId = req.session.userId
		var apts = []

		if(req.session.email) {
			db.findOne(User, {_id: userId}, null, function(user) {
				if(user) {
					db.findMany(Appointment, {patient: user._id, status: 'Concluded'}, null, function(appointments) {
						for(var i = 0; i < appointments.length; i++) {
							var details = {
								user: appointments[i].doctorName,
								date: helper.getDate(appointments[i].bookedDate),
								time: helper.getTime(appointments[i].bookedDate),
								profpic: appointments[i].doctorPic
							}
							apts.push(details)
						}
						res.render('appointments-concluded', {appointments: apts, user: user})
					})
				}
				else {
					db.findOne(Doctor, {_id: userId}, null, function(doctor) {
						db.findMany(Appointment, {bookedDoctor: doctor._id, status: 'Concluded'}, null, function(appointments) {
							for(var i = 0; i < appointments.length; i++) {
								var details = {
									user: appointments[i].patientName,
									date: helper.getDate(appointments[i].bookedDate),
									time: helper.getTime(appointments[i].bookedDate),
									profpic: appointments[i].patientPic
								}
								apts.push(details)
							}
							res.render('appointments-concluded', {appointments: apts, user: doctor})
						})
					})
				}
			})
		}
		else if(req.session.type == 'admin') {
			res.redirect('/error')
		}
		else {
			res.redirect('/')
		}
    },
    
	cancelledAppointments: function(req,res) {
		var userId = req.session.userId
		var apts = []

		if(req.session.email) {
			db.findOne(User, {_id: userId}, null, function(user) {
				if(user) {
					db.findMany(Appointment, {patient: user._id, status: 'Cancelled'}, null, function(appointments) {
						for(var i = 0; i < appointments.length; i++) {
							var details = {
								user: appointments[i].doctorName,
								date: helper.getDate(appointments[i].bookedDate),
								time: helper.getTime(appointments[i].bookedDate),
								profpic: appointments[i].doctorPic
							}
							apts.push(details)
						}
						res.render('appointments-cancelled', {appointments: apts, user: user})
					})
				}
				else {
					db.findOne(Doctor, {_id: userId}, null, function(doctor) {
						db.findMany(Appointment, {bookedDoctor: doctor._id, status: 'Cancelled'}, null, function(appointments) {
							for(var i = 0; i < appointments.length; i++) {
								var details = {
									user: appointments[i].patientName,
									date: helper.getDate(appointments[i].bookedDate),
									time: helper.getTime(appointments[i].bookedDate),
									profpic: appointments[i].patientPic
								}
								apts.push(details)
							}
							res.render('appointments-cancelled', {appointments: apts, user: doctor})
						})
					})
				}
			})
		}
		else if(req.session.type == 'admin') {
			res.redirect('/error')
		}
		else {
			res.redirect('/')
		}
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
				disabled = true;
				addClass = 'active'
			}

			dates.push({date: startWeek.getDate(), fulldate: str, day: days[i], class: addClass})
			startWeek.setDate(startWeek.getDate() + 1)
		}

		if (!active && !disabled) 
			dates[0].class = "active"

		/* for timeslots */

		var q = {
			doctorID: req.query.id,
			clinicID: req.query.c,
			day: days[day]
		}
		
		var times = [];
		if (disabled)
			disabled = "disabled"
			
		if(req.session.type == 'user') {
			db.findOne(Doctor, {_id: req.query.id}, null, function(doctor) {
				res.render('book-appointment', {doctor: doctor, clinic: q.clinicID, month: months[month], year: year, dates: dates, disabled: disabled})
			})
		}
		else if(req.session.email) {
			res.redirect('/error')
		}
		else {
			res.redirect('/')
		}
	},
	
	getSlots: function(req,res) {
		db.findOne(Availability, req.query.q, "day startTime endTime intervalHours", function(results) {
			var times = []
			var today = new Date(), slotDate = new Date(req.query.full)

			if (results) {
				var s = results.startTime
				var e = results.endTime
				var int = results.intervalHours
				var ampm = " AM"
				var disabled, dHour = 0, dMin = 0

				if (today > slotDate) {
					dHour = today.getHours()
					dMin = today.getMinutes()
				}

				while ( +s <= +e ) {
					var h = s.getHours() % 12
					var h2 = s.getHours()
					var m = s.getMinutes();

					if (s.getHours() >= 12)
						ampm = " PM"
					if (h == 0)
						h = 12

					if (dHour > h2 && dMin > m)
						disabled = 'disabled'
					else disabled = ''

					h = h.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
					h2 = h2.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
					m = m.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})

					times.push({H12: h + ":" + m + ampm, H24: h2 + ":" + m + ":00", class: disabled})
					s.setMinutes(s.getMinutes() + (int * 60))
				}
			}

			res.send(times)
		})
	},

	disableSlots: function(req, res) {
		var doctorID = req.query.doctorID, clinicID = req.query.clinicID
		var start = new Date(req.query.date)

		start.setHours(0);
		start.setMinutes(0);
		start.setSeconds(0);
		start.setMilliseconds(0);

		var end = new Date(start.valueOf())
		end.setDate(start.getDate() + 1)
		
		var bookedTimes = [], h, m;

		Appointment.find({bookedDate: {$gte:start, $lt:end}, bookedDoctor: doctorID, status: "Upcoming"}, "bookedDate", function(err, res2) {
			if (!err) {
				for (i=0; i<res2.length; i++) {
					h = res2[i].bookedDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
					m = res2[i].bookedDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
					bookedTimes.push(h + ":" + m + ":00")
				}
			}

			res.send(bookedTimes)
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
					console.log(req.body)
					var a = {
						bookedDoctor: req.body.doctor,
						doctorName: req.body.doctorName,
						doctorPic: req.body.doctorPic,
						patient: req.session.userId,
						patientName: req.session.name,
						patientPic: req.session.profpic,
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
	},

	cancelAppointment: function(req, res) {
		console.log(req.body)

		// db.deleteOne(Appointment, {_id: req.body.id})

		// db.deleteOne(Clinic, {_id: req.body.id})
		// res.send(true)
	}
}

module.exports = appointmentController