jest.useFakeTimers()

const express = require('express');
const app = require('../testApp') 
const supertest = require('supertest')
const request = supertest.agent(app)

const User = require('../models/userModel')

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;

beforeAll(async (done) => {
    jest.setTimeout(10000)
    try {
        const url = 'mongodb://localhost:27017/testDB'
          await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
          console.log ("connected");
    } catch (e) {
          console.log("error connecting to DB: ", e.message);
    }
    // const url = 'mongodb://localhost:27017/testDB'
    // await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

    await makeAccounts(done);
})

afterAll((done) => {
    mongoose.connection.db.dropCollection('sessions');
    mongoose.connection.db.dropCollection('users');
    done()
})

var userID
describe('Update patient info', () => {
    var rq, user;
    
    it('Login', loginUser())

    it('Should save patient to database', async done => {
        const res = await request.post('/editProfile')
        .field('firstname', 'test')
        .field('lastname', 'update')
        .field('email', 'test@gmail.com')
        .field('age', '20')
        .field('weight', '150')
        .field('height', '50')
        
        expect(res.status).toBe(200);
        done();
    })

    it('Should update user info', async done => {
        var user;
        user = await User.findOne( {email: "test@gmail.com"} );
        expect(user.email).toBeTruthy();
        expect(user.lastname).toBe('update');
        done();
    })

    it('User Logout', logout())
})

function loginUser() {
    return async done => {
        try {
            await request.        
                post('/').type('form').send({
                    email: 'test@gmail.com',
                    password: 'test'
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

async function makeAccounts(done) {
    /*  INSERT USER  */
    try {
        bcrypt.hash(`test`, saltRounds, async (err, hash) => {
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

            await User.findOne({}, '_id', function(err, res) {
                userID = res._id
            })

            done()
        })
    } catch (ex) {
        console.log(ex)
    }
}