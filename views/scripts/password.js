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

function editProfile() {
    // var profpic = ''

    // var fullPath = document.getElementById('picture').value;
    // if (fullPath) {
    //     var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
    //     var filename = fullPath.substring(startIndex);
    //     if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
    //         filename = filename.substring(1);
    //     }
    //     profpic = 'images/' + filename
    // }
    
    var newInfo = {
        firstname: $("#firstname").val(),
        lastname: $("#lastname").val(),
        email: $("#email").val(),
        // profpic: profpic,
        // profpic: $("#picture").val(),
        age: $("#age").val(),
        weight: $("#weight").val(),
        height: $("#height").val()
    }

    $.post('/editProfile', newInfo, function(result) {
        $(".msg-header").text("Edit Profile");
        if (result) {
            $(".msg-body").text("Your profile has been updated!")
        }
        else {
            $(".msg-body").text("Your profile was not updated!")
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