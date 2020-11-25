$(document).ready(function() {
    var docCheck
    var credentialsEmpty

    function isFilled() {
        var firstname = validator.trim($("#firstname").val());
        var lastname = validator.trim($("#lastname").val());
        var email = validator.trim($("#email").val());
        var password = validator.trim($("#password").val());
        var cpassword = validator.trim($("#cpassword").val());
        
        var firstnameEmpty = validator.isEmpty(firstname);
        var lastnameEmpty = validator.isEmpty(lastname);
        var emailEmpty = validator.isEmpty(email);
        var passwordEmpty = validator.isEmpty(password);
        var cpasswordEmpty = validator.isEmpty(cpassword);

        if(document.getElementById('doctorCheck').checked == true) docCheck = true
        else docCheck = false

        if(!docCheck) {
            var age = validator.trim($("#age").val());
            var weight = validator.trim($("#weight").val());
            var height = validator.trim($("#height").val());
    
            var ageEmpty = validator.isEmpty(age);
            var weightEmpty = validator.isEmpty(weight);
            var heightEmpty = validator.isEmpty(height);
            
            return !emailEmpty && !passwordEmpty && !firstnameEmpty && !lastnameEmpty && !cpasswordEmpty && !ageEmpty && !weightEmpty && !heightEmpty;
        }

        return !emailEmpty && !passwordEmpty && !firstnameEmpty && !lastnameEmpty && !cpasswordEmpty && !credentialsEmpty;
    }

    document.getElementById('credentials').onblur = function() {
        if(document.getElementById("credentials").files.length == 0) credentialsEmpty = true
        else credentialsEmpty = false

        if(!credentialsEmpty) {
            document.getElementById("noCreds").innerHTML = "";
            $("#submitbtn").prop('disabled', false);
        }
        else {
            document.getElementById("noCreds").innerHTML = "Please upload your credentials";
            $("#submitbtn").prop('disabled', true);
        }
    }

    function isValidEmail(field, callback) {
        var email = validator.trim($('#email').val());
        var isValidEmail = validator.isEmail(email);
     
        if(isValidEmail) {
            $.get('/getCheckEmail', {email: email}, function (result) {
                if(result.email != email && !validator.isEmpty(email)) {

                    if(field.is($('#email'))) {
                        $('#email').removeClass('is-invalid');
                        $('#email').addClass('is-valid');
                        console
                    }
                   return callback(true);
                   
                }
                else {
                    if(field.is($('#email'))) {
                        $('#email').removeClass('is-valid');
                        $('#email').addClass('is-invalid');

                    }

                    return callback(false);
                }
            });
        }
        else {
            if(field.is($('#email'))) {

               if(validator.isEmpty(email)) {
                    if(field.is($('#email'))) {
                        $('#email').removeClass('is-valid');
                        $('#email').addClass('is-invalid');
                    }
                }
                else {
                    $('#email').removeClass('is-valid');
                    $('#email').addClass('is-invalid');
                }
            }
            return callback(false);
        }
    }

    function isValidPassword(field) {
        var password = validator.trim($('#password').val());
        var confirmpassword = validator.trim($('#cpassword').val());
        if(password == confirmpassword && (!validator.isEmpty(password) && !validator.isEmpty(confirmpassword))){ // cpass matches pass
            if(field.is($('#cpassword'))) {
                $('#password').removeClass('is-invalid');
                $('#password').addClass('is-valid');
                $('#cpassword').removeClass('is-invalid');
                $('#cpassword').addClass('is-valid');
                $("#submitbtn").prop('disabled', false);
            }
            return true;
        }
        else{
            if(field.is($('#cpassword'))) {
                $('#password').removeClass('is-valid');
                $('#password').addClass('is-invalid');
                $('#cpassword').removeClass('is-valid');
                $('#cpassword').addClass('is-invalid');
                $("#submitbtn").prop('disabled', true);
            }
            return false;
        }
    }

    function validateField(field){
        var value = validator.trim(field.val());
        var empty = validator.isEmpty(value);

        if(!empty){
            field.removeClass('is-invalid');
            field.addClass('is-valid');
            var pass = isValidPassword(field);
            isValidEmail(field, function(validEmail) {
                if(isFilled() && pass && validEmail){
                    $("#submitbtn").prop('disabled', false);
                }
                else {
                    $("#submitbtn").prop('disabled', true);
                }
            })
        }
        else{
            field.removeClass('is-valid');
            field.addClass('is-invalid');
        }
    }

    $("#firstname").keyup(function(){
        validateField($('#firstname'));
    })
    $("#lastname").keyup(function(){
        validateField($('#lastname'))
    })
    $("#email").keyup(function(){
        validateField($('#email'));
    })
    $("#password").keyup(function(){
        validateField($('#password'))
    })
    $("#cpassword").keyup(function(){
        validateField($('#cpassword'))
    })
    $("#age").keyup(function(){
        validateField($('#age'))
    })
    $("#weight").keyup(function(){
        validateField($('#weight'))
    })
    $("#height").keyup(function(){
        validateField($('#height'))
    })

    document.getElementById('doctorCheck').onclick = function() {
        var checkBox = document.getElementById("doctorCheck")
        var text = document.getElementById("doctorFields")

        if (checkBox.checked == true){
            text.style.display = "block"
            $("#patient").hide();
        } else {
            text.style.display = "none"
            $("#patient").show();
        }
    }

    document.getElementById('registerClinic').onclick = function() {
        var input = document.createElement("input")
        input.id = "clinic"
        input.className = "form-control"

        document.getElementById("addRowsHere").appendChild(input)
    }
})