var toCancel;
// var patientId;
// var doctorId;

// function setUser(id) {
//     patientId = id;
// }

// function unsetUser() {
//     patientId = '';
// }

// function setDoctor(id) {
//     doctorId = id;
// }

// function unsetDoctor() {
//     doctorId = '';
// }

function setCancel(id) {
    toCancel = id;
}

function unsetCancel() {
    toCancel = '';
}

function cancelAppointment() {
    // $.post('/cancelAppointment', {id: toCancel, patient: patientId, doctor: doctorId}, function(result){
    $.post('/cancelAppointment', {id: toCancel}, function(result){
        
        $("#confirm-cancel").modal('hide')

        $(".msg-header").text("Cancel Appointment");
        if (result) {
            $(".msg-body").text("Appointment successfully cancelled.")
        }

        $("#process-message").modal('show')
    })
}

function refresh() {
    location.reload();
}

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

    $("#process-message").on('hide.bs.modal', function(e) {
        refresh();
    })
});
