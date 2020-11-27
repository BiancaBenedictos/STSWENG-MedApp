var month, date, time;

function getSlots(day, doctor, clinic) {
    var d = $('div.timeslots')
    d.empty()

    $(".active").removeClass('active')
    $("button[value='" + day + "']").addClass('active')

    $.get('/getSlots', {day: day, doctorID: doctor, clinicID: clinic}, function(results){
        for (i=0; i<results.length; i++)
            d.append('<button class="time" data-toggle="modal" data-target="#confirm"' +
                        'onclick="updateBookTime(\'' + results[i].H12 + '\', \'' + results[i].H24 + '\')">' + results[i].H12 + '</button>')
        if (results.length == 0) {
            d.append('<p>No available appointments.</p>')
        }
    })
}

function updateBookTime(time12, time24) {
    month = $("span.month").attr('id');
    date = $('button.active').text();
    time = time24;
    $("#book-time").text(month + " " + date + ", " + time12);
}

function bookAppointment() {
    $.post('/requestAppointment', {month: month, date: date, time: time, doctor: $("h1.doctor").attr('id')}, function(res) {
        console.log(res);
    })
}

$(document).ready(function(){
    $("button.active").click()
})