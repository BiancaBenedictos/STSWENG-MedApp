function addClinic() {
    $(".form-control").css("border-color", "lightgray");
    
    var newclinic = {
        name: $("#clinic-name").val(),
        address: $("#address").val()
    }

    if (newclinic.name != "" & newclinic.address != "") {
        console.log(newclinic);
    } else {
        if (newclinic.name == "")
            $("#clinic-name").css("border-color", "red");
        if (newclinic.address == "")
            $("#address").css("border-color", "red");
    }
}

$(document).ready(function() {
    console.log("CONNECTED")
})