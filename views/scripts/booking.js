var userId;

function acceptbook() {
    window.alert(userId);
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