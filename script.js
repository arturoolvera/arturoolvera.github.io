var table = document.getElementById("sleep");
var button = document.getElementById("sleep_b");
var drawing = document.getElementById("p5");

var curr = new Date();
for (i = 0; i <= 6; i++) {
    var row = table.insertRow(i + 1);
    var cycles = row.insertCell(0);
    var time = row.insertCell(1);

    cycles.innerHTML = i;
    if (i == 0) {
        var newtime = curr;
    } else {
        var newtime = new Date(curr.getTime() + (15 + 90 * i) *60000);
    }
    var hours = ('0' + newtime.getHours()).slice(-2);
    var mins = ('0' + newtime.getMinutes()).slice(-2);
    time.innerHTML = hours + ':' + mins;
}

table.style.display = "none";

function hide() {
    if (table.style.display === "none") {
        table.style.display = "block";
        button.value = "Sleep!";
    } else {
        table.style.display = "none";
        button.value = "Sleepy?"
    }
}

drawing.style.display = "none";

function reset() {
    if (drawing.style.display === "none") {
        setup();
        drawing.style.display = "block";
    } else {
        drawing.style.display = "none";
    }
}
