const httpMocks = require('node-mocks-http');
//const { postPatientRegister } = require('../controllers/userController');
//const { postDoctorRegister } = require('../controllers/userController');
const controller = require('../controllers/userController');

const time = require('../util/time');
const sinon = require('sinon');
sinon.stub(time, 'setTimeout');

// beforeEach(() => {
//     jest.useFakeTimers();
// })


var request1  = httpMocks.createRequest({
    method: 'POST',
    url: '/patientRegister',
    params: {
        email: 'g@test.com',
        password: 'bulokkaman',
        firstname: 'g',
        lastname: 'g',
        age: 24,
        height: 170,
        weight: 76
    }
});

var request2 = httpMocks.createRequest({
    method: 'POST',
    url: '/doctorRegister',
    params: {
        clinics: ['5fb59a0731422020ec5fb2e0'],
        email: 'abc@yahoo.com',
        password: 'bulokam',
        firstname: 'a', 
        lastname: 'a',
        profession: 'Pediatrician',
    },
    files: {
        credentials: 'abc.pdf',
    },
});

var response = httpMocks.createResponse();

describe('insertion of dummy patient is successful', () => {
    it('object is not null', async () => {
        controller.postPatientRegister(request1, response);
        console.log(response);
        expect(response.statusCode).toBe(200);
    });
})

describe('insertion of dummy doctor is successful', () => {
    it('object is not null', async () => {
        controller.postDoctorRegister(request2, response);
        expect(response).not.toBe(null);
    });
})

////////////////////////// new sht  //////////////////////////
// var request  = httpMocks.createRequest({
//     method: 'POST',
//     url: '/register',
//     params: {
//         email: 'g@test.com',
//         password: 'bulokkaman',
//         firstname: 'g',
//         lastname: 'g',
//         bookedAppointments: [],
//         age: 24,
//         height: 170,
//         weight: 76
//     }
// });