jest.useFakeTimers()
const httpMocks = require('node-mocks-http');
const { postLogin } = require('../controllers/userController');

var request  = httpMocks.createRequest({
    method: 'POST',
    url: '/login',
});

var response = httpMocks.createResponse();

postLogin(request, response);

describe('login is successful', () => {
    it('Status Message is OK', async () => {
        
        expect(response.statusMessage).toBe("OK");
    });
})