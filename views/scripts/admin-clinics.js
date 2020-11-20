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
            if (result)
                location.reload();
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

$(document).ready(function() {
    console.log("CONNECTED")
})