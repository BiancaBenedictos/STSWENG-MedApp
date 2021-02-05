function changePassword() {
    var oldPass = $("#oldPassword").val()
    var newPass = $("#newPassword").val()

    $.post('/changePassword', {oldPassword: oldPass, newPassword: newPass}, function(result) {
        $("#change-password").modal('hide')
            
        $(".msg-header").text("Change Password");
        if (result) {
            $(".msg-body").text("Your password has been changed!")
        }
        else {
            $(".msg-body").text("The password you entered was incorrect.")
        }

        $("#process-message").modal('show')
    })
}

function refresh() {
    location.reload();
}

$(document).ready(function() {
    $("form").submit(function(evt){	 
            evt.preventDefault();
            var formData = new FormData($(this)[0]);
        $.ajax({
            url: '/editProfile',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
            success: function (response) {
                $(".msg-header").text("Edit Profile");
                if(response == true) {
                    $(".msg-body").text("Your profile has been updated!")
                }
                else if(response == 'email') {
                    $(".msg-body").text("That email is already registered with a different account! No changes were made.")
                }
                else if(response == 'no email') {
                    $(".msg-body").text("You cannot leave your email blank.")
                }
                else if(response == 'name') {
                    $(".msg-body").text("You cannot leave your name blank.")
                }
                else if(response == 'age') {
                    $(".msg-body").text("Please make sure your inputs are valid. You cannot enter a negative value or leave your age blank.")
                }
                else if(response == 'weight') {
                    $(".msg-body").text("Please make sure your inputs are valid. You cannot enter a negative value or leave your weight blank.")
                }
                else if(response == 'height') {
                    $(".msg-body").text("Please make sure your inputs are valid. You cannot enter a negative value or leave your height blank.")
                }
                else {
                    $(".msg-body").text("No changes were made! Your profile was not updated.")
                }
                $("#process-message").modal('show')
            },
            // fail: function(response) {
            //     alert("Server error")
            // }
        });
    })
    $("#process-message").on('hide.bs.modal', function(e) {
        refresh();
    })
})