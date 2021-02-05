const express = require('express')
const multer  = require('multer')

const navbarController = require('../controllers/navbarController')
const adminController = require('../controllers/adminController')
const appointmentController = require('../controllers/appointmentController')
const doctorController = require('../controllers/doctorController')
const homeController = require('../controllers/homeController')
const userController = require('../controllers/userController')

const testuser = require('../controller-tests/test-userController');

const validation = require('../helpers/validation.js');

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
app.post('/cancelAppointment', appointmentController.cancelAppointment)
app.get('/getAppointmentNotifs', appointmentController.getAppointmentNotifs)

app.get('/doctorProfile', doctorController.doctorProfile)
// app.get('/doctorPendingAppointments', doctorController.pendingAppointments)
app.get('/createAppointments', doctorController.createAppointments)
app.post('/acceptAppointment', appointmentController.acceptAppointment);
app.post('/rejectAppointment', appointmentController.rejectAppointment);
app.get('/getClinicHours', doctorController.getClinicHours)
app.post('/setAvailability', doctorController.setAvailability)

app.get('/homeDoctors', homeController.doctors)
app.get('/homeClinics', homeController.clinics)
app.get('/viewDoctors', homeController.viewDoctors)

app.get('/', userController.getLogin)
app.post('/', userController.postLogin)
app.get('/getCheckLogin', userController.getCheckLogin)

app.get('/patientRegister', userController.getPatientRegister)
app.get('/getCheckEmail', userController.getCheckEmail)
app.post('/patientRegister', 
         uploadFilter,
         validation.PatientSignupValidation(),
         userController.postPatientRegister)

app.get('/doctorRegister', userController.getDoctorRegister)
app.get('/getCheckEmail', userController.getCheckEmail)
app.post('/doctorRegister', 
         uploadFilter,
         validation.DoctorSignupValidation(),
         userController.postDoctorRegister)

app.get('/editProfile', userController.getEditProfile)
app.post('/editProfile', uploadFilter, userController.postEditProfile)

app.post('/changePassword', userController.changePassword)

app.post('/changePassword', userController.changePassword)

app.get('/logout', userController.logout)

app.get('/error', userController.error)
app.get('*', userController.error)

//tests
app.post('/testpatientRegister', 
         uploadFilter,
         validation.PatientSignupValidation(),
         testuser.postPatientRegister)

app.post('/testdoctorRegister', 
         uploadFilter,
         validation.DoctorSignupValidation(),
         testuser.postDoctorRegister)