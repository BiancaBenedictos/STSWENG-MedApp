const express = require('express')
const hbs = require('hbs')
const routes = require('./routes/routes.js')
const db = require('./models/db.js')
const mongoose = require('mongoose')
const session = require('express-session')

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/views'))
hbs.registerPartials(__dirname + '/views/partials')

app.use(express.urlencoded({extended:true}))

app.use(express.static('public'))

// app.use(session({
//     'secret': 'med-aid-session',
//     'resave': false,
//     'saveUninitialized': false,
//     store: new MongoStore({mongooseConnection: mongoose.connection})
// }));

app.use('/', routes)

app.use(function(req,res) {
    res.render('error')
})

// db.connect();

app.listen(port, function() {
    console.log('App listening at port ' + port)
})