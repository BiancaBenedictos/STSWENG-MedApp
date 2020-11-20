var doctorId

function acceptDoctor() {
    $.post('/acceptDoctor', {id: doctorId}, function(result){
        if (result)
            location.reload();
    })
}

function rejectDoctor() {
    $.post('/rejectDoctor', {id: doctorId}, function(result){
        if (result)
            location.reload();
    })
}

function setId(id) {
    doctorId = id;
}

function unsetId() {
    doctorId = '';
}