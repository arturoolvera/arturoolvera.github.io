var table = document.getElementById("sleep");
var button = document.getElementById("sleep_b");
var serpinski_draw = document.getElementById("serpinski");
var lissajous_draw = document.getElementById("lissajous");
var tictactoeai_draw = document.getElementById("tictactoeai");
var pong_draw = document.getElementById("pong");

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

function showTable() {
    table.style.display = "inline-table";
    button.value = "Sleep!";
    window.scrollTo(0,document.body.scrollHeight);
}

function hideTable() {
    table.style.display = "none";
    button.value = "Sleepy?"
}

function toggleTable() {
    if (table.style.display === "none") {
        hideDrawing();
        showTable();
    } else {
        hideTable();
    }
}

var drawings = [serpinski_draw, lissajous_draw, tictactoeai_draw, pong_draw]
var drawn = false; 
var drawnum = 0; 
serpinski_draw.style.display = "none";
lissajous_draw.style.display = "none";
tictactoeai_draw.style.display = "none";
pong_draw.style.display = "none";

function hideDrawing() {
    drawings[drawnum].style.display = "none";
    drawn ? drawnum++ : null; // only update if was already drawn
    drawn = false;
    if (drawnum >= drawings.length){
        drawnum = 0;
    }
}

function showDrawing() {
    drawings[drawnum].style.display = "block";
    lissajous_p5.setup();
    serpinski_p5.setup();
    tictactoeai_p5.setup();
    pong_p5.setup();
    drawn = true;
    window.scrollTo(0,document.body.scrollHeight);
}

function toggleDrawing() {
    if (drawn) {
        hideDrawing();
    } else {
        hideTable();
        showDrawing();
    }
}
