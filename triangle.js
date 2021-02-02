var xpos;
var ypos;
var tri;
function setup() {
    var canv = createCanvas(300, 300);
    canv.parent("p5");
    background(255);
    var x = new Point(false); 
    var y = new Point(false); 
    var z = new Point(false); 
    var r = new Point(true); 
    tri = [x,y,z];
    xpos = r.getx();
    ypos = r.gety();
    strokeWeight(1);
    stroke(0);
}

function draw() {
    point(xpos, ypos)
    var p = tri[int(random(0,3))];
    xpos = (xpos + p.getx()) / 2;
    ypos = (ypos + p.gety()) / 2;
}
