const supertest = require('supertest');
const app = require('../testApp')
const request = supertest(app);

const bcrypt = require('bcrypt');
const saltRounds = 10;

const mongoose = require('mongoose');
const dbname = 'test';
const USER = require('../models/userModel');
const DOCTOR = require('../models/doctorModel');

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};


beforeAll(async (done) => {
    jest.setTimeout(10000)
    const url = `mongodb://localhost:27017/${dbname}`;
    await mongoose.connect(url, options);
    await makeAccounts(done); 
});

afterAll((done) => {
    mongoose.connection.db.dropCollection('sessions');
    mongoose.connection.db.dropCollection('doctors');
    mongoose.connection.db.dropCollection('users');

    done()
})

describe('logging in and logging out of a patient is successful', () => {
    it('login a Patient', async done => {
        const res = await request.post('/').type('form').send({
            email: 'test@gmail.com', 
            password: 'test'
        })
        // console.log(res.res.statusMessage);
        expect(res.res.statusCode).toBe(302);
        expect(res.res.statusMessage).toBe('Found');
        done();
    });

    it('logout Patient', async done => {
        const res = await request.get('/logout')
        
        expect(res.res.complete).toBe(true);
        done();
    });
})

describe('logging in and logging out of a doctor is successful', () => {
    it('log in a doctor', async done => {
        const res = await request.post('/').type('form').send({
            email: 'test@dr.com', 
            password: 'test'
        })
        // console.log(res.res.statusMessage);
        expect(res.res.statusCode).toBe(302);
        expect(res.res.statusMessage).toBe('Found');
        done();
    });

    it('logout Doctor', async done => {
        const res = await request.get('/logout')
        
        expect(res.res.complete).toBe(true);
        done();
    });
})

async function makeAccounts(done) {
    /*  INSERT DOCTOR AND USER  */
    try {
        bcrypt.hash(`test`, saltRounds, async (err, hash) => {
            await DOCTOR.create({
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
            done()
        })
    } catch (ex) {
        console.log(ex)
    }
}