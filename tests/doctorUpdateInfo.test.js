jest.useFakeTimers()
const httpMocks = require('node-mocks-http')
//const app = require('../index') // Link to your server file
const express = require('express');


const app = require('../testApp') // Link to your server file

const supertest = require('supertest')
const request = supertest.agent(app)

jest.setTimeout(100000)
const Doctor = require('../models/doctorModel')

const mongoose = require('mongoose');
const { expectation } = require('sinon');
beforeAll(async () => {
    // const url = `mongodb://127.0.0.1/testDB`
    const url = 'mongodb+srv://admin:123@meddb.bbgb8.mongodb.net/local_library'
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  })


/*
beforeEach(async function(done){
    await request(app)
      .post('/')
      .send({email: 'test@dr.com', password: 'test'})
      .end(function(err, response){
          console.log(response)
        expect(response.statusCode).to.equal(200);
        done();
      });
  });
  */

describe('Update doctor info', () => {
    it('login', loginUser())
    it('test', async done => {
        try {

            var rq = {
                info: {
                    firstname: 'test',
                    lastname: 'update',
                    email: 'test@dr.com',
                    profession: 'Pediatrician',
                    clinics: [ '5fb59a0731422020ec5fb2e0', '5fb77b1c86c5004b18e8223b' ] 
                }
            }
            const editProf = await request.        
                post('/editProfile').type('form').send(rq)

            Doctor.findOne({ email: 'test@dr.com' }, '-_id firstname lastname email profession clinics', function(err, result) {
                expect(rq.info).toMatchObject(result)
                done()
            }).lean()


    
    
        } catch (e) {
            console.log("------------ERROR-----------")
            console.log(e)
            console.log("------------ERROR-----------")
        }
    
    })
})



function loginUser() {
    return async done => {
        try {
    
            const login = await request.        
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
};