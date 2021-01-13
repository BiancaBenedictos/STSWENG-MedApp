$(document).ready(function() {
    $.get('/getAppointmentNotifs', null, function(result) {
        console.log(result)

        $(".pendingCount").text(result.pendingCount)
        $(".upcomingCount").text(result.upcomingCount)

        var sum = 0;
        if (result.pendingCount)
            sum += result.pendingCount
        if (result.upcomingCount)
            sum += result.upcomingCount

        if (sum <= 0 || isNaN(sum))
            sum = undefined

        $(".totalCount").text(sum)
    })
})