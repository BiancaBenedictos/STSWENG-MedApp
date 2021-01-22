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

it('Should save patient to database', async done => {
    const res = await request.post('/testpatientRegister')
    .field('firstname', 'tester2')
    .field('lastname', 'tester2')
    .field('email', 'tester2@gmail.com')
    .field('password', '1234567')
    .field('cpassword', '1234567')
    .field('age', '21')
    .field('weight', '76')
    .field('height', '165')
    
    expect(res.status).toBe(200);
    done();
})

it('Should find an existing patient in the database', async done => {
    var user;
    user = await USER.findOne( {email: "test@gmail.com"} );
    expect(user.email).toBeTruthy();
    expect(user.firstname).toBe('test');
    done();
})

it('Should find an existing doctor in the database', async done => {
    var doc;
    doc = await DOCTOR.findOne( {email: "test@dr.com"} );
    expect(doc.email).toBeTruthy();
    expect(doc.firstname).toBe('test');
    done();
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