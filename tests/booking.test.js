const supertest = require('supertest');
// const session = require('supertest-session');
const app = require('../testApp')
const request = supertest.agent(app);

const bcrypt = require('bcrypt');
const saltRounds = 10;

const mongoose = require('mongoose');
const dbname = 'test3';
const USER = require('../models/userModel');
const DOCTOR = require('../models/doctorModel');
const CLINIC = require('../models/clinicModel')
const APPOINTMENT = require('../models/appointmentModel')
const AVAILABILITY = require('../models/availabilityModel')

var doctorID, userID;
// var testSession = null;

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};


beforeAll(async (done) => {
    jest.setTimeout(10000)
    const url = `mongodb://localhost:27017/${dbname}`;
    await mongoose.connect(url, options);
    
    bcrypt.hash(`test`, saltRounds, async (err, hash) => {
        await USER.create({
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

        await USER.findOne({}, '_id', function(err, res2) {
            userID = res2._id
        })
    })

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
        await CLINIC.insertMany(clinics)
        
        await CLINIC.find({}, '_id', async function(err, res) {
            clinicIDs = res.map(s => s._id);
            IDclinics = clinicIDs;

            bcrypt.hash(`test`, saltRounds, async (err, hash) => {
                await DOCTOR.create({
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
                
                DOCTOR.findOne({}, '_id', async function(err, result) {
                    doctorID = result._id
                    await CLINIC.updateMany({}, {clinicDoctors: [result._id]})

                    await AVAILABILITY.create({
                        clinicID: IDclinics[0].toString(),
                        day: 'Monday',
                        doctorID: doctorID.toString(),
                        startTime: '8',
                        endTime: '11',
                        intervalHours: '0.5',
                    })
                    done()
                })
            })
        }).lean()
    } catch (ex) {
        console.log(ex)
    }
});

afterAll((done) => {
    mongoose.connection.db.dropCollection('sessions');
    mongoose.connection.db.dropCollection('doctors');
    mongoose.connection.db.dropCollection('users');
    mongoose.connection.db.dropCollection('availabilities');
    mongoose.connection.db.dropCollection('clinics');
    mongoose.connection.db.dropCollection('appointments');

    done()
})

describe('Book Appointment', () => {
    var req;
    it('User login', loginUser({email: 'test@gmail.com', password: 'test'}))

    it('book appointment', async done => {
        req = {
            fulldate: 'January 28, 2021',
            time: '10:39:00',
            doctor: doctorID.toString(),
            doctorName: 'test update',
            doctorPic: 'images/test.png',
            userId: userID.toString(),
            name: 'test user',
            profpic: 'images/test.png'
        }

        const response = await request.post('/requestAppointment').type('form').send(req);

        expect(response.statusCode).toBe(200);
        done();
    })

    it('find appointment', async done => {
        await APPOINTMENT.findOne( { bookedDoctor: doctorID.toString()}, function(err, result) {
            expect(result.status).toBe('Pending');
            expect(result.bookedDate).toBeTruthy();
            expect(result.doctorName).toBe('test update');
            expect(result.patientName).toBe('test user');

            done();
        })
    })

    it('user logout', logout())
});

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

function loginUser(info) {
    return async done => {
        try {
            await request.        
                post('/').type('form').send(info);
            
            done()   
        } catch (e) {
            console.log("------------ERROR-----------")
            console.log(e)
            console.log("------------ERROR-----------")
        }
    }
    
}