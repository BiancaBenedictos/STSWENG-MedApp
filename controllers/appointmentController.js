const appointmentController = {
	upcomingAppointments: function(req,res){
		res.render('appointments-upcoming')
    },
    
	pendingAppointments: function(req,res){
		res.render('appointments-pending')
    },
    
	concludedAppointments: function(req,res){
		res.render('appointments-concluded')
    },
    
	cancelledAppointments: function(req,res){
		res.render('appointments-cancelled')
    },

    bookAppointment: function(req,res){
        res.render('book-appointment')
    }
}

module.exports = appointmentController