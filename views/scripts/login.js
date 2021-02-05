$(document).ready(function() {
    function isFilled() {
        var email = validator.trim($("#email").val());
        var password = validator.trim($("#password").val());

        var emailEmpty = validator.isEmpty(email);
        var passwordEmpty = validator.isEmpty(password);

        return !emailEmpty && !passwordEmpty;
    }

    function isValidUser(callback) {
        var email = validator.trim($('#email').val());
        var password = validator.trim($('#password').val());
        
        $.get('/getCheckLogin', {email: email, password: password}, function (result) {
            return callback(result);
        });
    }

    function validateField(field){
        var value = validator.trim(field.val());
        var empty = validator.isEmpty(value);
        if(!empty){
            isValidUser(function (validUser){
                if(validUser && isFilled()){
                    $("#submitlogin").prop('disabled', false);
                    $("#msg").text("");
                }
                else {
                    $("#submitlogin").prop('disabled', true);
                    $("#msg").text("The username or password is not valid");
                }
            })
        }
        else{
            $("#msg").text("Username or password should not be empty");
        }
    }

    $("#email").keyup(function(){
        validateField($('#email'));
    })

    $("#password").keyup(function(){
        validateField($('#password'))
    })
});