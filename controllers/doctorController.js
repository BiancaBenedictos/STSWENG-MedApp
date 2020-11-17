const doctorController = {
	pendingAppointments: function(req,res){
		res.render('doctor-appointments-pending')
    },
    
	createAppointments: function(req,res){
		res.render('create-appointments')
    }
}

module.exports = doctorController