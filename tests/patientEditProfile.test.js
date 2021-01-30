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
    const url = 'mongodb://localhost:27017/testDB'
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    await makeAccounts(done);
})

afterAll((done) => {
    mongoose.connection.db.dropCollection('sessions');
    mongoose.connection.db.dropCollection('users');
    done()
})

var userID1, userID2
describe('Update patient info', () => {
    
    it('Login', loginUser())

    it('Should update user info', async done => {
        const res = await request.post('/editProfile')
            .field('firstname', 'test')
            .field('lastname', 'update')
            .field('email', 'test@gmail.com')
            .field('age', '20')
            .field('weight', '150')
            .field('height', '50')

        var user = await User.findOne( {email: "test@gmail.com"} );
        expect(user.email).toBeTruthy();
        expect(user.lastname).toBe('update');
        expect(user.weight).toBe(150);
        done();
    })

    it('Should not update user info', async done => {
        const res = await request.post('/editProfile')
            .field('firstname', 'test')
            .field('lastname', 'update')
            .field('email', 'test2@gmail.com')
            .field('age', '20')
            .field('weight', '180')
            .field('height', '50')

        // check if user with email "test@gmail.com" still exists --> did not change email
        var user = await User.findOne( {email: "test@gmail.com"} );
        expect(user.email).toBeTruthy();
        expect(user.lastname).toBe('update');

        // check user with email "test2@gmail.com"
        var user2 = await User.findOne({email: "test2@gmail.com"})
        expect(user2.lastname).toBe('two')
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
    try {
        bcrypt.hash(`test`, saltRounds, async (err, hash) => {
            await User.create({
                email: 'test@gmail.com',
                password: hash,
                firstname: "test",
                lastname: "one",
                profpic: "images/test.png",
                bookedAppointments: [],
                age: 20,
                height: 180,
                weight: 50
            })

            await User.findOne({email:'test@gmail.com'}, '_id', function(err, res) {
                userID1 = res._id
            })
            done()
        })

        bcrypt.hash(`test`, saltRounds, async (err, hash) => {
            await User.create({
                email: 'test2@gmail.com',
                password: hash,
                firstname: "test",
                lastname: "two",
                profpic: "images/test.png",
                bookedAppointments: [],
                age: 20,
                height: 180,
                weight: 50
            })

            await User.findOne({email:'test2@gmail.com'}, '_id', function(err, res) {
                userID2 = res._id
            })
            done()
        })
    } catch (ex) {
        console.log(ex)
    }
}