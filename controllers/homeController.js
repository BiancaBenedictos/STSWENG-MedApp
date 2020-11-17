const homeController = {
	doctors: function(req,res){
		res.render('home-doctors')
    },
    
	clinics: function(req,res){
		res.render('home-clinics')
    },
    
    viewDoctors: function(req,res){
        res.render('view-doctors')
    }
}

module.exports = homeController