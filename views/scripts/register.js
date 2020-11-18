$(document).ready(function() {
    console.log("hello")
    document.getElementById('doctorCheck').onclick = function() {
        var checkBox = document.getElementById("doctorCheck")
        var text = document.getElementById("doctorFields")

        if (checkBox.checked == true){
            text.style.display = "block"
        } else {
            text.style.display = "none"
        }
    }

    document.getElementById('addClinic').onclick = function() {
        var values = ["Clinic 1", "Clinic 2", "Clinic 3"]

        var select = document.createElement("select")
        select.id = "clinic"
        select.className = "form-control"

        for (const val of values) {
            var option = document.createElement("option")
            option.value = val
            option.text = val.charAt(0).toUpperCase() + val.slice(1)
            select.appendChild(option)
        }

        document.getElementById("addRowsHere").appendChild(select)
    }
    
    document.getElementById('registerClinic').onclick = function() {
        var input = document.createElement("input")
        input.id = "clinic"
        input.className = "form-control"

        document.getElementById("addRowsHere").appendChild(input)
    }
})