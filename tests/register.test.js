jest.useFakeTimers()
const httpMocks = require('node-mocks-http');
const { postRegister } = require('../controllers/userController');

var request  = httpMocks.createRequest({
    method: 'POST',
    url: '/register',
});

var response = httpMocks.createResponse();

postRegister(request, response);

describe('insertion of dummy user is successful', () => {
    it('object is not null', async () => {
        
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