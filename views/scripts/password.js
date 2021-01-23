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
                if(response) {
                    $(".msg-body").text("Your profile has been updated!")
                }
                else {
                    $(".msg-body").text("Your profile was not updated!")
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