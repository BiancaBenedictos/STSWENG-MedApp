$(document).ready(function() {
    $.get('/getDetails', null, function(result) {
        if(result.type == 'user') {
            $('#doctor-pending').prop('hidden', true);
            $('#doctor-info').prop('hidden', true);
        }
        if(result.type == 'doctor') {
            $('#user-pending').prop('hidden', true);
            $('#user-info').prop('hidden', true);
        }
    });
});
