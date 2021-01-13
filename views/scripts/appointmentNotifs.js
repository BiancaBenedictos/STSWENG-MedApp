$(document).ready(function() {
    $.get('/getAppointmentNotifs', null, function(result) {
        console.log(result)
        
        $("#pendingCount").text(result.pendingCount)
        $("#upcomingCount").text(result.upcomingCount)
    })
})