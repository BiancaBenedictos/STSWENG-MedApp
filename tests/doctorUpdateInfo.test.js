jest.useFakeTimers()

const express = require('express');
const app = require('../testApp') 
const supertest = require('supertest')
const request = supertest.agent(app)

const Doctor = require('../models/doctorModel')
const Clinic = require('../models/clinicModel')

const mongoose = require('mongoose');
const { expectation } = require('sinon');
jest.setTimeout(10000)

const bcrypt = require('bcrypt');
const helper = require('../helpers/helper');
const saltRounds = 10;

var doctorID, clinicIDs
beforeAll(async (done) => {
    const url = 'mongodb://127.0.0.1/testDB'
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

    /* PREPARE DB */
    var clinics = [{
        clinicDoctors: [],
        clinicName: 'Test Clinic',
        clinicAddress: {
        street: 'test',
        city: 'clinic',
        state: 'address'
        }
    }, {
        clinicDoctors: [],
        clinicName: 'Test 2',
        clinicAddress: {
        street: 'test',
        city: '2',
        state: 'address'
        },
        __v: 0
    }]

    try {
        await Clinic.insertMany(clinics)
        
        await Clinic.find({}, '_id', async function(err, res) {
            clinicIDs = res.map(s => s._id);

            bcrypt.hash(`test`, saltRounds, async (err, hash) => {
                await Doctor.create({
                    clinics: clinicIDs,
                    profpic:"images/test.png",
                    bookedAppointments:[],
                    availability:[],
                    email:"test@dr.com",
                    password: hash,
                    firstname:"test",
                    lastname:"update",
                    profession:"Pediatrician",
                    status:"verified",
                    credentials:"doctor.pdf",
                })
                
                Doctor.findOne({}, '_id', async function(err, result) {
                    doctorID = result._id
                    await Clinic.updateMany({}, result._id)
                    done()
                })
            })
        }).lean()
    } catch (ex) {
        console.log(ex)
    }
    
})

afterAll(async () => {
    await mongoose.connection.db.dropCollection('sessions');
    await mongoose.connection.db.dropCollection('doctors');
    await mongoose.connection.db.dropCollection('clinics');
})


describe('Update doctor info', () => {
    it('login', loginUser())
    it('test', async done => {
        try {
            var rq
            await Clinic.findOne({}, "_id", async function(err, res) {
                rq = {
                    info: {
                        firstname: 'test',
                        lastname: 'update',
                        email: 'test@dr.com',
                        profession: 'Pediatrician',
                        clinics: [res._id.toString()]
                    }
                }
            })

            const editProf = await request.        
                post('/editProfile').type('form').send(rq)

            Doctor.findOne({ email: 'test@dr.com' }, '-_id firstname lastname email profession clinics', function(err, result) {
                expect(rq.info).toMatchObject(result)
                done()
            }).lean()
            
            

        } catch (e) {
            console.log(e)
        }
    
    })
})



function loginUser() {
    return async done => {
        try {
            const login = await request.        
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
    
};