var p = function (sketch) {
    let p;
    let b;
    let o;
    let winscore = 5;

    sketch.setup = function() {
        sketch.createCanvas(300,300);
        sketch.noStroke();
        sketch.fill(210);
        sketch.background(0);
        p = new sketch.Player();
        b = new sketch.Ball();
        o = new sketch.Opponent();
    }

    sketch.draw = function() {
        sketch.background(0);
        if (o.score == winscore) {
            sketch.Scoreboard.draw();
            sketch.Scoreboard.drawLose();
        } else if (p.score == winscore) {
            sketch.Scoreboard.draw();
            sketch.Scoreboard.drawWin();
        } else {
            p.draw();
            o.draw();
            b.draw();
            sketch.Scoreboard.draw();
        }
    }

    sketch.Player = class {
        constructor() {
            this.x = 280; // x, y coords of top of paddle
            this.y = 125; 
            this.w = 10; // paddle width
            this.h = 70; // paddle height
            this.score = 0;  
        }

        draw() {
            let y;
            if (sketch.touches.length > 0) {
                y = sketch.touches[0].y - this.h/2;
            } else {
                y = sketch.mouseY - this.h/2;
            }
            this.y = y;
            if (y > sketch.height - this.h) {
                this.y = sketch.height - this.h;
            }
            if (y < 0) {
                this.y = 0;
            }
            sketch.rect(this.x, this.y, this.w, this.h);
        }
    }

    sketch.Opponent = class {
        constructor() {
            this.x = 10;
            this.y = 50;
            this.h = 70;
            this.w = 10;
            this.score = 0;
        }

        detect() {
            this.y = b.y;
        }

        draw() {
            this.detect();
            sketch.rect(this.x,this.y,this.w,this.h);
        }
    }

    sketch.Ball = class {
        constructor() {
            this.x = 250;
            this.w = 8;
            this.h = 8;
            this.y = 125;
            this.xv = -3;
            this.yv = -3;
        }

        draw() {
            this.detectX();
            this.detectY();
            this.x += this.xv;
            this.y += this.yv;
            sketch.rect(this.x, this.y, this.w, this.h);
        }

        detectY() {
            if (this.y <= 0 || this.y >= sketch.height) {
                this.yv *= -1;
            }
        }

        detectX() {
            let inOrange = this.y < o.y + o.h && this.y + this.h > o.y
            let inPrange = this.y < p.y + p.h && this.y + this.h > p.y
            if (this.x <= o.x+o.w) {
                if (inOrange) {
                    this.xv *= -1;
                }
                else {
                    // player scores
                    p.score += 1;
                    if (p.score == 5) {
                        return;
                    }
                    this.x = 250;
                    this.y = 125;
                    this.xv = -3;
                    this.yv = -3;
                }
            } else if (this.x >= p.x) {
                if (inPrange) {
                    this.xv *= -1;
                } else {
                    // opponent scores
                    o.score += 1;
                    if (o.score == 5) {
                        return;
                    }
                    this.x = 250;
                    this.y = 125;
                    this.xv = -3;
                    this.yv = -3;
                }
            }
        }
    }

    sketch.Scoreboard = class {
        static draw() {
            sketch.Scoreboard.drawN(o.score, sketch.width/2 - (20 + 20), 20);
            sketch.Scoreboard.drawN(p.score, sketch.width/2 + 20, 20);
        }
        
        static drawN(n, x, y) {
            var a;
            switch(n) {
                case 0:
                    a = [
                        ['X','X','X','X'],
                        ['X','-','-','X'],
                        ['X','-','-','X'],
                        ['X','-','-','X'],
                        ['X','-','-','X'],
                        ['X','X','X','X'],
                    ];
                    break;
                case 1:
                    a = [
                        ['-','X','X','-'],
                        ['-','-','X','-'],
                        ['-','-','X','-'],
                        ['-','-','X','-'],
                        ['-','-','X','-'],
                        ['-','X','X','X'],
                    ];
                    break;
                case 2:
                    a = [
                        ['X','X','X','X'],
                        ['-','-','-','X'],
                        ['-','-','-','X'],
                        ['X','X','X','X'],
                        ['X','-','-','-'],
                        ['X','X','X','X'],
                    ];
                    break;
                case 3:
                    a = [
                        ['X','X','X','X'],
                        ['-','-','-','X'],
                        ['-','-','-','X'],
                        ['X','X','X','X'],
                        ['-','-','-','X'],
                        ['X','X','X','X'],
                    ];
                    break;
                case 4:
                    a = [
                        ['X','-','-','X'],
                        ['X','-','-','X'],
                        ['X','-','-','X'],
                        ['X','X','X','X'],
                        ['-','-','-','X'],
                        ['-','-','-','X'],
                    ];
                    break;
                case 5:
                    a = [
                        ['X','X','X','X'],
                        ['X','-','-','-'],
                        ['X','-','-','-'],
                        ['X','X','X','X'],
                        ['-','-','-','X'],
                        ['X','X','X','X'],
                    ];
                    break;
            }
            sketch.Scoreboard.drawArray(a, x, y);
        }

        static drawArray(a,x,y) {
            for (var i = 0; i < a.length; i++) {
                for (var j = 0; j < a[0].length; j++) {
                    if (a[i][j] == 'X') {
                        sketch.rect(x + j*5, y + i*5, 5, 5);
                    }
                }
            }
        }

        static drawLose() {
            sketch.strokeWeight(10);
            sketch.stroke(232, 58, 58);
            sketch.noFill();
            sketch.ellipse(150, 230, 100, 150);
            sketch.noStroke();

            sketch.fill(0);
            sketch.rect(0,215,300,100);

            sketch.fill(232, 58, 58);
            sketch.rect(100,80,10,50);
            sketch.rect(190,80,10,50);
            sketch.fill(210);
        }

        static drawWin() {
            sketch.strokeWeight(10);
            sketch.stroke(119, 239, 121);
            sketch.noFill();
            sketch.ellipse(150, 140, 100, 150);
            sketch.noStroke();

            sketch.fill(0);
            sketch.rect(0,0,300,155);

            sketch.fill(119, 239, 121);
            sketch.rect(100,80,10,50);
            sketch.rect(190,80,10,50);
            sketch.fill(210);
        }
    }
}
var pong_p5 = new p5(p, 'pong');
