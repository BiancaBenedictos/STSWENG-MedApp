// const httpMocks = require('node-mocks-http');
//const { postPatientRegister } = require('../controllers/userController');
//const { postDoctorRegister } = require('../controllers/userController');
// const controller = require('../controllers/userController');
const supertest = require('supertest');
const app = require('../index');
const request = supertest(app);


// const mongoose = require('mongoose');
const db = require('../models/db')
const dbname = 'test';
const USER = require('../models/userModel');
const DOCTOR = require('../models/doctorModel');

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};


beforeAll(async () => {
    const url = `mongodb://localhost:27017/${dbname}`;
    await db.connect(url, options);
});

// it('Should save patient to database', async done => {
//     const res = await request.post('/testpatientRegister')
//     .field('firstname', 'tester2')
//     .field('lastname', 'tester2')
//     .field('email', 'tester2@gmail.com')
//     .field('password', '1234567')
//     .field('cpassword', '1234567')
//     .field('age', '21')
//     .field('weight', '76')
//     .field('height', '165')
    
//     expect(res.status).toBe(200);
//     done();
// })

// it('Should find an existing patient in the database', async done => {
//     db.findOne(USER, {email: 'tester@gmail.com'}, null, function(res){
//         expect(res.email).toBeTruthy();
//         expect(res.firstname).toBe('tester');
//         done();
//     })
// })

// it('Should save doctor to database', async done => {
//     const res = await request.post('/testpatientRegister')
//     .set({
//         'Content-Type': 'multipart/form-data',
//       })
//     .field('firstname', 'doctor')
//     .field('lastname', 'doctor')
//     .field('email', 'doctor@gmail.com')
//     .field('password', '1234567')
//     .field('cpassword', '1234567')
//     .field('profession', 'Pediatrician')
//     .field('clinics[]', ['clinic2', 'test'])
//     .attach('credentials', 'STSWENG-UI.pdf');
    
//     expect(res.status).toBe(200);
//     done();
// })

// it('Should find an existing doctor in the database', async done => {
//     db.findOne(DOCTOR, {email: 'tester@gmail.com'}, null, function(res){
//         expect(res.email).toBeTruthy();
//         expect(res.firstname).toBe('tester');
//         done();
//     })
// })

// describe('insertion of dummy doctor is successful', () => {
//     it('object is not null', async () => {
//         controller.postDoctorRegister(request2, response);
//         expect(response).not.toBe(null);
//     });
// })