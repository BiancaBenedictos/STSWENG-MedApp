const express = require('express')
const multer  = require('multer')

const navbarController = require('../controllers/navbarController')
const adminController = require('../controllers/adminController')
const appointmentController = require('../controllers/appointmentController')
const doctorController = require('../controllers/doctorController')
const homeController = require('../controllers/homeController')
const userController = require('../controllers/userController')

const app = express()

module.exports = app

app.get('/getName', navbarController.getName);

app.get('/adminClinics', adminController.clinics)
app.get('/adminDoctors', adminController.doctors)
app.get('/adminPending', adminController.pending)

app.get('/upcomingAppointments', appointmentController.upcomingAppointments)
app.get('/pendingAppointments', appointmentController.pendingAppointments)
app.get('/concludedAppointments', appointmentController.concludedAppointments)
app.get('/cancelledAppointments', appointmentController.cancelledAppointments)
app.get('/bookAppointment', appointmentController.bookAppointment)

app.get('/doctorProfile', doctorController.doctorProfile)
app.get('/doctorPendingAppointments', doctorController.pendingAppointments)
app.get('/createAppointments', doctorController.createAppointments)
app.post('/setAvailability', doctorController.setAvailability)

app.get('/', homeController.doctors)
app.get('/homeClinics', homeController.clinics)
app.get('/viewDoctors', homeController.viewDoctors)

app.get('/login', userController.login)
app.get('/register', userController.register)