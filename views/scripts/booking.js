var userId;

function acceptbook() {
    $.post('/acceptAppointment', {id: userId}, function(result){
        if (result)
            location.reload();
    })
}

function rejectbook() {
    $.post('/acceptAppointment', {id: userId}, function(result){
        if (result)
            location.reload();
    })
}

function setId(id) {
    userId = id;
}

function unsetId() {
    userId = '';
}