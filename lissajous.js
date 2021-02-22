var s = function ( sketch ) {
    let angle;
    let path;
    let speeds;

    sketch.setup = function() {
        var canv = sketch.createCanvas(300, 300);
        canv.parent("lissajous");
        let sx = sketch.int(sketch.random(1,10));
        let sy = sketch.int(sketch.random(1,10));
        speeds = sketch.createVector(sx,sy);
        sketch.background(255);
        path = [];
        angle = 0;
        sketch.loop();
    }

    sketch.draw = function() {
        sketch.background(255);

        let x = sketch.width*0.3 * sketch.cos(speeds.x * angle) + sketch.width/2;
        let y = sketch.width*0.3 * sketch.sin(speeds.y * angle) + sketch.height/2;

        // guide and lines
        sketch.stroke(200);
        sketch.strokeWeight(6);
        sketch.point(x, sketch.height*0.1);
        sketch.point(sketch.width*0.1, y);
        sketch.strokeWeight(1);
        sketch.stroke(200);
        sketch.line(x, 0, x, sketch.height);
        sketch.line(0, y, sketch.width, y);
        path.push(sketch.createVector(x,y));

        // curve
        sketch.stroke(0);
        sketch.strokeWeight(2);
        sketch.noFill();
        sketch.beginShape();
        for (let i = 0; i < path.length; i++) {
          const v = path[i];
          sketch.vertex(v.x, v.y);
        }
        sketch.endShape();

        sketch.strokeWeight(8);
        sketch.point(x,y);

        angle += -0.01;

        if (angle < -sketch.TWO_PI) {
            sketch.noLoop();
        }

    }
}

var lissajous_p5 = new p5(s, 'lissajous');
