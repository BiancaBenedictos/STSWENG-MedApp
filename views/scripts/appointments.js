$(document).ready(function() {
    $.get('/getDetails', null, function(result) {
        if(result.type == 'user') {
            var string = 'Age: ' + result.age + '\nWeight: ' + result.weight + '\neight: ' + result.height
            
            $("#user-info").text(string)

            var link = document.getElementById('pending');
            link.setAttribute('href', '/pendingAppointments');
        }
        if(result.type == 'doctor') {
            $("#user-info").text(result.profession)

            var link = document.getElementById('pending')
            link.setAttribute('href', '/doctorPendingAppointments')

        }
    });
});
