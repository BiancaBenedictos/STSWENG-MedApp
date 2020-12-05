$(document).ready(function() {
    $.get('/getDetails', null, function(result) {
        if(result.type == 'user') {
            var string = 'Age: ' + result.age + '\nWeight: ' + result.weight + '\nHeight: ' + result.height
            $("#user-info").text(string)

            $('.doctor').prop('hidden', true);

            var link = document.getElementById('pending');
            link.setAttribute('href', '/pendingAppointments');
        }
        if(result.type == 'doctor') {
            $("#user-info").text(result.profession)

            $('.user').prop('hidden', true);

            var link = document.getElementById('pending')
            link.setAttribute('href', '/pendingAppointments');
            // link.setAttribute('href', '/doctorPendingAppointments')

        }
    });
});
