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

    it('Check Updated Patient', async done => {
        try {
            await User.findOne({_id:userID}, null, async function(err, res) {
                rq = {
                    info: {
                        email: 'test@gmail.com',
                        firstname: "test",
                        lastname: "update",
                        profpic: "images/test.png",
                        age: 20,
                        height: 150,
                        weight: 50
                    }
                }

                const editProf = await request.        
                    post('/editProfile').type('form').send(rq)

                await User.findOne({ email: 'test@gmail.com' }, 'email firstname lastname profpic age height weight', function(err, result) {
                    user = result._id.toString();
                    delete result._id
                    expect(rq.info).toMatchObject(result)
                    done()
                }).lean()    
            })
        } catch (e) {
            console.log(e)
        }
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