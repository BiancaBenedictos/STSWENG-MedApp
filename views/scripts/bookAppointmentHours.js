var month, year, date, fulldate, time;

function getSlots(day, full, doctor, clinic) {
    var d = $('div.timeslots')
    d.empty()

    $(".active").removeClass('active')
    $("button[value='" + day + "']").addClass('active')
    fulldate = full;
    
    $.get('/getSlots', {q: {day: day, doctorID: doctor, clinicID: clinic}, full: full}, function(results){
        
        console.log(results);
        if (results.times.length == 0) {
            d.append('<p>No available appointments.</p>')
        }

        if (results.times.length > 0) {
            $.get('/disableSlots', {date: fulldate, doctorID: doctor, clinicID: clinic}, function(taken) {
                var disabled = ''

                for (var i=0; i<results.times.length; i++) {
                    var H = parseInt(results.times[i].H24.substr(0, 2)), 
                        M = parseInt(results.times[i].H24.substr(3, 5));

                    if (taken.booked.indexOf(results.times[i].H24) > -1) {
                        disabled = 'disabled'
                    } else if (taken.sameDay && ((taken.currH == H && taken.currM >= M) || taken.currH > H)) {
                        disabled = 'disabled'
                    } else disabled = ''

                    d.append(`<button class="time ` + disabled + `" data-toggle="modal" data-target="#confirm" onclick='` +
                            `updateBookTime("` + results.times[i].H12 + `", "` + results.times[i].H24 + `", "` + results.date + `")'` +
                            ` id="`+ results.times[i].H24 +`">` + results.times[i].H12 + `</button>`)
                /*
                    d.append('<button class="time ' +  disabled + ' " data-toggle="modal" data-target="#confirm"' +
                        'onclick="updateBookTime(\'' + results.times[i].H12 + '\', \'' + results.times[i].H24 + 
                        '\')" id="' + results.times[i].H24 + '">' + results.times[i].H12 + '</button>')
                */
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
            for (var i=0; i < results.booked.length; i++) {
                $("#" + results.booked[i]).addClass("disabled")
                $("#" + results.booked[i]).css("border-color", "red")
                console.log("#" + results[i])
            }
    })

    disable()
}

function updateBookTime(time12, time24, bookdate) {
    console.log(bookdate);
    time = time24;
    $("#book-time").text(bookdate + " " + time12);
}

function bookAppointment() {
    var link = window.location.href;
    var s = link.indexOf("&c="), e = link.indexOf("&date=");
    var clinic;

    if (e >= 0) {
        clinic = link.slice(s + 3, e);
    } else clinic = link.slice(s+3);

    $.post('/requestAppointment', {fulldate: fulldate, time: time, doctor: $("h1.doctor").attr('id'), doctorName: $("h1.doctor").text(), doctorPic: $(".profpic").attr('src'), clinic: clinic}, function(res) {
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
    var i = link.indexOf("&date=")

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