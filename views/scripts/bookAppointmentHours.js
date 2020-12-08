var month, year, date, fulldate, time;

function getSlots(day, full, doctor, clinic) {
    var d = $('div.timeslots')
    d.empty()

    $(".active").removeClass('active')
    $("button[value='" + day + "']").addClass('active')
    fulldate = full;
    
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
    year = $("span.year").attr('id')
    date = $('button.active')[0].innerText;
    time = time24;
    $("#book-time").text(month + " " + date + ", " + year + " " + time12);
}

function bookAppointment() {
    $.post('/requestAppointment', {fulldate: fulldate, time: time, doctor: $("h1.doctor").attr('id')}, function(res) {
        console.log(res);
    })
}

$(document).ready(function(){
    $("button.active").click()
})