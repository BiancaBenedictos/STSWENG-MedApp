const userController = {
	login: function(req,res){
		res.render('login')
	},
    
	userRegister: function(req,res){
		res.render('user-register')
	},
    
	doctorRegister: function(req,res){
		res.render('doctor-register');
	}
}

module.exports = userController