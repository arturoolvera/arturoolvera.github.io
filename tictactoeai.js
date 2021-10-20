var b = function ( sketch ) {

    let grid;
    sketch.setup = function() {
        canv = sketch.createCanvas(300, 300);
        canv.parent("tictactoeai");

        // Grid
        grid = ['-', '-', '-', '-', '-', '-', '-', '-', '-', 'x']; // 'e' for end
        sketch.strokeWeight(3);
        sketch.stroke(0);
        for (let i = 1; i < 3; i++) {
            sketch.line(25 + 250/3 * i ,25,25 + 250/3 * i,275);
            sketch.line(25, 25 + 250/3 * i, 275, 25 + 250/3 * i);
        }

        sketch.strokeWeight(2);
    }

    sketch.mouseClicked = function() {
        sketch.test();
        sketch.makeMove(sketch.mouseX, sketch.mouseY);
    }

    sketch.touchEnded = function() {
        if (sketch.touches.size >= 1) {
            var x = sketch.touches[0].x;
            var y = sketch.touches[0].y;
            sketch.makeMove(x, y);
        }
    }

    sketch.test = function() {
        sketch.ellipse(150,150,10,10);
    }

    sketch.makeMove = function(x, y) {
        s = sketch.getPos(x, y);
        if (grid[9] != 'e' && s != -1) {
            if (grid[9] == 'x' && grid[s] == '-') {
                grid[s] = 'x';
                grid[9] = 'o';
                sketch.drawMove(s, true);
                sketch.checkWin();
            } 
            if (grid[9] == 'o') {
                move = sketch.getMove();
                grid[move] = 'o';
                grid[9] = 'x';
                sketch.drawMove(move, false);
                sketch.checkWin();
            }
        }

    }

    sketch.checkWin = function() {
        winstates = [[0,1,2], [3,4,5], [6,7,8], [0,4,8], [6,4,2], [0,3,6], [1,4,7],
            [2,5,8]];

        winstates.every(state => {
            if (grid[state[0]] == grid[state[1]] && grid[state[1]] == grid[state[2]] && grid[state[0]]!= '-') {
                winpos = state;
                grid[9] = 'e';
                sketch.drawWin(state);
                return false;
            }
            return true;
        });

        if (grid[9] != 'e') {
            for (i = 0; i < 9; i++) {
                if (grid[i] == '-') {
                    return;
                }
            }
            sketch.drawTie();
            grid[9] = 'e';
        }
    }

    sketch.drawMove = function(pos, x) {
        if (pos >=0  && pos <= 8 ) {
            col = pos % 3;
            row = sketch.floor(pos/3);
            cx = col * 250/3 + 25 + 250/6;
            cy = row * 250/3 + 25 + 250/6;
            o = 250/8;
            if (x) {
                sketch.line(cx - o, cy - o, cx + o, cy+ o);
                sketch.line(cx - o, cy + o, cx + o, cy- o);
            } else {
                sketch.noFill();
                sketch.circle(cx, cy, 2 * o);
            }
        }
    }

    sketch.drawWin = function(s) {
        one = s[0];
        two = s[2];
        cx1 = one % 3 * 250/3 + 25 + 250/6;
        cy1 = sketch.floor(one / 3) * 250/3 + 25 + 250/6;
        cx2 = two % 3 * 250/3 + 25 + 250/6;
        cy2 = sketch.floor(two / 3) * 250/3 + 25 + 250/6;
        
        xo = 0;
        yo = 0;

        if (cx1 != cx2) {
            xo = 256/6; 
        }

        if (cy1 < cy2 ) {
            yo = 256/6;
        } else if (cy1 > cy2) {
            yo = -256/6
        }

        sketch.stroke(255, 0, 0);
        sketch.strokeWeight(3);
        sketch.line(cx1 - xo, cy1 - yo, cx2 + xo, cy2 + yo);
    }

    sketch.drawTie = function() {
        sketch.strokeWeight(3);
        sketch.stroke(0, 0, 255);
        for (let i = 1; i < 3; i++) {
            sketch.line(25 + 250/3 * i ,25,25 + 250/3 * i,275);
            sketch.line(25, 25 + 250/3 * i, 275, 25 + 250/3 * i);
        }
    }


    sketch.getPos = function(x, y) {
        if (x > 25 && x < 275 && y > 25 && y < 275) {
            x -= 25;
            y -= 25;
            col = 0;
            row = 0;
            while (x > 250/3) {
                x -= 250/3
                col++;
            }
            while (y > 250/3) {
                y -= 250/3
                row++;
            }
            return col + 3 * row;
        }
        return -1;
    }

    sketch.getMove = function() {
        pos = sketch.getSymmetric(grid[9] + grid.slice(0,9).join(""));
        move = soln[pos[0]][2];
        adhoc = ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
        adhoc[move] = 'H';
        adhoc = adhoc.join("");
        postflip = 0;
        flip = pos[1];
        if (pos[2]) {
            postflip = pos[1] - 4;
            flip = 4;
        }
        for (i = postflip; i < 4; i++) {
            adhoc = sketch.rotateBoard(adhoc);
        }
        if (pos[2]) {
            adhoc = sketch.flipBoard(adhoc);
        }
        for (i = flip; i < 4; i++) {
            adhoc = sketch.rotateBoard(adhoc);
        }
        move = adhoc.indexOf('H');
        return move - 1;
    }

    sketch.getSymmetric = function(stringpos) {
        curr = stringpos;
        ret = stringpos;
        crot = 0;
        cflip = false;
        rot = 0;
        flip = false;
        for (i = 0; i < 7; i++) {
            if (i == 3) {
                curr = sketch.flipBoard(sketch.rotateBoard(curr))
                flip = true;
                rot += 1;
            } else {
                curr = sketch.rotateBoard(curr)
                rot += 1;
            }
            if (curr > ret) {
                ret = curr
                crot = rot;
                cflip = flip;
            }
        }
        return [ret, crot, cflip]
    }

    sketch.rotateBoard = function(p) {
        return p[0]+p[7]+p[4]+p[1]+p[8]+p[5]+p[2]+p[9]+p[6]+p[3]
    }
    sketch.flipBoard = function(p) {
        return p[0]+p[3]+p[2]+p[1]+p[6]+p[5]+p[4]+p[9]+p[8]+p[7]
    }

    let soln = {
        "x---------": [
            "tie",
            9,
            1
        ],
        "ox--------": [
            "tie",
            8,
            5
        ],
        "xx-------o": [
            "win",
            5,
            7
        ],
        "ox----x--o": [
            "tie",
            6,
            4
        ],
        "xx----x-oo": [
            "win",
            5,
            7
        ],
        "oxoo--xx--": [
            "lose",
            4,
            4
        ],
        "xxoo--xx-o": [
            "win",
            1,
            4
        ],
        "oxxo--xxoo": [
            "tie",
            2,
            4
        ],
        "xxxo-oxxoo": [
            "win",
            1,
            4
        ],
        "oxxxxoooxo": [
            "lose",
            0,
            null
        ],
        "xxxoo-xxoo": [
            "tie",
            1,
            5
        ],
        "oxxooxxxoo": [
            "tie",
            0,
            null
        ],
        "oxoo-xxx-o": [
            "tie",
            2,
            4
        ],
        "xxoo-xxxoo": [
            "win",
            1,
            4
        ],
        "oxxxoxooxo": [
            "lose",
            0,
            null
        ],
        "xxoxox-oxo": [
            "tie",
            1,
            6
        ],
        "oxxxo--oxo": [
            "lose",
            0,
            null
        ],
        "xxoo--xxo-": [
            "win",
            1,
            4
        ],
        "oxxoo-ox-x": [
            "win",
            1,
            5
        ],
        "xxxoo-oxox": [
            "win",
            1,
            5
        ],
        "oxxooxoxox": [
            "lose",
            0,
            null
        ],
        "xxxoooox-x": [
            "lose",
            0,
            null
        ],
        "oxoo-xxxo-": [
            "lose",
            2,
            9
        ],
        "xxoxoxoox-": [
            "win",
            1,
            9
        ],
        "oxxxo-oox-": [
            "lose",
            0,
            null
        ],
        "xxoo-oxx--": [
            "win",
            1,
            4
        ],
        "oxxo-oox-x": [
            "win",
            1,
            4
        ],
        "xxxo-ooxox": [
            "win",
            1,
            4
        ],
        "oxxxxoooox": [
            "lose",
            0,
            null
        ],
        "oxx--oxxoo": [
            "lose",
            2,
            4
        ],
        "xxx-ooxxoo": [
            "win",
            1,
            3
        ],
        "oxxxoo-ox-": [
            "lose",
            0,
            null
        ],
        "xxoxo--ox-": [
            "win",
            3,
            9
        ],
        "oxxo--oxox": [
            "lose",
            2,
            5
        ],
        "oxx-o-xxoo": [
            "tie",
            2,
            3
        ],
        "oxoxox-ox-": [
            "tie",
            2,
            9
        ],
        "ox---xx-oo": [
            "win",
            1,
            7
        ],
        "xx-o-xo-xo": [
            "lose",
            0,
            null
        ],
        "xxo--xo-xo": [
            "tie",
            3,
            3
        ],
        "oxxo-xoxo-": [
            "win",
            1,
            9
        ],
        "xxxo-xoxoo": [
            "lose",
            0,
            null
        ],
        "xxxooxoxo-": [
            "win",
            1,
            9
        ],
        "oxx-oxx-oo": [
            "win",
            1,
            7
        ],
        "xxx-oxxooo": [
            "lose",
            0,
            null
        ],
        "xxxooxx-oo": [
            "tie",
            1,
            7
        ],
        "xx-o-xx-oo": [
            "win",
            1,
            4
        ],
        "oxx--xooxo": [
            "lose",
            0,
            null
        ],
        "oxxo-xx-oo": [
            "win",
            1,
            7
        ],
        "xxxo-xxooo": [
            "lose",
            0,
            null
        ],
        "xxo--xx-oo": [
            "win",
            1,
            4
        ],
        "oxx-oxo-xo": [
            "lose",
            0,
            null
        ],
        "oxxooxox--": [
            "win",
            1,
            9
        ],
        "xxxooxox-o": [
            "lose",
            0,
            null
        ],
        "oxx---o-xo": [
            "win",
            1,
            3
        ],
        "xxx---ooxo": [
            "win",
            1,
            5
        ],
        "oxxox-x-oo": [
            "win",
            1,
            7
        ],
        "xxxox-xooo": [
            "lose",
            0,
            null
        ],
        "xxxoxox-oo": [
            "win",
            1,
            7
        ],
        "xxx--oo-xo": [
            "win",
            1,
            3
        ],
        "oxxo-ooxx-": [
            "win",
            1,
            9
        ],
        "xxxo-ooxxo": [
            "lose",
            0,
            null
        ],
        "xxxooooxx-": [
            "lose",
            0,
            null
        ],
        "oxx-xox-oo": [
            "win",
            1,
            7
        ],
        "xxxoxoo-xo": [
            "lose",
            0,
            null
        ],
        "xxx-o-o-xo": [
            "win",
            1,
            5
        ],
        "oxxoo-oxx-": [
            "win",
            1,
            9
        ],
        "xxxoo-oxxo": [
            "lose",
            0,
            null
        ],
        "xxxo--o-xo": [
            "lose",
            0,
            null
        ],
        "oxxo--ox--": [
            "win",
            1,
            9
        ],
        "xxxo--ox-o": [
            "lose",
            0,
            null
        ],
        "xxxo--oxo-": [
            "win",
            1,
            4
        ],
        "oxxxx-ooo-": [
            "lose",
            0,
            null
        ],
        "xxxo-oox--": [
            "win",
            1,
            4
        ],
        "oxxxxo-oo-": [
            "lose",
            0,
            null
        ],
        "xxxoo-ox--": [
            "lose",
            2,
            9
        ],
        "oxx---x-oo": [
            "win",
            1,
            7
        ],
        "xxx---xooo": [
            "lose",
            0,
            null
        ],
        "xxx--ox-oo": [
            "win",
            1,
            3
        ],
        "xxx-o-x-oo": [
            "win",
            1,
            3
        ],
        "xxxo--x-oo": [
            "tie",
            3,
            7
        ],
        "xx-o----xo": [
            "tie",
            5,
            6
        ],
        "oxxo---x-o": [
            "win",
            1,
            6
        ],
        "xxxo---xoo": [
            "win",
            1,
            4
        ],
        "oxxo-x-xoo": [
            "win",
            1,
            6
        ],
        "xxxoox-xoo": [
            "tie",
            1,
            6
        ],
        "oxxxx-oo-o": [
            "lose",
            0,
            null
        ],
        "xxxo-o-x-o": [
            "win",
            1,
            4
        ],
        "oxxo-o-xxo": [
            "win",
            1,
            6
        ],
        "xxxooo-xxo": [
            "tie",
            1,
            6
        ],
        "oxxoooxxxo": [
            "tie",
            0,
            null
        ],
        "oxxo-oxx-o": [
            "tie",
            2,
            4
        ],
        "xxxoooxx-o": [
            "tie",
            1,
            8
        ],
        "oxxxxo-o-o": [
            "lose",
            0,
            null
        ],
        "xxxoo--x-o": [
            "tie",
            3,
            6
        ],
        "oxxoo--xxo": [
            "win",
            1,
            6
        ],
        "oxxoo-xx-o": [
            "tie",
            2,
            5
        ],
        "oxxoox-x-o": [
            "win",
            1,
            6
        ],
        "ox-o--x-xo": [
            "tie",
            4,
            4
        ],
        "xx-o--xoxo": [
            "win",
            3,
            5
        ],
        "ox-o-xxoxo": [
            "lose",
            2,
            4
        ],
        "xxoo-xxoxo": [
            "win",
            1,
            4
        ],
        "oxxooxxoxo": [
            "lose",
            0,
            null
        ],
        "oxxo--xoxo": [
            "win",
            1,
            5
        ],
        "xxxo-oxoxo": [
            "lose",
            0,
            null
        ],
        "xxxoo-xoxo": [
            "win",
            1,
            5
        ],
        "xx-o-ox-xo": [
            "tie",
            3,
            7
        ],
        "oxx--oxoxo": [
            "win",
            1,
            3
        ],
        "xxx-ooxoxo": [
            "win",
            1,
            3
        ],
        "oxxo-ox-xo": [
            "win",
            1,
            7
        ],
        "xxxooox-xo": [
            "tie",
            1,
            7
        ],
        "xxo---xoxo": [
            "tie",
            3,
            3
        ],
        "oxo--xxoxo": [
            "tie",
            2,
            4
        ],
        "xxoooxx-xo": [
            "tie",
            1,
            7
        ],
        "oxxoo-x-xo": [
            "tie",
            2,
            5
        ],
        "xxoo--x-xo": [
            "win",
            3,
            4
        ],
        "oxoo-xx-xo": [
            "tie",
            2,
            4
        ],
        "oxx-o-xoxo": [
            "lose",
            2,
            5
        ],
        "ox-o-x--xo": [
            "win",
            1,
            6
        ],
        "xx-o-xxo-o": [
            "win",
            1,
            4
        ],
        "oxxo-x-oxo": [
            "lose",
            0,
            null
        ],
        "oxxo-xxo-o": [
            "win",
            1,
            8
        ],
        "xxxooxxo-o": [
            "win",
            1,
            8
        ],
        "xxo--xxo-o": [
            "win",
            1,
            4
        ],
        "oxxoox--xo": [
            "lose",
            0,
            null
        ],
        "xxoo-x--xo": [
            "tie",
            3,
            6
        ],
        "oxx-oxxo-o": [
            "win",
            1,
            8
        ],
        "oxx---xo-o": [
            "win",
            1,
            8
        ],
        "xxx--oxo-o": [
            "win",
            1,
            3
        ],
        "oxxoxo--xo": [
            "win",
            1,
            7
        ],
        "xxxoxoxo-o": [
            "lose",
            0,
            null
        ],
        "xxx-o-xo-o": [
            "win",
            1,
            3
        ],
        "xxxo--xo-o": [
            "lose",
            2,
            8
        ],
        "oxxox-xo-o": [
            "win",
            1,
            8
        ],
        "oxxo----xo": [
            "win",
            1,
            6
        ],
        "xxxo---oxo": [
            "win",
            1,
            5
        ],
        "xxxo-o--xo": [
            "lose",
            2,
            7
        ],
        "xxxoo---xo": [
            "win",
            1,
            5
        ],
        "xx---ox--o": [
            "tie",
            5,
            2
        ],
        "ox---ox-xo": [
            "tie",
            4,
            2
        ],
        "xxo--ox-xo": [
            "tie",
            3,
            3
        ],
        "oxxo-oxxo-": [
            "tie",
            2,
            4
        ],
        "xxxoooxxo-": [
            "tie",
            1,
            9
        ],
        "oxxoooxxox": [
            "tie",
            0,
            null
        ],
        "oxx-oox-xo": [
            "tie",
            2,
            3
        ],
        "oxxoooxx--": [
            "tie",
            2,
            8
        ],
        "ox-x-o-ox-": [
            "tie",
            4,
            2
        ],
        "xx-x-o-oxo": [
            "win",
            1,
            2
        ],
        "oxxx-o-oxo": [
            "lose",
            0,
            null
        ],
        "xxo--oxx-o": [
            "win",
            1,
            4
        ],
        "oxxxoo--xo": [
            "lose",
            0,
            null
        ],
        "oxxooo-x-x": [
            "win",
            1,
            6
        ],
        "xxxooo-xox": [
            "tie",
            1,
            6
        ],
        "xxox-o-ox-": [
            "tie",
            3,
            4
        ],
        "oxxo-o-xox": [
            "tie",
            2,
            4
        ],
        "oxx-ooxx-o": [
            "tie",
            2,
            3
        ],
        "oxx--o--xo": [
            "win",
            3,
            3
        ],
        "xxx--o-oxo": [
            "win",
            1,
            3
        ],
        "oxxoxox--o": [
            "win",
            1,
            7
        ],
        "xxx-oo--xo": [
            "win",
            1,
            3
        ],
        "oxxooo-xx-": [
            "win",
            1,
            6
        ],
        "oxxo-o-x--": [
            "tie",
            4,
            4
        ],
        "xxxo-o-xo-": [
            "win",
            1,
            4
        ],
        "oxxxxooo--": [
            "lose",
            0,
            null
        ],
        "xxxooo-x--": [
            "tie",
            3,
            6
        ],
        "oxx--ox--o": [
            "tie",
            4,
            3
        ],
        "xxx-oox--o": [
            "win",
            1,
            3
        ],
        "xxxo-ox--o": [
            "tie",
            3,
            7
        ],
        "xxo-----xo": [
            "tie",
            5,
            3
        ],
        "oxxo---xo-": [
            "tie",
            4,
            4
        ],
        "xxxoo--xo-": [
            "tie",
            3,
            5
        ],
        "oxxoo--xox": [
            "tie",
            2,
            5
        ],
        "oxxoo-xxo-": [
            "tie",
            2,
            5
        ],
        "oxxoox-xo-": [
            "tie",
            2,
            9
        ],
        "oxo---x-xo": [
            "tie",
            4,
            4
        ],
        "xxo-o-x-xo": [
            "tie",
            3,
            3
        ],
        "oxo-oxx-xo": [
            "tie",
            2,
            3
        ],
        "oxo--x--xo": [
            "tie",
            4,
            3
        ],
        "xxo--x-oxo": [
            "tie",
            3,
            3
        ],
        "oxxooxx--o": [
            "tie",
            2,
            8
        ],
        "oxox-x-oxo": [
            "tie",
            2,
            4
        ],
        "xxo-oxx--o": [
            "tie",
            3,
            3
        ],
        "oxoxox--xo": [
            "tie",
            2,
            7
        ],
        "oxx-o-x--o": [
            "tie",
            4,
            3
        ],
        "xxxoo-x--o": [
            "tie",
            3,
            5
        ],
        "oxox---ox-": [
            "tie",
            4,
            5
        ],
        "xxox---oxo": [
            "tie",
            3,
            4
        ],
        "xxoxo---xo": [
            "tie",
            3,
            5
        ],
        "xx-o--x--o": [
            "win",
            3,
            4
        ],
        "ox-x---oxo": [
            "tie",
            4,
            2
        ],
        "ox-o-xx--o": [
            "tie",
            4,
            4
        ],
        "xxoo-xx--o": [
            "win",
            1,
            4
        ],
        "oxx-ox-oxo": [
            "lose",
            0,
            null
        ],
        "oxx----oxo": [
            "lose",
            2,
            6
        ],
        "xxx-o--oxo": [
            "win",
            1,
            5
        ],
        "oxxo--x--o": [
            "win",
            3,
            7
        ],
        "xxo---x--o": [
            "win",
            3,
            4
        ],
        "oxo---xx-o": [
            "tie",
            4,
            4
        ],
        "oxo--xx--o": [
            "tie",
            4,
            4
        ],
        "oxx-o---xo": [
            "lose",
            2,
            7
        ],
        "oxxoo--x--": [
            "win",
            3,
            6
        ],
        "ox-x---o--": [
            "lose",
            4,
            2
        ],
        "xx-x---o-o": [
            "win",
            1,
            2
        ],
        "ox-x-x-o-o": [
            "win",
            1,
            8
        ],
        "xx-x-x-ooo": [
            "lose",
            0,
            null
        ],
        "xxoo-x-x-o": [
            "win",
            1,
            4
        ],
        "oxxxox-o-o": [
            "lose",
            0,
            null
        ],
        "xxox-x-o-o": [
            "tie",
            3,
            8
        ],
        "oxxx---o-o": [
            "lose",
            0,
            null
        ],
        "xx-x---oo-": [
            "win",
            1,
            2
        ],
        "oxoo---x-x": [
            "lose",
            2,
            8
        ],
        "xxox---xoo": [
            "win",
            1,
            5
        ],
        "oxox-x-xoo": [
            "lose",
            0,
            null
        ],
        "oxxxo-ox-o": [
            "lose",
            0,
            null
        ],
        "xxoo--ox-x": [
            "win",
            1,
            8
        ],
        "oxxxo--oox": [
            "lose",
            0,
            null
        ],
        "oxoo-xox-x": [
            "lose",
            0,
            null
        ],
        "xxoo-o-x-x": [
            "win",
            1,
            8
        ],
        "oxxx-o-xoo": [
            "lose",
            0,
            null
        ],
        "oxxxoo-o-x": [
            "lose",
            0,
            null
        ],
        "xxoxo--o-x": [
            "win",
            1,
            6
        ],
        "oxxxo--xoo": [
            "lose",
            0,
            null
        ],
        "oxoxox-o-x": [
            "lose",
            0,
            null
        ],
        "oxx---ox-o": [
            "win",
            1,
            3
        ],
        "xxx---oxoo": [
            "win",
            1,
            4
        ],
        "oxx--xoxoo": [
            "win",
            1,
            3
        ],
        "xxx-oxoxoo": [
            "win",
            1,
            3
        ],
        "oxxxoxoxoo": [
            "lose",
            0,
            null
        ],
        "oxxxx-o-oo": [
            "lose",
            0,
            null
        ],
        "xxx--oox-o": [
            "win",
            1,
            4
        ],
        "oxxxxo--oo": [
            "lose",
            0,
            null
        ],
        "xxx-o-ox-o": [
            "win",
            1,
            3
        ],
        "oxx-oxox-o": [
            "win",
            1,
            3
        ],
        "ox-x-x-oo-": [
            "win",
            1,
            9
        ],
        "xxo--xox-o": [
            "win",
            1,
            4
        ],
        "oxxxox--oo": [
            "lose",
            0,
            null
        ],
        "xxoo-xox--": [
            "win",
            1,
            9
        ],
        "oxxxox-oo-": [
            "lose",
            0,
            null
        ],
        "xxox-x-oo-": [
            "win",
            1,
            9
        ],
        "oxxx---oo-": [
            "lose",
            0,
            null
        ],
        "xxo----x-o": [
            "win",
            1,
            4
        ],
        "oxo--x-x-o": [
            "lose",
            2,
            8
        ],
        "xxoo-x-xo-": [
            "win",
            1,
            9
        ],
        "oxxxoxoo--": [
            "lose",
            0,
            null
        ],
        "xxoxox---o": [
            "win",
            1,
            7
        ],
        "oxoxox-x-o": [
            "lose",
            0,
            null
        ],
        "oxxxo----o": [
            "lose",
            0,
            null
        ],
        "oxox---x-o": [
            "lose",
            2,
            8
        ],
        "xxox-o-x-o": [
            "win",
            1,
            4
        ],
        "oxxxoo-x-o": [
            "lose",
            0,
            null
        ],
        "xxoxo--x-o": [
            "win",
            1,
            5
        ],
        "xx-x-o-o--": [
            "win",
            1,
            2
        ],
        "ox-x-o-x-o": [
            "lose",
            2,
            8
        ],
        "oxx--o-x-o": [
            "lose",
            2,
            8
        ],
        "xxx--o-xoo": [
            "win",
            1,
            4
        ],
        "oxxxxoo--o": [
            "lose",
            0,
            null
        ],
        "xxx-oo-x-o": [
            "win",
            1,
            3
        ],
        "oxxx-o-o--": [
            "lose",
            0,
            null
        ],
        "xxoo---x--": [
            "win",
            1,
            4
        ],
        "oxx----xoo": [
            "lose",
            2,
            6
        ],
        "xxx-o--xoo": [
            "win",
            1,
            3
        ],
        "oxx-ox-xoo": [
            "tie",
            2,
            3
        ],
        "oxoo-x-x--": [
            "lose",
            2,
            9
        ],
        "xxoxox-o--": [
            "win",
            1,
            9
        ],
        "oxxxo--o--": [
            "lose",
            0,
            null
        ],
        "xxox---o--": [
            "win",
            3,
            9
        ],
        "oxx-o--x-o": [
            "tie",
            4,
            3
        ],
        "oxox-x-o--": [
            "tie",
            4,
            9
        ],
        "ox---x---o": [
            "tie",
            6,
            3
        ],
        "xx---xo--o": [
            "win",
            3,
            3
        ],
        "oxx--x--oo": [
            "win",
            1,
            7
        ],
        "xxx--x-ooo": [
            "lose",
            0,
            null
        ],
        "xxx--xo-oo": [
            "win",
            1,
            3
        ],
        "oxx-xxo-oo": [
            "win",
            1,
            7
        ],
        "xxxoxxo-oo": [
            "lose",
            0,
            null
        ],
        "xxx-ox--oo": [
            "win",
            1,
            3
        ],
        "xxxo-x--oo": [
            "lose",
            2,
            7
        ],
        "oxxoxx--oo": [
            "win",
            1,
            7
        ],
        "xxxoxxoo-o": [
            "lose",
            0,
            null
        ],
        "oxx--xo--o": [
            "win",
            1,
            3
        ],
        "xxx--xoo-o": [
            "win",
            1,
            8
        ],
        "xxx-oxo--o": [
            "win",
            1,
            8
        ],
        "xxxo-xo--o": [
            "lose",
            0,
            null
        ],
        "xx-o-x---o": [
            "tie",
            5,
            6
        ],
        "oxx--x-o-o": [
            "win",
            1,
            8
        ],
        "xxx-ox-o-o": [
            "win",
            1,
            8
        ],
        "xxxo-x-o-o": [
            "win",
            1,
            8
        ],
        "oxxoxx-o-o": [
            "win",
            1,
            8
        ],
        "oxxo-x---o": [
            "win",
            1,
            6
        ],
        "xxxoox---o": [
            "win",
            1,
            8
        ],
        "xxo--x---o": [
            "win",
            3,
            7
        ],
        "oxx-ox---o": [
            "lose",
            2,
            8
        ],
        "oxx------o": [
            "win",
            5,
            3
        ],
        "xxx-----oo": [
            "win",
            1,
            3
        ],
        "oxx-x-o--o": [
            "win",
            1,
            3
        ],
        "xxx-x-o-oo": [
            "win",
            1,
            7
        ],
        "xxxox---oo": [
            "win",
            1,
            7
        ],
        "xxx-xoo--o": [
            "win",
            1,
            7
        ],
        "xxxox-o--o": [
            "lose",
            0,
            null
        ],
        "xxx----o-o": [
            "win",
            1,
            3
        ],
        "oxxox----o": [
            "win",
            1,
            6
        ],
        "xxxox--o-o": [
            "lose",
            2,
            8
        ],
        "xxxoxo---o": [
            "win",
            1,
            7
        ],
        "xxx---o--o": [
            "win",
            1,
            3
        ],
        "xxx--o---o": [
            "win",
            1,
            3
        ],
        "oxx-xo---o": [
            "lose",
            2,
            8
        ],
        "xxx-o----o": [
            "win",
            1,
            3
        ],
        "xxxo-----o": [
            "lose",
            4,
            6
        ],
        "xx----o---": [
            "win",
            5,
            7
        ],
        "oxo------x": [
            "tie",
            6,
            5
        ],
        "xxo-----ox": [
            "win",
            1,
            5
        ],
        "oxox---xo-": [
            "win",
            1,
            5
        ],
        "xxoxo---ox": [
            "win",
            1,
            6
        ],
        "oxoxo-ox-x": [
            "win",
            1,
            5
        ],
        "xxoxo-oxox": [
            "win",
            1,
            5
        ],
        "oxoxoxoxox": [
            "lose",
            0,
            null
        ],
        "xxoxooox-x": [
            "lose",
            0,
            null
        ],
        "oxxxo-oxo-": [
            "lose",
            0,
            null
        ],
        "oxoxox--ox": [
            "lose",
            0,
            null
        ],
        "xxox-o-xo-": [
            "lose",
            0,
            null
        ],
        "xxoxo-ox--": [
            "win",
            1,
            5
        ],
        "oxx-o-oxox": [
            "win",
            1,
            5
        ],
        "xxx-oooxox": [
            "lose",
            0,
            null
        ],
        "oxoxoxox--": [
            "lose",
            0,
            null
        ],
        "oxx-o-o--x": [
            "win",
            1,
            5
        ],
        "xxx-o-o-ox": [
            "win",
            1,
            5
        ],
        "oxx-oxo-ox": [
            "lose",
            0,
            null
        ],
        "xxx-o-oo-x": [
            "win",
            1,
            5
        ],
        "oxxoo-o-xx": [
            "win",
            1,
            5
        ],
        "xxxoo-ooxx": [
            "win",
            1,
            5
        ],
        "oxxooxooxx": [
            "lose",
            0,
            null
        ],
        "xxxoooo-xx": [
            "lose",
            0,
            null
        ],
        "oxx-oxoo-x": [
            "lose",
            0,
            null
        ],
        "xxx-ooo--x": [
            "lose",
            0,
            null
        ],
        "xxxoo-o--x": [
            "win",
            1,
            5
        ],
        "oxxooxo--x": [
            "lose",
            0,
            null
        ],
        "oxo--x--ox": [
            "lose",
            0,
            null
        ],
        "xxo----o-x": [
            "win",
            1,
            5
        ],
        "oxxo----ox": [
            "tie",
            4,
            5
        ],
        "xxxo---oox": [
            "win",
            1,
            5
        ],
        "oxxoo-xo-x": [
            "win",
            1,
            5
        ],
        "xxxoo-xoox": [
            "win",
            1,
            5
        ],
        "oxxooxxoox": [
            "lose",
            0,
            null
        ],
        "xxxoooxo-x": [
            "lose",
            0,
            null
        ],
        "oxxo-x-oox": [
            "lose",
            0,
            null
        ],
        "oxxox-oo-x": [
            "win",
            1,
            5
        ],
        "xxxox-ooox": [
            "win",
            1,
            5
        ],
        "oxxoxxooox": [
            "lose",
            0,
            null
        ],
        "xxxoxooo-x": [
            "lose",
            0,
            null
        ],
        "xxxo--o-ox": [
            "win",
            1,
            5
        ],
        "oxxo-xo-ox": [
            "lose",
            0,
            null
        ],
        "oxxox-o-ox": [
            "lose",
            2,
            7
        ],
        "xxxoxoo-ox": [
            "win",
            1,
            7
        ],
        "xxxo-o--ox": [
            "tie",
            3,
            7
        ],
        "oxxooox--x": [
            "win",
            1,
            7
        ],
        "xxxooox-ox": [
            "tie",
            1,
            7
        ],
        "oxxoxo--ox": [
            "win",
            1,
            7
        ],
        "xxxoo---ox": [
            "win",
            1,
            5
        ],
        "oxxoo-x-ox": [
            "tie",
            2,
            5
        ],
        "oxxoox--ox": [
            "lose",
            0,
            null
        ],
        "oxx---oo-x": [
            "lose",
            2,
            8
        ],
        "xxx---ooox": [
            "win",
            1,
            5
        ],
        "oxx--xooox": [
            "lose",
            0,
            null
        ],
        "xxx--ooo-x": [
            "win",
            1,
            3
        ],
        "oxxooo--xx": [
            "win",
            1,
            7
        ],
        "xxxooo-oxx": [
            "lose",
            0,
            null
        ],
        "xxxo--oo-x": [
            "win",
            1,
            5
        ],
        "oxxoo--oxx": [
            "win",
            1,
            5
        ],
        "oxxo-xoo-x": [
            "lose",
            0,
            null
        ],
        "oxo--x-o-x": [
            "lose",
            0,
            null
        ],
        "oxxoo----x": [
            "win",
            3,
            5
        ],
        "xxxoo--o-x": [
            "win",
            1,
            5
        ],
        "oxxoox-o-x": [
            "lose",
            0,
            null
        ],
        "xxxooo---x": [
            "lose",
            2,
            8
        ],
        "xxo---o--x": [
            "win",
            1,
            5
        ],
        "oxx-o---ox": [
            "lose",
            2,
            7
        ],
        "xxx-o--oox": [
            "win",
            1,
            5
        ],
        "oxx-o-xoox": [
            "lose",
            2,
            5
        ],
        "xxx-ooxoox": [
            "win",
            1,
            3
        ],
        "oxxxxooxoo": [
            "lose",
            0,
            null
        ],
        "oxx-ox-oox": [
            "lose",
            0,
            null
        ],
        "xxx-oo--ox": [
            "win",
            1,
            3
        ],
        "oxx-oo-xox": [
            "win",
            1,
            6
        ],
        "oxx-oox-ox": [
            "tie",
            2,
            3
        ],
        "oxxxoo--ox": [
            "lose",
            0,
            null
        ],
        "oxo---ox-x": [
            "lose",
            2,
            8
        ],
        "xxo--oox-x": [
            "win",
            1,
            8
        ],
        "oxoxoo-x-x": [
            "win",
            1,
            8
        ],
        "oxo--xo--x": [
            "lose",
            0,
            null
        ],
        "oxoxo--x--": [
            "win",
            3,
            5
        ],
        "xxoxoo-x--": [
            "lose",
            2,
            9
        ],
        "xxo--o---x": [
            "tie",
            5,
            8
        ],
        "oxx--o--ox": [
            "tie",
            4,
            3
        ],
        "xxx--o-oox": [
            "win",
            1,
            3
        ],
        "oxx-ooxo-x": [
            "win",
            1,
            3
        ],
        "oxxoxoo--x": [
            "win",
            1,
            7
        ],
        "xxx--oo-ox": [
            "win",
            1,
            3
        ],
        "oxx--ooxox": [
            "win",
            1,
            4
        ],
        "oxx-xoo-ox": [
            "lose",
            2,
            7
        ],
        "oxxxoo-xo-": [
            "lose",
            0,
            null
        ],
        "oxo--o-x-x": [
            "win",
            1,
            8
        ],
        "xxoxoo---x": [
            "win",
            1,
            6
        ],
        "oxx--oo--x": [
            "win",
            1,
            4
        ],
        "xxxo-oo--x": [
            "lose",
            2,
            8
        ],
        "oxxo-oo-xx": [
            "win",
            1,
            7
        ],
        "oxx-oo---x": [
            "win",
            1,
            6
        ],
        "xxx-oo-o-x": [
            "win",
            1,
            3
        ],
        "oxox-o-x--": [
            "win",
            1,
            8
        ],
        "xxo-o----x": [
            "win",
            1,
            5
        ],
        "oxx---o-ox": [
            "lose",
            2,
            7
        ],
        "oxoxo----x": [
            "lose",
            2,
            8
        ],
        "oxo-ox---x": [
            "lose",
            0,
            null
        ],
        "xxoo-----x": [
            "win",
            1,
            5
        ],
        "oxx----oox": [
            "lose",
            2,
            6
        ],
        "oxxo--o--x": [
            "win",
            3,
            5
        ],
        "oxoo-x---x": [
            "lose",
            0,
            null
        ],
        "oxx-o--o-x": [
            "lose",
            2,
            8
        ],
        "ox----x-o-": [
            "tie",
            6,
            5
        ],
        "xx-o--o-x-": [
            "win",
            3,
            9
        ],
        "ox-o-xo-x-": [
            "win",
            1,
            9
        ],
        "xx-o-xxoo-": [
            "win",
            1,
            9
        ],
        "oxxo-xoox-": [
            "lose",
            0,
            null
        ],
        "oxxo-xxoo-": [
            "win",
            1,
            9
        ],
        "xxxooxxoo-": [
            "win",
            1,
            9
        ],
        "xxo--xxoo-": [
            "win",
            1,
            9
        ],
        "oxxooxo-x-": [
            "lose",
            0,
            null
        ],
        "xxoo-xo-x-": [
            "win",
            1,
            9
        ],
        "oxx-oxxoo-": [
            "win",
            1,
            9
        ],
        "oxx---xoo-": [
            "win",
            1,
            9
        ],
        "xxx--oxoo-": [
            "win",
            1,
            3
        ],
        "oxxoxoo-x-": [
            "win",
            1,
            9
        ],
        "xxxoxoxoo-": [
            "lose",
            0,
            null
        ],
        "xxx-o-xoo-": [
            "win",
            1,
            3
        ],
        "xxxo--xoo-": [
            "lose",
            2,
            9
        ],
        "oxxox-xoo-": [
            "win",
            1,
            9
        ],
        "oxxo--o-x-": [
            "win",
            1,
            9
        ],
        "xxxo--oox-": [
            "win",
            1,
            5
        ],
        "xxxo-oo-x-": [
            "lose",
            2,
            9
        ],
        "xxxoo-o-x-": [
            "win",
            1,
            5
        ],
        "xx---ox-o-": [
            "tie",
            5,
            2
        ],
        "oxo--oxx--": [
            "win",
            1,
            8
        ],
        "xxo--oxxo-": [
            "lose",
            0,
            null
        ],
        "xxoxoo--x-": [
            "tie",
            3,
            6
        ],
        "oxx-ooxxo-": [
            "tie",
            2,
            3
        ],
        "oxx--oo-x-": [
            "win",
            1,
            4
        ],
        "xxx--ooox-": [
            "win",
            1,
            3
        ],
        "oxxoxox-o-": [
            "win",
            1,
            7
        ],
        "xxx-ooo-x-": [
            "lose",
            0,
            null
        ],
        "oxx--oox--": [
            "win",
            1,
            4
        ],
        "xxx--ooxo-": [
            "win",
            1,
            4
        ],
        "oxxxxoo-o-": [
            "lose",
            0,
            null
        ],
        "xxx-ooox--": [
            "lose",
            0,
            null
        ],
        "oxx--ox-o-": [
            "tie",
            4,
            3
        ],
        "xxx-oox-o-": [
            "win",
            1,
            3
        ],
        "xxxo-ox-o-": [
            "tie",
            3,
            7
        ],
        "xxo---o-x-": [
            "win",
            3,
            9
        ],
        "oxx---oxo-": [
            "lose",
            2,
            9
        ],
        "xxx-o-oxo-": [
            "win",
            1,
            3
        ],
        "oxx-oxoxo-": [
            "lose",
            2,
            9
        ],
        "oxo--xo-x-": [
            "tie",
            4,
            9
        ],
        "xxo--xoox-": [
            "win",
            1,
            9
        ],
        "oxxooxx-o-": [
            "tie",
            2,
            9
        ],
        "xxo-oxx-o-": [
            "win",
            1,
            9
        ],
        "oxoxoxo-x-": [
            "lose",
            2,
            9
        ],
        "oxx-o-x-o-": [
            "tie",
            4,
            3
        ],
        "xxxoo-x-o-": [
            "tie",
            3,
            5
        ],
        "oxoxo---x-": [
            "tie",
            4,
            5
        ],
        "xxoxo-o-x-": [
            "win",
            3,
            5
        ],
        "xx-o--x-o-": [
            "win",
            3,
            5
        ],
        "ox-o-xx-o-": [
            "lose",
            2,
            9
        ],
        "xxoo-xx-o-": [
            "win",
            1,
            9
        ],
        "oxx-oxoox-": [
            "lose",
            0,
            null
        ],
        "oxx---oox-": [
            "lose",
            2,
            9
        ],
        "xxx-o-oox-": [
            "win",
            1,
            5
        ],
        "oxxo--x-o-": [
            "win",
            3,
            7
        ],
        "xxo---x-o-": [
            "win",
            3,
            5
        ],
        "oxo---xxo-": [
            "win",
            1,
            5
        ],
        "oxo--xx-o-": [
            "lose",
            2,
            9
        ],
        "oxx-o-o-x-": [
            "win",
            1,
            5
        ],
        "oxx-o-ox--": [
            "win",
            1,
            5
        ],
        "ox-x----o-": [
            "lose",
            4,
            2
        ],
        "xxo---ox--": [
            "win",
            1,
            4
        ],
        "oxo--xox--": [
            "lose",
            2,
            9
        ],
        "xxo--xoxo-": [
            "win",
            1,
            9
        ],
        "oxxxoxo-o-": [
            "lose",
            0,
            null
        ],
        "xxoxox--o-": [
            "win",
            1,
            9
        ],
        "oxxxo---o-": [
            "lose",
            0,
            null
        ],
        "xx-x-o--o-": [
            "win",
            1,
            2
        ],
        "oxxx-o--o-": [
            "lose",
            0,
            null
        ],
        "xxox----o-": [
            "win",
            3,
            5
        ],
        "oxox-x--o-": [
            "lose",
            2,
            9
        ],
        "ox---xo---": [
            "lose",
            4,
            9
        ],
        "xx---xo-o-": [
            "win",
            1,
            9
        ],
        "oxx--xo-o-": [
            "lose",
            2,
            9
        ],
        "xxx--xooo-": [
            "win",
            1,
            9
        ],
        "oxxoxxo-o-": [
            "win",
            1,
            9
        ],
        "xxxoxxooo-": [
            "win",
            1,
            9
        ],
        "xxx-oxo-o-": [
            "win",
            1,
            9
        ],
        "xxxo-xo-o-": [
            "win",
            1,
            9
        ],
        "xx-o-x--o-": [
            "win",
            1,
            9
        ],
        "oxx--xoo--": [
            "lose",
            2,
            9
        ],
        "xxx-oxoo--": [
            "win",
            1,
            9
        ],
        "xxxo-xoo--": [
            "win",
            1,
            9
        ],
        "oxxoxxoo--": [
            "win",
            1,
            9
        ],
        "oxxo-x--o-": [
            "win",
            3,
            9
        ],
        "xxxo-x-oo-": [
            "win",
            1,
            9
        ],
        "xxxoox--o-": [
            "win",
            1,
            9
        ],
        "xxo--x--o-": [
            "win",
            1,
            9
        ],
        "oxo--x-xo-": [
            "lose",
            2,
            9
        ],
        "xxoxoxo---": [
            "win",
            1,
            9
        ],
        "oxx-oxo---": [
            "lose",
            2,
            9
        ],
        "xxxooxo---": [
            "win",
            1,
            9
        ],
        "xx-o-xo---": [
            "win",
            1,
            9
        ],
        "oxx--x-oo-": [
            "win",
            1,
            9
        ],
        "xxx-ox-oo-": [
            "win",
            1,
            9
        ],
        "oxxo-xo---": [
            "win",
            1,
            9
        ],
        "xxo--xo---": [
            "win",
            1,
            9
        ],
        "oxx-ox--o-": [
            "lose",
            2,
            9
        ],
        "oxoxox----": [
            "lose",
            2,
            9
        ],
        "oxx-----o-": [
            "tie",
            6,
            3
        ],
        "xxx----oo-": [
            "win",
            1,
            3
        ],
        "oxxox-o---": [
            "win",
            1,
            9
        ],
        "xxxox-o-o-": [
            "win",
            1,
            7
        ],
        "xxxox-oo--": [
            "lose",
            2,
            9
        ],
        "xxxoxoo---": [
            "win",
            1,
            7
        ],
        "xxx---o-o-": [
            "win",
            1,
            3
        ],
        "oxx-x-o-o-": [
            "lose",
            2,
            9
        ],
        "xxx-xoo-o-": [
            "win",
            1,
            7
        ],
        "xxx--o--o-": [
            "win",
            1,
            3
        ],
        "oxx--o-xo-": [
            "lose",
            2,
            9
        ],
        "xxx-oo-xo-": [
            "win",
            1,
            3
        ],
        "oxx-xoo---": [
            "lose",
            2,
            9
        ],
        "xxxoxo--o-": [
            "win",
            1,
            7
        ],
        "xxx-o---o-": [
            "win",
            1,
            3
        ],
        "oxx-o--xo-": [
            "tie",
            4,
            3
        ],
        "xxxo----o-": [
            "tie",
            5,
            7
        ],
        "oxxox---o-": [
            "win",
            3,
            7
        ],
        "oxo----x--": [
            "lose",
            4,
            4
        ],
        "xxo----xo-": [
            "win",
            1,
            4
        ],
        "oxxxo-o---": [
            "lose",
            0,
            null
        ],
        "xxo--o-x--": [
            "win",
            1,
            4
        ],
        "oxxxoo----": [
            "lose",
            0,
            null
        ],
        "xxoxo-----": [
            "win",
            3,
            9
        ],
        "oxx---o---": [
            "win",
            5,
            3
        ],
        "xxx---oo--": [
            "win",
            1,
            3
        ],
        "xxx--oo---": [
            "win",
            1,
            3
        ],
        "xxx-o-o---": [
            "win",
            1,
            3
        ],
        "xxxo--o---": [
            "lose",
            4,
            9
        ],
        "xx-o------": [
            "win",
            5,
            9
        ],
        "ox-o-----x": [
            "lose",
            4,
            5
        ],
        "xx-o---o-x": [
            "win",
            1,
            5
        ],
        "oxxo---o-x": [
            "win",
            1,
            5
        ],
        "xxxo-o-o-x": [
            "lose",
            0,
            null
        ],
        "ox-o-x-o-x": [
            "lose",
            0,
            null
        ],
        "xx-o-o---x": [
            "win",
            3,
            7
        ],
        "oxx--o-o-x": [
            "win",
            1,
            3
        ],
        "oxxo-o---x": [
            "win",
            1,
            7
        ],
        "ox-o----x-": [
            "tie",
            6,
            9
        ],
        "xx-o--xo--": [
            "win",
            3,
            5
        ],
        "ox-o--xox-": [
            "win",
            1,
            5
        ],
        "xx-o-oxox-": [
            "lose",
            0,
            null
        ],
        "xxoo--xox-": [
            "win",
            3,
            5
        ],
        "oxoo-xxox-": [
            "lose",
            2,
            9
        ],
        "xxoooxxox-": [
            "win",
            1,
            9
        ],
        "oxxoo-xox-": [
            "win",
            1,
            5
        ],
        "xxxoooxox-": [
            "lose",
            0,
            null
        ],
        "ox-o-xxo--": [
            "lose",
            2,
            9
        ],
        "xxoo-x-ox-": [
            "win",
            1,
            9
        ],
        "oxxooxxo--": [
            "lose",
            2,
            9
        ],
        "xxoo-xxo--": [
            "win",
            1,
            9
        ],
        "oxxoox-ox-": [
            "lose",
            0,
            null
        ],
        "oxxo---ox-": [
            "win",
            1,
            5
        ],
        "xxxo-o-ox-": [
            "lose",
            0,
            null
        ],
        "xxxoo--ox-": [
            "win",
            1,
            5
        ],
        "oxxo--xo--": [
            "win",
            1,
            5
        ],
        "xxxo-oxo--": [
            "lose",
            0,
            null
        ],
        "xxxoo-xo--": [
            "win",
            3,
            5
        ],
        "xx-o-o--x-": [
            "win",
            3,
            7
        ],
        "ox-o-ox-x-": [
            "win",
            1,
            7
        ],
        "xxo--oxox-": [
            "tie",
            3,
            3
        ],
        "oxxooox-x-": [
            "win",
            1,
            7
        ],
        "xxoo-ox-x-": [
            "win",
            3,
            7
        ],
        "oxx-ooxox-": [
            "win",
            1,
            3
        ],
        "oxx--oxo--": [
            "win",
            1,
            3
        ],
        "xxx-ooxo--": [
            "win",
            1,
            3
        ],
        "oxxo-o--x-": [
            "win",
            1,
            7
        ],
        "xxxooo--x-": [
            "lose",
            2,
            9
        ],
        "xxo---xo--": [
            "win",
            3,
            9
        ],
        "oxo---xox-": [
            "tie",
            4,
            5
        ],
        "xxooo-x-x-": [
            "win",
            3,
            9
        ],
        "oxoooxx-x-": [
            "tie",
            2,
            9
        ],
        "oxo--xxo--": [
            "lose",
            2,
            9
        ],
        "xxooox--x-": [
            "win",
            1,
            9
        ],
        "oxxoo---x-": [
            "win",
            3,
            5
        ],
        "xxoo----x-": [
            "win",
            3,
            9
        ],
        "oxoo--x-x-": [
            "lose",
            4,
            9
        ],
        "oxoo-x--x-": [
            "tie",
            4,
            9
        ],
        "oxx-o-xo--": [
            "lose",
            4,
            3
        ],
        "ox-o--x---": [
            "tie",
            6,
            4
        ],
        "xx-o-ox---": [
            "tie",
            5,
            7
        ],
        "oxx--o-ox-": [
            "win",
            1,
            3
        ],
        "xxx-oo-ox-": [
            "win",
            1,
            3
        ],
        "oxxo-ox---": [
            "win",
            1,
            7
        ],
        "xxxooox---": [
            "tie",
            3,
            7
        ],
        "xxo----ox-": [
            "tie",
            5,
            3
        ],
        "oxo--x-ox-": [
            "tie",
            4,
            9
        ],
        "xxoooxx---": [
            "win",
            1,
            9
        ],
        "oxxoo-x---": [
            "tie",
            4,
            5
        ],
        "xxoo--x---": [
            "win",
            3,
            5
        ],
        "oxoo-xx---": [
            "lose",
            2,
            9
        ],
        "oxx-o--ox-": [
            "lose",
            2,
            9
        ],
        "ox-o-x----": [
            "tie",
            6,
            9
        ],
        "xx-o-x-o--": [
            "win",
            1,
            9
        ],
        "oxxo-x-o--": [
            "lose",
            2,
            9
        ],
        "xxxoox-o--": [
            "win",
            1,
            9
        ],
        "xxo--x-o--": [
            "win",
            1,
            9
        ],
        "oxxoox----": [
            "lose",
            2,
            9
        ],
        "xxoo-x----": [
            "win",
            1,
            9
        ],
        "oxx-ox-o--": [
            "lose",
            2,
            9
        ],
        "oxx----o--": [
            "lose",
            4,
            3
        ],
        "xxx--o-o--": [
            "win",
            1,
            3
        ],
        "oxxoxo----": [
            "win",
            1,
            7
        ],
        "xxxoxo-o--": [
            "lose",
            0,
            null
        ],
        "xxx-o--o--": [
            "win",
            1,
            3
        ],
        "xxxo---o--": [
            "win",
            3,
            5
        ],
        "oxxox--o--": [
            "win",
            1,
            5
        ],
        "oxxo------": [
            "win",
            5,
            9
        ],
        "xxxo-o----": [
            "tie",
            5,
            7
        ],
        "xxxoo-----": [
            "win",
            3,
            5
        ],
        "xx---o----": [
            "tie",
            7,
            2
        ],
        "ox---o---x": [
            "tie",
            6,
            2
        ],
        "ox---ox---": [
            "tie",
            6,
            2
        ],
        "xxo--o--x-": [
            "win",
            3,
            7
        ],
        "oxo--ox-x-": [
            "tie",
            4,
            7
        ],
        "xxo-oox-x-": [
            "win",
            3,
            9
        ],
        "oxx-oox---": [
            "tie",
            4,
            3
        ],
        "oxox-o--x-": [
            "tie",
            4,
            4
        ],
        "xxo--ox---": [
            "tie",
            5,
            8
        ],
        "oxx-oo--x-": [
            "win",
            1,
            6
        ],
        "oxx-oo-x--": [
            "win",
            1,
            6
        ],
        "ox-x-o----": [
            "tie",
            6,
            2
        ],
        "xxox-o----": [
            "tie",
            5,
            8
        ],
        "oxx--o----": [
            "tie",
            6,
            3
        ],
        "xxx-oo----": [
            "win",
            1,
            3
        ],
        "xxo-------": [
            "win",
            5,
            7
        ],
        "oxo-----x-": [
            "tie",
            6,
            7
        ],
        "xxo-o-x---": [
            "win",
            3,
            9
        ],
        "oxo-o-x-x-": [
            "tie",
            4,
            9
        ],
        "oxo-oxx---": [
            "tie",
            4,
            9
        ],
        "oxo---x---": [
            "tie",
            6,
            5
        ],
        "oxo--x----": [
            "lose",
            4,
            9
        ],
        "xxo-ox----": [
            "win",
            1,
            9
        ],
        "oxx-o-----": [
            "lose",
            4,
            3
        ],
        "oxox------": [
            "tie",
            6,
            5
        ],
        "o-x-------": [
            "tie",
            8,
            1
        ],
        "xo----x---": [
            "win",
            5,
            3
        ],
        "oo----x-x-": [
            "win",
            5,
            7
        ],
        "xox-x----o": [
            "win",
            3,
            5
        ],
        "oox-x-x--o": [
            "win",
            1,
            5
        ],
        "xox-x-x-oo": [
            "win",
            1,
            5
        ],
        "oox-xxx-oo": [
            "lose",
            0,
            null
        ],
        "xoxox---xo": [
            "win",
            1,
            5
        ],
        "ooxox-xox-": [
            "win",
            1,
            5
        ],
        "xoxox-xoxo": [
            "win",
            1,
            5
        ],
        "ooxoxxxoxo": [
            "lose",
            0,
            null
        ],
        "xoxoxoxox-": [
            "lose",
            0,
            null
        ],
        "ooxoxx--xo": [
            "lose",
            0,
            null
        ],
        "xox-xox--o": [
            "lose",
            0,
            null
        ],
        "xoxox-xo--": [
            "win",
            1,
            5
        ],
        "ooxoxxxo--": [
            "lose",
            0,
            null
        ],
        "oox-xx---o": [
            "lose",
            2,
            8
        ],
        "xox-xxo--o": [
            "win",
            1,
            8
        ],
        "xoxoxx---o": [
            "win",
            1,
            8
        ],
        "xox---xo--": [
            "lose",
            4,
            4
        ],
        "oox---xox-": [
            "win",
            1,
            4
        ],
        "xox--oxox-": [
            "lose",
            2,
            9
        ],
        "ooxoxox-x-": [
            "win",
            1,
            9
        ],
        "xox-o-xox-": [
            "lose",
            0,
            null
        ],
        "oox--xxo--": [
            "win",
            1,
            4
        ],
        "xox--xxo-o": [
            "win",
            1,
            8
        ],
        "xox--xxoo-": [
            "win",
            1,
            4
        ],
        "ooxoxxo-x-": [
            "lose",
            0,
            null
        ],
        "xox-oxxo--": [
            "lose",
            0,
            null
        ],
        "ooxox---x-": [
            "win",
            3,
            5
        ],
        "xoxox-o-x-": [
            "win",
            1,
            5
        ],
        "xoxoxo--x-": [
            "lose",
            2,
            9
        ],
        "xo---ox-x-": [
            "win",
            3,
            9
        ],
        "oox--ox-x-": [
            "win",
            1,
            9
        ],
        "xox-oox-x-": [
            "lose",
            2,
            9
        ],
        "xoo---x-x-": [
            "win",
            5,
            3
        ],
        "ooo--xx-x-": [
            "win",
            1,
            3
        ],
        "xoo-oxx-x-": [
            "lose",
            2,
            9
        ],
        "oox-o-x-x-": [
            "win",
            1,
            7
        ],
        "oo---xx---": [
            "tie",
            6,
            4
        ],
        "xox--x---o": [
            "win",
            1,
            8
        ],
        "oox--x--xo": [
            "lose",
            0,
            null
        ],
        "oox--xx--o": [
            "lose",
            2,
            8
        ],
        "xox-oxx--o": [
            "win",
            1,
            8
        ],
        "xoxoxx-o--": [
            "win",
            1,
            8
        ],
        "xo---xx-o-": [
            "win",
            1,
            4
        ],
        "oox--xo-x-": [
            "lose",
            0,
            null
        ],
        "oox--xx-o-": [
            "tie",
            4,
            4
        ],
        "xox-oxx-o-": [
            "tie",
            3,
            7
        ],
        "xoxoxx--o-": [
            "win",
            1,
            6
        ],
        "ooxoxxx-o-": [
            "lose",
            0,
            null
        ],
        "xo-o-x--x-": [
            "win",
            1,
            2
        ],
        "ooxo-x--x-": [
            "lose",
            0,
            null
        ],
        "xoo--x--x-": [
            "tie",
            5,
            3
        ],
        "oox-oxx---": [
            "win",
            1,
            7
        ],
        "xoxoxxo---": [
            "win",
            1,
            8
        ],
        "xox--x-o--": [
            "win",
            1,
            8
        ],
        "oox--x-ox-": [
            "lose",
            0,
            null
        ],
        "ooxoxx----": [
            "lose",
            2,
            9
        ],
        "xoo--xx---": [
            "win",
            1,
            4
        ],
        "oox-ox--x-": [
            "lose",
            0,
            null
        ],
        "oox-----x-": [
            "win",
            5,
            5
        ],
        "xox-----xo": [
            "win",
            1,
            5
        ],
        "xox----ox-": [
            "win",
            1,
            5
        ],
        "ooxox-x---": [
            "win",
            3,
            5
        ],
        "xoxox-x-o-": [
            "win",
            1,
            5
        ],
        "xoxoxox---": [
            "lose",
            2,
            9
        ],
        "xox---o-x-": [
            "win",
            1,
            5
        ],
        "oox-x-x-o-": [
            "tie",
            4,
            5
        ],
        "xox-xox-o-": [
            "tie",
            3,
            9
        ],
        "xox--o--x-": [
            "lose",
            4,
            9
        ],
        "oox-xox---": [
            "win",
            1,
            9
        ],
        "xox-o---x-": [
            "win",
            1,
            5
        ],
        "xoxo----x-": [
            "win",
            1,
            5
        ],
        "oox---x---": [
            "win",
            5,
            7
        ],
        "xox---x--o": [
            "win",
            3,
            5
        ],
        "xox---x-o-": [
            "tie",
            5,
            4
        ],
        "xox--ox---": [
            "tie",
            5,
            9
        ],
        "xox-o-x---": [
            "win",
            5,
            7
        ],
        "xoxox-----": [
            "win",
            3,
            5
        ],
        "x-x-----o-": [
            "tie",
            7,
            1
        ],
        "o-x-x-o---": [
            "tie",
            6,
            1
        ],
        "x-x-x-o-o-": [
            "win",
            3,
            1
        ],
        "o-x-xxo-o-": [
            "win",
            3,
            9
        ],
        "xox-xxo-o-": [
            "tie",
            3,
            3
        ],
        "x-x-xoo---": [
            "win",
            3,
            1
        ],
        "o-x-xox-o-": [
            "win",
            3,
            9
        ],
        "xox-x-o---": [
            "tie",
            5,
            3
        ],
        "oox-xxo---": [
            "tie",
            4,
            8
        ],
        "o-x--x--o-": [
            "tie",
            6,
            1
        ],
        "x-x-ox--o-": [
            "win",
            3,
            3
        ],
        "xox--x--o-": [
            "tie",
            5,
            4
        ],
        "x-x-o-----": [
            "win",
            5,
            5
        ],
        "o-x-o---x-": [
            "win",
            5,
            5
        ],
        "x-x-o-o-x-": [
            "win",
            1,
            5
        ],
        "o-x-oxo-x-": [
            "lose",
            0,
            null
        ],
        "x-x-oo--x-": [
            "lose",
            4,
            6
        ],
        "o-x-ox----": [
            "lose",
            4,
            8
        ],
        "x-x-oxo---": [
            "win",
            1,
            8
        ],
        "xox--xo---": [
            "win",
            1,
            8
        ],
        "xox-ox----": [
            "win",
            1,
            8
        ],
        "x-x--o----": [
            "tie",
            7,
            1
        ],
        "o-x--o--x-": [
            "win",
            5,
            9
        ],
        "o-x-xo----": [
            "tie",
            6,
            1
        ],
        "xox-xo----": [
            "tie",
            5,
            9
        ],
        "xox-------": [
            "tie",
            7,
            4
        ],
        "oox--x----": [
            "tie",
            6,
            8
        ],
        "xoxo-x----": [
            "win",
            1,
            8
        ],
        "oox-x-----": [
            "tie",
            6,
            5
        ],
        "o----x----": [
            "tie",
            8,
            1
        ],
        "xo---x----": [
            "tie",
            7,
            2
        ],
        "x-o--x----": [
            "win",
            5,
            9
        ]
    }

}
var tictactoeai_p5 = new p5(b, 'tictactoeai');
