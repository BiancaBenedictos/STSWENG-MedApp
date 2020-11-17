const adminController = {
	clinics: function(req,res){
		res.render('admin-clinics')
    },
    
	doctors: function(req,res){
		res.render('admin-doctors')
    },
    
	pending: function(req,res){
		res.render('admin-pending')
	}
}

module.exports = adminController