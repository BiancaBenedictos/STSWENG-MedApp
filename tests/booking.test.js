const supertest = require('supertest');
const app = require('../testApp')
const request = supertest(app);

const bcrypt = require('bcrypt');
const saltRounds = 10;

const mongoose = require('mongoose');
const dbname = 'test';
const USER = require('../models/userModel');
const DOCTOR = require('../models/doctorModel');
const APPOINTMENT = require('../models/appointmentModel')

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};


beforeAll(async (done) => {
    jest.setTimeout(10000)
    const url = `mongodb://localhost:27017/${dbname}`;
    await mongoose.connect(url, options);
    await makeAccounts(); 
});

afterAll((done) => {
    mongoose.connection.db.dropCollection('sessions');
    mongoose.connection.db.dropCollection('doctors');
    mongoose.connection.db.dropCollection('users');

    done()
})

async function makeAccounts() {
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
        })
    } catch (ex) {
        console.log(ex)
    }
}