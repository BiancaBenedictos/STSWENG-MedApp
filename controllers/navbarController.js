const db = require('../models/db.js');
const User = require('../models/userModel.js');

const navbarController = {
    getName: function(req, res){
        // res.send(req.session.firstname);

        var id = '5fb59a0731422020ec5fb2e2'
        db.findOne(User, {_id: id}, null, function(user) {

            res.send(user.firstname + " " + user.lastname)
        })

    }
}

module.exports = navbarController