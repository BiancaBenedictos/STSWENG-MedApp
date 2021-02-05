var toDelete;

function addClinic() {
    $(".form-control").css("border-color", "lightgray");
    
    var newclinic = {
        clinicName: $("#clinic-name").val().trim(),
        clinicAddress: {
            street: $("#street").val().trim(),
            city: $("#city").val().trim(),
            state: $("#state").val().trim()
        }
    }

    if (newclinic.clinicName != "" & newclinic.clinicAddress.street != "" &
        newclinic.clinicAddress.city != "" & newclinic.clinicAddress.state != "") {
        console.log(newclinic);

        $.post('/addClinic', {newclinic: newclinic}, function(result){
            $("#add-clinic").modal('hide')
            
            $(".msg-header").text("Add Clinic");
            if (result) {
                $(".msg-body").text("Clinic " + newclinic.clinicName + " successfully added.")
            }
            else {
                $(".msg-body").text("Something went wrong. Adding clinic " + newclinic.clinicName + " to database failed.")
            }

            $("#process-message").modal('show')
        });
    } else {
        if (newclinic.clinicName == "")
            $("#clinic-name").css("border-color", "red");
        if (newclinic.clinicAddress.street == "")
            $("#street").css("border-color", "red");
        if (newclinic.clinicAddress.city == "")
            $("#city").css("border-color", "red");
        if (newclinic.clinicAddress.state == "")
            $("#state").css("border-color", "red");
    }
}

function setDelete(id) {
    toDelete = id;
}

function unsetDelete() {
    toDelete = '';
}

function deleteClinic() {
    $.post('/deleteClinic', {id: toDelete}, function(result){
        $("#confirm-delete").modal('hide')

        $(".msg-header").text("Delete Clinic");
        if (result) {
            $(".msg-body").text("Clinic successfully deleted.")
        }

        $("#process-message").modal('show')
    })
}

function refresh() {
    location.reload();
}

$(document).ready(function() {
    $(".doctors-0").prop('disabled', false);

    $("#process-message").on('hide.bs.modal', function(e) {
        refresh();
    })
})