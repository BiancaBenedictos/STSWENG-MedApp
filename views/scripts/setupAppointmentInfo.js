var checked = [];

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
    
    for (i=0; i<checked.length; i++) {
        avail.push({
            clinicID: $("#clinic").val(),
            day: checked[i],
            startTime: $("." + checked[i] + "#starttime").val(),
            endTime: $("." + checked[i] + "#endtime").val()
        })
    }    
    
    console.log(avail)
}