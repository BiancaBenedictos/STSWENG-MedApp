$(document).ready(function() {

    var file = document.getElementById('credentials');

    file.onchange = function (e) {
        var ext = this.value.match(/\.([^\.]+)$/)[1];
        switch (ext) {
            case 'pdf':
                document.getElementById('credentialserror').innerHTML = ''
                break;
            default:
                document.getElementById('credentialserror').innerHTML = 'The file that you are trying to upload is not a pdf. Try again.'
                this.value = '';
        }
    };
})

// function isFilled() {
    //     var firstname = validator.trim($("#firstname").val());
    //     var lastname = validator.trim($("#lastname").val());
    //     var email = validator.trim($("#email").val());
    //     var password = validator.trim($("#password").val());
    //     var cpassword = validator.trim($("#cpassword").val());
        
    //     var firstnameEmpty = validator.isEmpty(firstname);
    //     var lastnameEmpty = validator.isEmpty(lastname);
    //     var emailEmpty = validator.isEmpty(email);
    //     var passwordEmpty = validator.isEmpty(password);
    //     var cpasswordEmpty = validator.isEmpty(cpassword);

    //     if(document.getElementById('doctorCheck').checked == true) docCheck = true
    //     else docCheck = false

    //     if(!docCheck) {
    //         var age = validator.trim($("#age").val());
    //         var weight = validator.trim($("#weight").val());
    //         var height = validator.trim($("#height").val());
    
    //         var ageEmpty = validator.isEmpty(age);
    //         var weightEmpty = validator.isEmpty(weight);
    //         var heightEmpty = validator.isEmpty(height);
            
    //         return !emailEmpty && !passwordEmpty && !firstnameEmpty && !lastnameEmpty && !cpasswordEmpty && !ageEmpty && !weightEmpty && !heightEmpty;
    //     }

    //     return !emailEmpty && !passwordEmpty && !firstnameEmpty && !lastnameEmpty && !cpasswordEmpty && !credentialsEmpty;
    // }
    
    // document.getElementById('picture').onblur = function() {
    //     document.getElementById("invalidPic").innerHTML = "";

    //     var valid = [".jpg", ".jpeg", ".png"]
    //     var input = document.getElementById("picture")
    //     if(input.type == 'file') {
    //         var filename = input.value
    //         if(filename.length > 0) {
    //             var isValid = false
    //             for(var i = 0; i < valid.length; i++) {
    //                 var ext = valid[i]
    //                 if(filename.substr(filename.length - ext.length, ext.length).toLowerCase() == ext.toLowerCase()) {
    //                     isValid = true
    //                     break
    //                 }
    //             }
    //             if(!isValid) {
    //                 document.getElementById("invalidPic").innerHTML = "Please upload a valid image file";
    //             }
    //         }
    //     }
    // }

    // document.getElementById('credentials').onblur = function() {
    //     if(document.getElementById("credentials").files.length == 0) {
    //         credentialsEmpty = true
    //         document.getElementById("noCreds").innerHTML = "Please upload your credentials";
    //         $("#submitbtn").prop('disabled', true);
    //     }
    //     else {
    //         document.getElementById("noCreds").innerHTML = "";
    //         $("#submitbtn").prop('disabled', false);

    //         var valid = [".pdf"]
    //         var input = document.getElementById("credentials")
    //         if(input.type == 'file') {
    //             var filename = input.value
    //             if(filename.length > 0) {
    //                 var isValid = false
    //                 for(var i = 0; i < valid.length; i++) {
    //                     var ext = valid[i]
    //                     if(filename.substr(filename.length - ext.length, ext.length).toLowerCase() == ext.toLowerCase()) {
    //                         isValid = true
    //                         break
    //                     }
    //                 }
    //                 if(!isValid) {
    //                     document.getElementById("noCreds").innerHTML = "Please upload a PDF file";
    //                     $("#submitbtn").prop('disabled', true);
    //                 }
    //             }
    //         }
    //     }
    // }

    // function isValidEmail(field, callback) {
    //     var email = validator.trim($('#email').val());
    //     var isValidEmail = validator.isEmail(email);
     
    //     if(isValidEmail) {
    //         $.get('/getCheckEmail', {email: email}, function (result) {
    //             if(result.email != email && !validator.isEmpty(email)) {

    //                 if(field.is($('#email'))) {
    //                     $('#email').removeClass('is-invalid');
    //                     $('#email').addClass('is-valid');
    //                     console
    //                 }
    //                return callback(true);
                   
    //             }
    //             else {
    //                 if(field.is($('#email'))) {
    //                     $('#email').removeClass('is-valid');
    //                     $('#email').addClass('is-invalid');

    //                 }

    //                 return callback(false);
    //             }
    //         });
    //     }
    //     else {
    //         if(field.is($('#email'))) {

    //            if(validator.isEmpty(email)) {
    //                 if(field.is($('#email'))) {
    //                     $('#email').removeClass('is-valid');
    //                     $('#email').addClass('is-invalid');
    //                 }
    //             }
    //             else {
    //                 $('#email').removeClass('is-valid');
    //                 $('#email').addClass('is-invalid');
    //             }
    //         }
    //         return callback(false);
    //     }
    // }

    // function isValidPassword(field) {
    //     var password = validator.trim($('#password').val());
    //     var confirmpassword = validator.trim($('#cpassword').val());
    //     if(password == confirmpassword && (!validator.isEmpty(password) && !validator.isEmpty(confirmpassword))){ // cpass matches pass
    //         if(field.is($('#cpassword'))) {
    //             $('#password').removeClass('is-invalid');
    //             $('#password').addClass('is-valid');
    //             $('#cpassword').removeClass('is-invalid');
    //             $('#cpassword').addClass('is-valid');
    //             $("#submitbtn").prop('disabled', false);
    //         }
    //         return true;
    //     }
    //     else{
    //         if(field.is($('#cpassword'))) {
    //             $('#password').removeClass('is-valid');
    //             $('#password').addClass('is-invalid');
    //             $('#cpassword').removeClass('is-valid');
    //             $('#cpassword').addClass('is-invalid');
    //             $("#submitbtn").prop('disabled', true);
    //         }
    //         return false;
    //     }
    // }

    // function validateField(field){
    //     var value = validator.trim(field.val());
    //     var empty = validator.isEmpty(value);

    //     if(!empty){
    //         field.removeClass('is-invalid');
    //         field.addClass('is-valid');
    //         var pass = isValidPassword(field);
    //         isValidEmail(field, function(validEmail) {
    //             if(isFilled() && pass && validEmail){
    //                 $("#submitbtn").prop('disabled', false);
    //             }
    //             else {
    //                 $("#submitbtn").prop('disabled', true);
    //             }
    //         })
    //     }
    //     else{
    //         field.removeClass('is-valid');
    //         field.addClass('is-invalid');
    //     }
    // }

    // function validateNumber(field){
    //     var value = validator.trim(field.val());

    //     if (value > 0)
    //     {
    //         field.removeClass('is-invalid');
    //         field.addClass('is-valid');
    //     }
    //     else {
    //         field.removeClass('is-valid');
    //         field.addClass('is-invalid');
    //     }
    // }

    // $("#firstname").keyup(function(){
    //     validateField($('#firstname'));
    // })
    // $("#lastname").keyup(function(){
    //     validateField($('#lastname'))
    // })
    // $("#email").keyup(function(){
    //     validateField($('#email'));
    // })
    // $("#password").keyup(function(){
    //     validateField($('#password'))
    // })
    // $("#cpassword").keyup(function(){
    //     validateField($('#cpassword'))
    // })
    // $("#age").keyup(function(){
    //     validateField($('#age')),
    //     validateNumber($('#age'))
    // })
    // $("#weight").keyup(function(){
    //     validateField($('#weight')),
    //     validateNumber($('#weight'))
    // })
    // $("#height").keyup(function(){
    //     validateField($('#height')),
    //     validateNumber($('#height'))
    // })

    // document.getElementById('doctorCheck').onclick = function() {
    //     var checkBox = document.getElementById("doctorCheck")
    //     var text = document.getElementById("doctorFields")

    //     if (checkBox.checked == true){
    //         $("#patient").hide();
    //         text.style.display = "block"
            
    //     } else {
    //         $("#patient").show();
    //         text.style.display = "none"
            
    //     }
    // }