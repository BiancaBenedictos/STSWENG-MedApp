var month, date, time;

function getSlots(day, doctor, clinic) {
    var d = $('div.timeslots')
    d.empty()

    $(".active").removeClass('active')
    $("button[value='" + day + "']").addClass('active')

    $.get('/getSlots', {day: day, doctorID: doctor, clinicID: clinic}, function(results){
        for (i=0; i<results.length; i++)
            d.append('<button class="time" data-toggle="modal" data-target="#confirm"' +
                        'onclick="updateBookTime(\'' + results[i] + '\')">' + results[i] + '</button>')
        if (results.length == 0) {
            d.append('<p>No available appointments.</p>')
        }
    })
}

function updateBookTime(time) {
    month = $("span.month").attr('id');
    date = $('button.active').text();
    time = time;
    $("#book-time").text(month + " " + date + ", " + time);
}

$(document).ready(function(){
    $("button.active").click()
})