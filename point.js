function Point(color) {
    this.xpos = random(0, width);
    this.ypos = random(0, height);
    if(color) {
        stroke(200, 0, 0);
    } else {
        stroke(0, 200, 0);
    };
    strokeWeight(3);
    point(this.xpos, this.ypos);
    this.getx = function() {
        return this.xpos;
    };
    this.gety = function() {
        return this.ypos;
    };
};
