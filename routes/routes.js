const express = require('express')
const multer  = require('multer')

const navbarController = require('../controllers/navbarController')
const adminController = require('../controllers/adminController')
const appointmentController = require('../controllers/appointmentController')
const doctorController = require('../controllers/doctorController')
const homeController = require('../controllers/homeController')
const userController = require('../controllers/userController')

//MULTER INIT
var storage = multer.diskStorage({
    destination: function (req, file, cd) {
        if (file.fieldname === 'picture') {
            cd(null, './views/images');
        } else if (file.fieldname === 'credentials') {
            cd(null, './views/credentials');
        }
    },
    filename: function (req, file, cd) {
        cd(null, file.originalname);
    },
});

var upload = multer({ storage: storage });
var uploadFilter = upload.fields([
    { name: 'picture', maxCount: 1 },
    { name: 'credentials', maxCount: 1 }
]);
//MULTER INIT

const app = express();

module.exports = app

app.get('/getDetails', navbarController.getDetails);

app.get('/adminClinics', adminController.clinics)
app.get('/adminDoctors', adminController.doctors)
app.get('/adminPending', adminController.pending)
app.post('/acceptDoctor', adminController.acceptDoctor)
app.post('/rejectDoctor', adminController.rejectDoctor)
app.post('/addClinic', adminController.addClinic)
app.post('/deleteClinic', adminController.deleteClinic)

app.get('/upcomingAppointments', appointmentController.upcomingAppointments)
app.get('/pendingAppointments', appointmentController.pendingAppointments)
app.get('/concludedAppointments', appointmentController.concludedAppointments)
app.get('/cancelledAppointments', appointmentController.cancelledAppointments)
app.get('/bookAppointment', appointmentController.bookAppointment)
app.get('/getSlots', appointmentController.getSlots)
app.get('/disableSlots', appointmentController.disableSlots)
app.post('/requestAppointment', appointmentController.requestAppointment)

app.get('/doctorProfile', doctorController.doctorProfile)
// app.get('/doctorPendingAppointments', doctorController.pendingAppointments)
app.get('/createAppointments', doctorController.createAppointments)
app.post('/acceptAppointment', appointmentController.acceptAppointment);
app.get('/getClinicHours', doctorController.getClinicHours)
app.post('/setAvailability', doctorController.setAvailability)

app.get('/homeDoctors', homeController.doctors)
app.get('/homeClinics', homeController.clinics)
app.get('/viewDoctors', homeController.viewDoctors)

app.get('/', userController.getLogin)
app.post('/', userController.postLogin)
app.get('/getCheckLogin', userController.getCheckLogin)

app.get('/register', userController.getRegister)
app.get('/getCheckEmail', userController.getCheckEmail)
app.post('/register', 
         uploadFilter,
         userController.postRegister)

app.get('/logout', userController.logout)

app.get('/error', userController.error)