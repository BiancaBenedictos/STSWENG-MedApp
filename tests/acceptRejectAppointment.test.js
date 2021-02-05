jest.useFakeTimers()

const express = require('express');
const app = require('../testApp') 
const supertest = require('supertest')
const request = supertest.agent(app)

const User = require('../models/userModel')
const Doctor = require('../models/doctorModel')
const Appointment = require('../models/appointmentModel')

const mongoose = require('mongoose');
const { expectation } = require('sinon');
jest.setTimeout(10000)

const bcrypt = require('bcrypt');
const helper = require('../helpers/helper');
const { response } = require('../routes/routes');
const saltRounds = 10;

var doctorID, appointmentID, userID
beforeAll(async (done) => {
    const url = 'mongodb://127.0.0.1/testDB'
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    await init(done)
})

afterAll((done) => {
    mongoose.connection.db.dropCollection('sessions');
    mongoose.connection.db.dropCollection('doctors');
    mongoose.connection.db.dropCollection('appointments');
    mongoose.connection.db.dropCollection('users');
    done()
})

describe('Check updated appointment status', () => {

    it('Login', loginUser())

    it('Accept appointment', async done => {
        try {
            await Appointment.findOne({}, null, async function(err, res) {
                const acceptApt = await request.
                    post('/acceptAppointment').send(appointmentID)
                expect(res.status).toEqual('Upcoming')
            }).lean()
            done() 
        } catch (e) {
            console.log(e)
        }
    })

    it('Reject appointment', async done => {
        try {
            await Appointment.findOne({}, null, async function(err, res) {
                const acceptApt = await request.
                    post('/rejectAppointment').send(appointmentID)
                expect(res.status).toEqual('Cancelled')
            }).lean()
            done() 
        } catch (e) {
            console.log(e)
        }
    })
})

function loginUser() {
    return async done => {
        try {
            await request.        
                post('/').type('form').send({
                    email: 'test@dr.com',
                    password: 'test'
                })
            
            done()        
        } catch (e) {
            console.log("------------ERROR-----------")
            console.log(e)
            console.log("------------ERROR-----------")
        }
    }
}

async function init(done) {
    try {
        bcrypt.hash(`test`, saltRounds, async (err, hash) => {
            await User.create({
                email: 'test@gmail.com',
                password: hash,
                firstname: "test",
                lastname: "user",
                profpic: "images/test.png",
                bookedAppointments: [],
                age: 20,
                height: 180,
                weight: 50
            })

            await User.findOne({}, null, function(err, res) {
                userID = res._id
            })
        })

        bcrypt.hash(`test`, saltRounds, async (err, hash) => {
            await Doctor.create({
                clinics: [],
                profpic:"images/test.png",
                bookedAppointments:[],
                availability:[],
                email:"test@dr.com",
                password: hash,
                firstname:"test",
                lastname:"doctor",
                profession:"Pediatrician",
                status:"verified",
                credentials:"doctor.pdf"
            })
                    
            await Doctor.findOne({}, null, async function(err, doctor) {
                doctorID = doctor._id
          
                await Appointment.create({
                    bookedDate: '2021-01-18T00:00:00.000+00:00',
                    bookedDoctor: doctorID,
                    doctorName: "Test Doctor",
                    doctorPic: "images/Test.png",
                    patient: userID,
                    patientName: "Test User",
                    status: "Pending"
                })
                await Appointment.findOne({}, null, async function(err, result) {
                    appointmentID = result._id
                })
            })
            done()
        })
    } catch (ex) {
        console.log(ex)
    }
}