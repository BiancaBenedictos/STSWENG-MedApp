const supertest = require('supertest');
const app = require('../testApp')
const request = supertest(app);

const bcrypt = require('bcrypt');
const saltRounds = 10;

const mongoose = require('mongoose');
const dbname = 'test2';
// const USER = require('../models/userModel');
const DOCTOR = require('../models/doctorModel');
// const APPOINTMENT = require('../models/appointmentModel')
const CLINIC = require('../models/clinicModel');
const AVAILABILITY = require('../models/availabilityModel');

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

var doctorID, clinicIDs
var IDclinics;

beforeAll(async (done) => {
    jest.setTimeout(10000)
    const url = `mongodb://localhost:27017/${dbname}`;
    await mongoose.connect(url, options);
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
        await CLINIC.insertMany(clinics)
        await mongoose.connection.db.createCollection('availabilities')
        
        await CLINIC.find({}, '_id', async function(err, res) {
            clinicIDs = res.map(s => s._id);

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

                    // await AVAILABILITY.create({
                    //     clinicID: IDclinics[0].toString(),
                    //     day: 'Monday',
                    //     doctorID: doctorID,
                    //     startTime: '8',
                    //     endTime: '11',
                    //     intervalHours: '0.25'
                    // })

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
    mongoose.connection.db.dropCollection('clinics');
    mongoose.connection.db.dropCollection('availabilities');

    done()
})

describe('Doctor successfully sets appointment hours', () => {
    it('Login', loginUser())

    it('create availability hours', async done => {
        try{
            await CLINIC.find({}, '_id', async function(err, res) {
                clinicIDs = res.map(s => s._id);
                IDclinics = clinicIDs;
    
                await DOCTOR.findOne({}, '_id', async function(err, result) {
                    doctorID = result._id;
                })
            })
    
            var availability = 
                { 
                    avail: [{
                        clinicID: IDclinics[0].toString(),
                        day: 'Tuesday',
                        doctorID: doctorID.toString(),
                        startTime: '8',
                        endTime: '11',
                        intervalHours: '0.25'
                    }, {
                        clinicID: IDclinics[1].toString(),
                        day: 'Thursday',
                        doctorID: doctorID.toString(),
                        startTime: '8',
                        endTime: '11',
                        intervalHours: '0.25'
                    }]
                }
                const response = await request.post('/setAvailability').type('form').send(availability);
    
                // await AVAILABILITY.findOne({ day: 'Monday' }, function(err, result) {
                //     console.log(err);
                //     // console.log(doctorID);
                //     console.log(result);
                //     done()
                // }).lean()  
    
                expect(response.status).toBe(200);
                done();
        } catch(e) {
            console.log(e);
        }
        
    })

    it('Doctor Logout', logout());
});

// describe('recently inserted availability is found', () => {
//     it('check if inserted successfully', async done => {
//         await CLINIC.find({}, '_id', async function(err, res) {
//             clinicIDs = res.map(s => s._id);
//             IDclinics = clinicIDs;

//             await DOCTOR.findOne({}, '_id', async function(err, result) {
//                 doctorID = result._id;
//             })
//         })
//         var doc_ID = doctorID.toString();
//         console.log(doc_ID);
//         await AVAILABILITY.find( { doctorID: doc_ID }, 'clinicID day doctorID startTime endTime intervalHours', function(err, result) {
//             console.log(err);
//             console.log(result);
//         })
//         done();
//     })
// })


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