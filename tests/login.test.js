const httpMocks = require('node-mocks-http');
const controller = require('../controllers/userController');

const time = require('../util/time');
const sinon = require('sinon');
sinon.stub(time, 'setTimeout');
// beforeEach(() => {
//     jest.useFakeTimers();
// })

var request  = httpMocks.createRequest({
    method: 'POST',
    url: '/login',
});

var response = httpMocks.createResponse();

describe('login is successful', () => {
    it('Status Message is OK', async () => {
        controller.postLogin(request, response);
        expect(response.statusMessage).toBe("OK");
    });
})