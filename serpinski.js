var d = function( sketch ) {
    var xpos;
    var ypos;
    var tri;

    sketch.setup = function() {
        var canv = sketch.createCanvas(300, 300);
        canv.parent("serpinski");
        sketch.background(255);

        tri = [];
        sketch.stroke(0,200,0);
        sketch.strokeWeight(3);
        for (i = 0; i < 3; i++) {
            var x = sketch.random(0, sketch.width);
            var y = sketch.random(0, sketch.height);
            tri.push(sketch.createVector(x,y));
            sketch.point(x, y);
        }

        sketch.stroke(200, 0, 0);
        xpos = sketch.random(0, sketch.width);
        ypos = sketch.random(0, sketch.height);
        sketch.point(xpos, ypos)

        sketch.strokeWeight(1);
        sketch.stroke(0);
    }

    sketch.draw = function() {
        sketch.point(xpos, ypos);
        var p = tri[sketch.int(sketch.random(0,3))];
        xpos = (xpos + p.x) / 2;
        ypos = (ypos + p.y) / 2;
    }
}

var serpinski_p5 = new p5(d, 'serpinski');

