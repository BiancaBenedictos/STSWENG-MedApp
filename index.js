const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const routes = require('./routes/routes.js');
const db = require('./models/db.js');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express()

app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/views'))
hbs.registerPartials(__dirname + '/views/partials')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.urlencoded({extended:true}))

app.use(express.static('public'))

app.use(session({
    'secret': 'med-aid-session',
    'resave': false,
    'saveUninitialized': false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

app.use('/', routes)

/*
app.use(function(req,res) {
    res.render('error')
})
*/

const url = 'mongodb://localhost:27017/local_library'
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

// mongoose.connect(url, options, err => {
//     if (err) throw err;
//     console.log('connected at ' + url);
// });

db.connect();
const port = process.env.PORT || 3000

// app.listen(port, function() {
//     console.log('App listening at port ' + port)
// })

module.exports = app;