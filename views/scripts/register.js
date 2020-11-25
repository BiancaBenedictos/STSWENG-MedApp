$(document).ready(function() {
    document.getElementById('doctorCheck').onclick = function() {
        var checkBox = document.getElementById("doctorCheck")
        var text = document.getElementById("doctorFields")
        // var patient = document.getElementById("patient")

        if (checkBox.checked == true){
            text.style.display = "block"
            // patient.style.display = "none"
        } else {
            text.style.display = "none"
            // patient.style.display = "flex"
        }
    }

    document.getElementById('registerClinic').onclick = function() {
        var input = document.createElement("input")
        input.id = "clinic"
        input.className = "form-control"

        document.getElementById("addRowsHere").appendChild(input)
    }
})