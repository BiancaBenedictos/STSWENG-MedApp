var month, year, date, fulldate, time;

function getSlots(day, full, doctor, clinic) {
    var d = $('div.timeslots')
    d.empty()

    $(".active").removeClass('active')
    $("button[value='" + day + "']").addClass('active')
    fulldate = full;
    
    $.get('/getSlots', {q: {day: day, doctorID: doctor, clinicID: clinic}, full: full}, function(results){
        
        if (results.length == 0) {
            d.append('<p>No available appointments.</p>')
        }

        if (results.length > 0) {
            $.get('/disableSlots', {date: fulldate, doctorID: doctor, clinicID: clinic}, function(taken) {
                var disabled = ''

                for (var i=0; i<results.length; i++) {
                    var H = parseInt(results[i].H24.substr(0, 2)), M = parseInt(results[i].H24.substr(3, 5));

                    if (taken.booked.indexOf(results[i].H24) > -1) {
                        disabled = 'disabled'
                    } else if ((taken.currH == H && taken.currM >= M) || taken.currH > H) {
                        disabled = 'disabled'
                    } else disabled = ''

                    d.append('<button class="time ' +  disabled + ' " data-toggle="modal" data-target="#confirm"' +
                        'onclick="updateBookTime(\'' + results[i].H12 + '\', \'' + results[i].H24 + '\')" id="' + results[i].H24 + '">' + results[i].H12 + '</button>')
                }

                disable()
            })
        }
    })

}

function disableSlots(doctor, clinic) {
    $.get('/disableSlots', {date: fulldate, doctorID: doctor, clinicID: clinic}, function(results) {
        console.log(results)
        if (results.booked)
            for (i=0; i < results.booked.length; i++) {
                $("#" + results.booked[i]).addClass("disabled")
                $("#" + results.booked[i]).css("border-color", "red")
                console.log("#" + results[i])
            }
    })

    disable()
}

function updateBookTime(time12, time24) {
    month = $("span.month").attr('id');
    year = $("span.year").attr('id')
    date = $('button.active')[0].innerText;
    time = time24;
    $("#book-time").text(month + " " + date + ", " + year + " " + time12);
}

function bookAppointment() {
    $.post('/requestAppointment', {fulldate: fulldate, time: time, doctor: $("h1.doctor").attr('id'), doctorName: $("h1.doctor").text(), doctorPic: $(".profpic").attr('src')}, function(res) {
        $("#confirm").modal('hide')

        if (res) {
            $(".msg-body").text("Booking successful. Please wait for the doctor to accept your appointment schedule.")
        } else {
            $(".msg-body").text("Something went wrong. Please try again.")
        }

        $("#process-message").modal('show')
    })
}

function changeWeek(type) {
    var link = window.location.href;
    var i = link.indexOf("&date=") + 1

    if (i > 0)
        link = link.slice(0, i)

    link = link + "&date='" + fulldate + "'&type=" + type
    console.log(link)
    window.location.replace(link);
}

function disable() {
    var disabled = $("button.disabled")
    disabled.prop('disabled', true)
}

function refresh() {
    location.reload();
}

$(document).ready(function(){
    $("button.active").click()
    disable()
})