var doctorId
var doctorClinics

function acceptDoctor() {
    $.post('/acceptDoctor', {id: doctorId, clinics: doctorClinics}, function(result){
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

function setClinics(clinics) {
    res = clinics.split(',')
    doctorClinics = res
}