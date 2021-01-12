function saveChanges() {
    // check for empty

    var emptyFields = $('input:text').filter(function() { return $(this).val() == "" || $(this).val().trim() == ""; });
    var clinics = $("select[name='clinics[]']").map(function() { return $(this).val()}).get()

    if (emptyFields.length > 0 && clinics.length <= 0 && validator.isEmail($("#email").val()))
        return;
    
    var info = {
        firstname: $("input#firstname").val(),
        lastname: $("input#lastname").val(),
        email: $("input#email").val(),
        profession: $("select#profession").val(),
        clinics: clinics
    }   

    // get files

    var profpic = $("input#picture")[0].files
    if (profpic.length > 0) {
        info.profpic = profpic[0]
    } else if ('profpic' in info) {
        delete info.profpic
    }

    var credentials = $("input#credentials")[0].files
    if (credentials.length > 0) {
        info.credentials = credentials[0]
    } else if ('credentials' in info) {
        delete info.credentials
    }

    // post
    $.post('/editProfile', {info: info}, function(res) {
        console.log(res)
    })
}

$(document).ready(function(){    
    $('input[type="text"]').blur(function(){
        if(this.tagName != 'INPUT')
            return;

        if(!$(this).val() || !$(this).val().trim()){
            $(this).css('border-color', 'red');
        } else{
            $(this).css("border-color", 'lightgray');
        }
    });

    $('#email').blur(function(){
        if(this.tagName != 'INPUT')
            return;

        if(!validator.isEmail($("#email").val())){
            $('#email').css('border-color', 'red');
        } else{
            $('#email').css("border-color", 'lightgray');
        }
    });
});