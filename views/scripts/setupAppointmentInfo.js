var checked = [], redirect = false;

function save() {
    checked = []

    $('input:checked').each(function(){
        checked.push($(this).attr('id'));
    })

    if (checkTimeInterval())
        getAvail();
}

function checkTimeInterval() {
    var valid = 1;
    $("select").css('border-color', 'lightgray')

    for (i=0; i<checked.length; i++) {
        var start = $("." + checked[i] + "#starttime");
        var end = $("." + checked[i] + "#endtime");
        if (start[0].selectedIndex >= end[0].selectedIndex) {
            valid = 0;
            start.css('border-color', 'red')
            end.css('border-color', 'red')
        }
    }

    return valid;
}

function getAvail() {
    var avail = []
    redirect = false;
    
    for (i=0; i<checked.length; i++) {
        avail.push({
            clinicID: $("#clinic").val(),
            day: checked[i],
            startTime: $("." + checked[i] + "#starttime").val(),
            endTime: $("." + checked[i] + "#endtime").val(),
            intervalHours: $("#interval").val()
        })
    }    
    
    console.log(avail)
    $.post('/setAvailability', {avail:avail}, function(result){
        if (result) {
            redirect = true;
            $(".msg-body").text("Appointment hours successfully updated.")
        }
        else 
            $(".msg-body").text("Something went wrong. Please try again.")

        $("#process-message").modal('show')
    })
}

function updateHours() {
    $("input").prop('checked', false);
        $("[class$='day']").each(function(){
            $(this).val(8)
        })

        $.get('/getClinicHours', {clinicID: $("#clinic").val()}, function(results){
            $("#interval").val(results[0].interval);
            for (i=0; i<results.length; i++) {
                $("#" + results[i].day).prop('checked', true);
                $("." + results[i].day + "#starttime").val(results[i].start);
                $("." + results[i].day + "#endtime").val(results[i].end);
            }
        })
}

function refresh() {
    if (redirect) {
        window.location.href = '/upcomingAppointments'
    } else
    location.reload()
}

$(document).ready(function(){
    updateHours();
    
    $("#clinic").change(function(){
        updateHours();
    })

    $("#process-message").on('hide.bs.modal', function(e) {
        refresh();
    })
})