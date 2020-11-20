$(document).ready(function() {
    document.getElementById('doctorCheck').onclick = function() {
        var checkBox = document.getElementById("doctorCheck")
        var text = document.getElementById("doctorFields")

        if (checkBox.checked == true){
            text.style.display = "block"
        } else {
            text.style.display = "none"
        }
    }

    document.getElementById('registerClinic').onclick = function() {
        var input = document.createElement("input")
        input.id = "clinic"
        input.className = "form-control"

        document.getElementById("addRowsHere").appendChild(input)
    }
})