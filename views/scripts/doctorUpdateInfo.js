function saveChanges() {
    // check for empty

    var emptyFields = $('input:text').filter(function() { return $(this).val() == "" || $(this).val().trim() == ""; });
    var clinics = $("select[name='clinics[]']").map(function() { return $(this).val()}).get()

    if (clinics.length <= 0) {
        $("#addClinic").css('border-color', 'red')
    } else {
        $("#addClinic").css('border-color', 'lightgray')
    }

    if (emptyFields.length > 0 || clinics.length <= 0 || !validator.isEmail($("#email").val()))
        return;
    else 
        $("#updateForm").submit()
}

function refresh() {
    location.reload();
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

    $("form").submit(function(evt){	 
        evt.preventDefault();
        console.log($("#updateForm"))
        var formData = new FormData($("#updateForm")[0]);
    $.ajax({
        url: '/editProfile',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        success: function (res) {
            $(".msg-header").text("Update Profile Information");
            if (res) {
                $(".msg-body").text(res)
            }
    
            $("#process-message").modal('show')
            }
        })
    })

});