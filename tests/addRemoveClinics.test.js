jest.useFakeTimers()

const express = require('express');
const app = require('../testApp') 
const supertest = require('supertest')
const request = supertest.agent(app)

const Admin = require('../models/adminModel')
const Clinic = require('../models/clinicModel')

const mongoose = require('mongoose');
const { expectation } = require('sinon');
jest.setTimeout(10000)

const bcrypt = require('bcrypt');
const helper = require('../helpers/helper');
const saltRounds = 10;

var doctorID, clinicIDs
beforeAll(async (done) => {
    const url = 'mongodb://127.0.0.1/testDB'
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

    try {        
            bcrypt.hash(`a`, saltRounds, async (err, hash) => {
                await Admin.create({
                    email: "admin@admin.com",
                    password: hash,
                    firstname: "admin",
                    lastname: "admin",
                    profpic: "images/a.png"
                })

                done();
            })
    } catch (ex) {
        console.log(ex)
    }
    
})

afterAll((done) => {
    mongoose.connection.db.dropCollection('sessions');
    mongoose.connection.db.dropCollection('admins');
    mongoose.connection.db.dropCollection('clinics');
    done()
})


describe('Update doctor info', () => {
    var clinicID;
    
    it('Login', loginUser())

    it('Add New Clinic', async done => {
        const a = await request.post('/addClinic').type('form').send({newclinic: {clinicName: 'testClinic'}});
        clinicID = a.body._id;

        await Clinic.find({clinicName: 'testClinic'}, '', function(err, res) {
            expect(res).toBeTruthy();
            done();
        })
    })

    it('Remove Clinic', async done => {
        const r = await request.post('/deleteClinic').type('form').send({id: clinicID});  
        
        expect(r.text).toBe("true");
        await Clinic.find({_id: clinicID}, '', function(err, res) {
            expect(res[0]).toBeUndefined();
            done();
        })
    })

    it('Logout', logout());
})



function loginUser() {
    return async done => {
        try {
            await request.        
                post('/').type('form').send({
                    email: 'admin@admin.com',
                    password: 'a'
                })
                
            done()        
        } catch (e) {
            console.log("------------ERROR-----------")
            console.log(e)
            console.log("------------ERROR-----------")
        }
    }
    
}



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