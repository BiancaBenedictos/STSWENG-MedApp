const db = require('./models/db.js');

db.connect();

const Appointment = require('./models/appointmentModel.js')
const Clinic = require('./models/clinicModel.js')
const Doctor = require('./models/doctorModel.js')
const Patient = require('./models/userModel.js')

var appointment = {
    bookedDoctor: "doctor id",
    patient: "patient id",
    bookedDate: new Date(2020, 9, 13),
    bookDetails: "details",
    status: "Pending"
}

db.insertOne(Appointment, appointment, function(flag){})

var address = {
    street: "street",
    city: "city",
    state: "state"
}

var clinic = {
    clinicName: "Test Clinic",
    clinicAddress: address,
    clinicDoctors: []
}

db.insertOne(Clinic, clinic, function(flag){})

var doctor = {
    email: "hi@gmail.com",
    password: "hi",
    firstname: "hi",
    lastname: "hello",
    Clinic: [],
    profession: "Pediatrician",
    credentials: [],
    profpic: "portrait.png"
}

db.insertOne(Doctor, doctor, function(flag){})

var patient = {
    email: "patient@gmail.com",
    password: "patient",
    firstname: "John",
    lastname: "Doe",
    age: 21,
    weight: 60,
    height: 165,
    profpic: "portrait.png",
    bookedAppointments: []
}

db.insertOne(Patient, patient, function(flag){})