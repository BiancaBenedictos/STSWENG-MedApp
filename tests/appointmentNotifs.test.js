jest.useFakeTimers()

const express = require('express');
const app = require('../testApp') 
const supertest = require('supertest')
const request = supertest.agent(app)

const Doctor = require('../models/doctorModel')
const User = require('../models/userModel')
const Appointment = require('../models/appointmentModel')

const mongoose = require('mongoose');
jest.setTimeout(10000)

const bcrypt = require('bcrypt');
const saltRounds = 10;

var doctorID, userID

beforeAll(async (done) => {
    const url = 'mongodb://127.0.0.1/testDB'
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

    await makeAccounts(done);    
})

afterAll((done) => {
    mongoose.connection.db.dropCollection('sessions');
    mongoose.connection.db.dropCollection('doctors');
    mongoose.connection.db.dropCollection('users');
    mongoose.connection.db.dropCollection('appointments');

    done()
})


describe('Empty Appointments', () => {
    it('Doctor Login', loginUser({email: 'test@dr.com', password: 'test'}))
    
    it('Doctor Empty Notifs', async done => {
        try {
            const notifs = await request.        
                get('/getAppointmentNotifs')

            expect(notifs.text.upcomingCount).toBeUndefined()
            expect(notifs.text.pendingCount).toBeUndefined()
            
            done()
        } catch (e) {
            console.log(e)
        }
    
    })

    it('Doctor Logout', logout())
    
    it('User Login', loginUser({email: 'test@gmail.com', password: 'test'}))
    
    it('User Empty Notifs', async done => {
        try {
            const notifs = await request.        
                get('/getAppointmentNotifs')

            expect(notifs.text.upcomingCount).toBeUndefined()
            expect(notifs.text.pendingCount).toBeUndefined()
            
            done()
        } catch (e) {
            console.log(e)
        }
    
    })

    it('User Logout', logout())  
})



describe('With 3 Upcoming and 2 Pending Appointments', () => {
    beforeAll(async done => {
        makeAppointments(done)
    })

    it('Doctor Login', loginUser({email: 'test@dr.com', password: 'test'}))
    
    it('Doctor With Notifs', async done => {
        try {            
            const notifs = await request.        
            get('/getAppointmentNotifs')

            expect(notifs.body.upcomingCount).toEqual(3)
            expect(notifs.body.pendingCount).toEqual(2)
                
            done()  
        } catch (e) {
            console.log(e)
        }
    
    })

    it('Doctor Logout', logout())

    it('User Login', loginUser({email: 'test@gmail.com', password: 'test'}))
    
    it('User With Notifs', async done => {
        try {            
            const notifs = await request.        
            get('/getAppointmentNotifs')

            expect(notifs.body.upcomingCount).toEqual(3)
            expect(notifs.body.pendingCount).toEqual(2)
                
            done()  
        } catch (e) {
            console.log(e)
        }    
    })

    it('User Logout', logout())  
})


function loginUser(info) {
    return async done => {
        try {
            await request.        
                post('/').type('form').send(info)
            
            done()        
        } catch (e) {
            console.log("------------ERROR-----------")
            console.log(e)
            console.log("------------ERROR-----------")
        }
    }
}

function logout() {
    return async done => {
        try {
            await request.        
                get('/logout')
            
            done()        
        } catch (e) {
            console.log("------------ERROR-----------")
            console.log(e)
            console.log("------------ERROR-----------")
        }
    }
}

async function makeAccounts(done) {
    /*  INSERT DOCTOR AND USER  */
    try {
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
                credentials:"doctor.pdf",
            })

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
                
            await Doctor.findOne({}, '_id', async function(err, result) {
                doctorID = result._id
                await User.findOne({}, '_id', function(err, res2) {
                    userID = res2._id
                })
            })

            done()
        })
    } catch (ex) {
        console.log(ex)
    }
}

async function makeAppointments(done) {
    
        try {
            var appointments = [
                { bookedDoctor: doctorID, patient: userID, bookedDate: Date.parse("01 Feb 2021 00:00:00 GMT"), status: "Upcoming" },
                { bookedDoctor: doctorID, patient: userID, bookedDate: Date.parse("01 Feb 2021 00:00:00 GMT"), status: "Upcoming" },
                { bookedDoctor: doctorID, patient: userID, bookedDate: Date.parse("01 Feb 2021 00:00:00 GMT"), status: "Pending" },
                { bookedDoctor: doctorID, patient: userID, bookedDate: Date.parse("01 Feb 2021 00:00:00 GMT"), status: "Pending" },
                { bookedDoctor: doctorID, patient: userID, bookedDate: Date.parse("01 Feb 2021 00:00:00 GMT"), status: "Cancelled" },
                { bookedDoctor: doctorID, patient: userID, bookedDate: Date.parse("01 Feb 2021 00:00:00 GMT"), status: "Completed" },
                { bookedDoctor: doctorID, patient: userID, bookedDate: Date.parse("01 Feb 2021 00:00:00 GMT"), status: "Upcoming" },
            ]
    
            Appointment.insertMany(appointments, function(err, res) {
                done()
            })
        } catch (e) {
            console.log("------------ERROR-----------")
            console.log(e)
            console.log("------------ERROR-----------")
        }        
    
}
