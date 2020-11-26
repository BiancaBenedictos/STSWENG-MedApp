const navbarController = {
    getDetails: function(req, res){
        // var details = {
        //     name: req.session.name,
        //     type: req.session.type
        // }
        // res.send(details);
        res.send(req.session)
    }
}

module.exports = navbarController