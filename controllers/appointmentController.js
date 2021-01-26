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
								profpic: appointments[i].doctorPic,
								// patient: appointments[i].patient,
								// doctor: appointments[i].bookedDoctor
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
									profpic: appointments[i].patientPic,
									// patient: appointments[i].patient,
									// doctor: appointments[i].bookedDoctor
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
								profpic: appointments[i].doctorPic,
								// patient: appointments[i].patient,
								// doctor: appointments[i].bookedDoctor
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
									profpic: appointments[i].patientPic,
									// patient: appointments[i].patient,
									// doctor: appointments[i].bookedDoctor
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
				function (res) {
					// res.redirect('/upcomingAppointments');
				},
			);
		
			db.updateOne(Doctor, {_id:result.bookedDoctor}, {$push: {bookedAppointments:appointmentId}}, function(flag){})
			db.updateOne(User, {_id:result.patient}, {$push: {bookedAppointments:appointmentId}}, function(flag){})
			
			res.redirect('/upcomingAppointments')
		})
	},

	rejectAppointment: function(req, res) {
		var appointmentId = req.body.id
		console.log(appointmentId)
		db.findOne(Appointment, {_id:appointmentId}, null, function(result) {
			db.updateOne(
				Appointment,
				{ _id: appointmentId },
				{ status: 'Cancelled' },
				function (result) {
					// res.redirect('/upcomingAppointments');
				},
			);
		
			db.updateOne(Doctor, {_id:result.bookedDoctor}, {$push: {bookedAppointments:appointmentId}}, function(flag){})
			db.updateOne(User, {_id:result.patient}, {$push: {bookedAppointments:appointmentId}}, function(flag){})
			
			res.redirect('/cancelledAppointments');
		})
	},

	concludedAppointments: function(req,res) {
		var userId = req.session.userId
		var apts = []

		if(req.session.email) {
			db.findOne(User, {_id: userId}, null, function(user) {
				if(user) {
					Appointment.find({patient: user._id, status: 'Concluded'}).sort({bookedDate: 1}).exec(function(err,appointments) {
					
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
						res.render('appointments-concluded', {appointments: apts, user: user})
					})
				}
				else {
					db.findOne(Doctor, {_id: userId}, null, function(doctor) {
						Appointment.find({bookedDoctor: doctor._id, status: 'Concluded'}).sort({bookedDate: 1}).exec(function(err,appointments) {
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
					Appointment.find({patient: user._id, status: 'Cancelled'}).sort({bookedDate: 1}).exec(function(err,appointments) {
					
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
						res.render('appointments-cancelled', {appointments: apts, user: user})
					})
				}
				else {
					db.findOne(Doctor, {_id: userId}, null, function(doctor) {
						Appointment.find({bookedDoctor: doctor._id, status: 'Cancelled'}).sort({bookedDate: 1}).exec(function(err,appointments) {
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

		for (var i=0; i<7; i++) {
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
				var h, h2, m;

				for (var dt=new Date(s); dt<=e; dt.setMinutes(dt.getMinutes()+(int*60))) {
					h = (dt.getHours() % 12).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
					h2 = (dt.getHours()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
					m = (dt.getMinutes()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
	
					times.push({H12: h + ":" + m + ampm, H24: h2 + ":" + m + ":00"})
				}
			}

			res.send(times)
		})
	},

	disableSlots: function(req, res) {
		var doctorID = req.query.doctorID//, clinicID = req.query.clinicID
		var start = new Date(req.query.date)

		start.setHours(0);
		start.setMinutes(0);
		start.setSeconds(0);
		start.setMilliseconds(0);

		var end = new Date(start.valueOf())
		end.setDate(start.getDate() + 1)

		var today = new Date();
		
		var bookedTimes = [], h, m;

		Appointment.find({bookedDate: {$gte:start, $lt:end}, bookedDoctor: doctorID, status: "Upcoming"}, "bookedDate", function(err, res2) {
			if (!err) {
				for (var i=0; i<res2.length; i++) {
					h = res2[i].bookedDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
					m = res2[i].bookedDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
					bookedTimes.push(h + ":" + m + ":00")
				}
			}

			var tH = today.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}), 
				tM = today.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
			res.send({booked: bookedTimes, currH: tH, currM: tM})
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
					// console.log(req.body)

					// console.log(req.session);
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

					//for testing (comment this block of code when running node server) and uncomment the commented block above 
					/*var a = {
						bookedDoctor: req.body.doctor,
						doctorName: req.body.doctorName,
						doctorPic: req.body.doctorPic,
						patient: req.body.userId,
						patientName: req.body.name,
						patientPic: req.body.profpic,
						bookedDate: bookTime, 
						status: "Pending"
					}*/
					
					// console.log(a);

					db.insertOne(Appointment, a, function(result) {
						// console.log(result);
						if (result)
							res.send(true);
						else res.send(false)
					})
				}
			})
		}
	},

	cancelAppointment: function(req, res) {
		db.updateOne(Appointment, {_id: req.body.id}, {status: 'Cancelled'}, function(flag){})
		// db.updateOne(User, {_id: req.body.patient}, {$pullAll: {bookedAppointments: [req.body.id]}}, function(flag){})
		// db.updateOne(Doctor, {_id: req.body.doctor}, {$pullAll: {bookedAppointments: [req.body.id]}}, function(flag){})
		// db.deleteOne(Appointment, {_id: req.body.id})
		res.send(true)
  },
  
	getAppointmentNotifs: function(req, res) {
		var match;
		if (req.session.type == 'user') {
			match = {'patient': req.session.userId}
		} else if (req.session.type == 'doctor') {
			match = {'bookedDoctor': req.session.userId}
		}

		Appointment.aggregate([{
			$match: match}, { 
			$group: {
				_id: '$status',
				count: { $sum: 1}
			}
		}]).exec(function(e, r) {			
			var upcomingCount = r.find(obj => {return obj._id === 'Upcoming'})
			var pendingCount = r.find(obj => {return obj._id === 'Pending'})

			if (upcomingCount) 
				upcomingCount = upcomingCount.count

			if (pendingCount)
				pendingCount = pendingCount.count

			res.send({upcomingCount: upcomingCount, pendingCount: pendingCount});
		})
	}
}

module.exports = appointmentController