function changePassword() {
    var oldPass = $("#oldPassword").val()
    var newPass = $("#newPassword").val()

    $.post('/changePassword', {oldPassword: oldPass, newPassword: newPass}, function(result) {
        $("#change-password").modal('hide')
            
        $(".msg-header").text("Change Password");
        if(result == 'empty') {
            $(".msg-body").text("You cannot have an empty password.")
        }
        else if(result) {
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
    $("#process-message").on('hide.bs.modal', function(e) {
        refresh();
    })
})