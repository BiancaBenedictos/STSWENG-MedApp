const navbarController = {
    getDetails: function(req, res) {
        res.send(req.session)
    }
}

module.exports = navbarController