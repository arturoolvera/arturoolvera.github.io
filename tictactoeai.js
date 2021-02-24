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
        s = sketch.getPos(sketch.mouseX, sketch.mouseY);
        if (grid[9] != 'e' && s != -1) {
            if (grid[9] == 'x' && grid[s] == '-') {
                grid[s] = 'x';
                grid[9] = 'o';
                sketch.drawMove(s, true);
                sketch.checkWin();
            } 
            if (grid[9] == 'o') {
                move = sketch.getMove();
                console.log(move);
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
        console.log(grid[9] + grid.slice(0,9).join(""));
        pos = sketch.getSymmetric(grid[9] + grid.slice(0,9).join(""));
        console.log(pos);
        move = soln[pos[0]][2];
        console.log("pre-move", move)
        adhoc = ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
        adhoc[move] = 'H';
        adhoc = adhoc.join("");
        console.log(adhoc)
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
        console.log(adhoc)
        move = adhoc.indexOf('H');
        console.log('postmove', move);
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
            9
        ],
        "ox--------": [
            "tie",
            8,
            5
        ],
        "xxo-------": [
            "win",
            5,
            4
        ],
        "oxox------": [
            "tie",
            6,
            5
        ],
        "xxoxo-----": [
            "win",
            3,
            5
        ],
        "oxoxox----": [
            "lose",
            2,
            6
        ],
        "xxoxoxo---": [
            "win",
            1,
            7
        ],
        "oxoxoxox--": [
            "lose",
            0,
            null
        ],
        "oxoxoxo-x-": [
            "lose",
            2,
            7
        ],
        "xxoxoxoox-": [
            "win",
            1,
            9
        ],
        "oxxooxoxox": [
            "lose",
            0,
            null
        ],
        "xxoxox-o--": [
            "win",
            1,
            9
        ],
        "oxx-ox-xoo": [
            "tie",
            2,
            3
        ],
        "xxxoox-xoo": [
            "tie",
            1,
            6
        ],
        "oxxooxxxoo": [
            "tie",
            0,
            null
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
        "oxoxox-ox-": [
            "tie",
            2,
            9
        ],
        "xxoxox-oxo": [
            "tie",
            1,
            6
        ],
        "oxoxox-o-x": [
            "lose",
            0,
            null
        ],
        "xxoxox--o-": [
            "win",
            1,
            7
        ],
        "oxx-oxoxo-": [
            "lose",
            2,
            3
        ],
        "xxxooxoxo-": [
            "win",
            1,
            9
        ],
        "oxoxox--ox": [
            "lose",
            0,
            null
        ],
        "xxoxox---o": [
            "win",
            1,
            7
        ],
        "oxxoox-xo-": [
            "tie",
            2,
            9
        ],
        "oxoxox-x-o": [
            "lose",
            0,
            null
        ],
        "oxoxox--xo": [
            "tie",
            2,
            7
        ],
        "oxx-o--xo-": [
            "tie",
            4,
            3
        ],
        "xxxoo--xo-": [
            "tie",
            3,
            9
        ],
        "oxxoo-xxo-": [
            "tie",
            2,
            9
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
        "xxxoo-xxoo": [
            "tie",
            1,
            5
        ],
        "oxxoo--xox": [
            "tie",
            2,
            5
        ],
        "xxxooo-xox": [
            "tie",
            1,
            6
        ],
        "xxxoo-oxox": [
            "win",
            1,
            5
        ],
        "xxx-oo-xo-": [
            "win",
            1,
            3
        ],
        "oxxxoo-xo-": [
            "lose",
            0,
            null
        ],
        "oxx-ooxxo-": [
            "tie",
            2,
            3
        ],
        "xxx-ooxxoo": [
            "win",
            1,
            3
        ],
        "oxxxxoooox": [
            "lose",
            0,
            null
        ],
        "oxx-oo-xox": [
            "win",
            1,
            6
        ],
        "xxx-oooxox": [
            "lose",
            0,
            null
        ],
        "xxx-o-oxo-": [
            "win",
            1,
            3
        ],
        "oxxxo-oxo-": [
            "lose",
            0,
            null
        ],
        "oxx-o-oxox": [
            "win",
            1,
            5
        ],
        "xxx-o--xoo": [
            "win",
            1,
            3
        ],
        "oxxxo--xoo": [
            "lose",
            0,
            null
        ],
        "oxx-o-xxoo": [
            "tie",
            2,
            3
        ],
        "oxoxo--x--": [
            "win",
            3,
            5
        ],
        "xxoxoo-x--": [
            "lose",
            2,
            6
        ],
        "oxoxoo-x-x": [
            "win",
            1,
            6
        ],
        "xxoxooox-x": [
            "lose",
            0,
            null
        ],
        "xxoxo-ox--": [
            "win",
            1,
            5
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
        "xxoxo--x-o": [
            "win",
            1,
            5
        ],
        "oxoxo---x-": [
            "tie",
            4,
            9
        ],
        "xxoxoo--x-": [
            "tie",
            3,
            6
        ],
        "oxx--ooxox": [
            "win",
            1,
            4
        ],
        "xxxo-ooxox": [
            "win",
            1,
            4
        ],
        "xxoxo-o-x-": [
            "win",
            3,
            5
        ],
        "xxoxo--ox-": [
            "win",
            3,
            9
        ],
        "oxxo--oxox": [
            "lose",
            2,
            4
        ],
        "xxoxo---xo": [
            "tie",
            3,
            7
        ],
        "oxoxo----x": [
            "lose",
            2,
            5
        ],
        "xxoxoo---x": [
            "win",
            1,
            6
        ],
        "xxoxo--o-x": [
            "win",
            1,
            5
        ],
        "xxoxo---ox": [
            "win",
            1,
            5
        ],
        "xxox-o----": [
            "tie",
            5,
            8
        ],
        "oxx-oo-x--": [
            "win",
            1,
            6
        ],
        "xxxooo-x--": [
            "tie",
            3,
            6
        ],
        "oxxoooxx--": [
            "tie",
            2,
            9
        ],
        "xxxoooxx-o": [
            "tie",
            1,
            8
        ],
        "oxxoooxxxo": [
            "tie",
            0,
            null
        ],
        "oxxooo-xx-": [
            "win",
            1,
            6
        ],
        "xxxooooxx-": [
            "lose",
            0,
            null
        ],
        "xxxooo-xxo": [
            "tie",
            1,
            6
        ],
        "oxxooo-x-x": [
            "win",
            1,
            6
        ],
        "xxxoooox-x": [
            "lose",
            0,
            null
        ],
        "xxx-ooox--": [
            "lose",
            0,
            null
        ],
        "xxx-oo-x-o": [
            "win",
            1,
            3
        ],
        "oxxxoo-x-o": [
            "lose",
            0,
            null
        ],
        "oxx-ooxx-o": [
            "tie",
            2,
            3
        ],
        "oxox-o-x--": [
            "win",
            1,
            8
        ],
        "xxox-o-xo-": [
            "lose",
            0,
            null
        ],
        "xxox-o-x-o": [
            "win",
            1,
            4
        ],
        "oxxo-o-xox": [
            "tie",
            2,
            4
        ],
        "oxox-o--x-": [
            "tie",
            4,
            9
        ],
        "xxox-o-ox-": [
            "tie",
            3,
            9
        ],
        "xxox---o--": [
            "win",
            3,
            9
        ],
        "oxxoo--x--": [
            "win",
            3,
            6
        ],
        "xxxoo-ox--": [
            "lose",
            2,
            5
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
        "oxxoo-oxx-": [
            "win",
            1,
            5
        ],
        "xxxoo-oxxo": [
            "lose",
            0,
            null
        ],
        "oxxoo-ox-x": [
            "win",
            1,
            5
        ],
        "xxxoo--x-o": [
            "tie",
            3,
            6
        ],
        "oxxoox-x-o": [
            "win",
            1,
            6
        ],
        "oxxoo-xx-o": [
            "tie",
            2,
            8
        ],
        "oxxoo--xxo": [
            "win",
            1,
            6
        ],
        "oxox-x-o--": [
            "tie",
            4,
            9
        ],
        "xxox-x-oo-": [
            "win",
            1,
            9
        ],
        "oxx-oxox-o": [
            "win",
            1,
            3
        ],
        "oxox-x-xoo": [
            "lose",
            0,
            null
        ],
        "xxox-x-o-o": [
            "tie",
            3,
            8
        ],
        "oxox-x-oxo": [
            "tie",
            2,
            6
        ],
        "oxx-o--x-o": [
            "tie",
            4,
            3
        ],
        "xxx-o-ox-o": [
            "win",
            1,
            3
        ],
        "oxxxo-ox-o": [
            "lose",
            0,
            null
        ],
        "oxox---ox-": [
            "tie",
            4,
            9
        ],
        "xxox---oxo": [
            "tie",
            3,
            6
        ],
        "oxox---x-o": [
            "lose",
            2,
            4
        ],
        "xxox---xoo": [
            "win",
            1,
            4
        ],
        "xxox----o-": [
            "win",
            3,
            5
        ],
        "oxx-o-ox--": [
            "win",
            1,
            5
        ],
        "oxox-x--o-": [
            "lose",
            2,
            4
        ],
        "oxox---xo-": [
            "win",
            1,
            5
        ],
        "oxx-o-----": [
            "lose",
            4,
            3
        ],
        "xxxoo-----": [
            "win",
            3,
            5
        ],
        "oxxoox----": [
            "lose",
            2,
            6
        ],
        "xxxooxo---": [
            "win",
            1,
            8
        ],
        "oxxooxo-x-": [
            "lose",
            0,
            null
        ],
        "oxxooxo--x": [
            "lose",
            0,
            null
        ],
        "xxxoox-o--": [
            "win",
            1,
            8
        ],
        "oxxooxxo--": [
            "lose",
            2,
            8
        ],
        "xxxooxxoo-": [
            "win",
            1,
            9
        ],
        "oxxooxxoox": [
            "lose",
            0,
            null
        ],
        "xxxooxxo-o": [
            "win",
            1,
            8
        ],
        "oxxooxxoxo": [
            "lose",
            0,
            null
        ],
        "oxxoox-ox-": [
            "lose",
            0,
            null
        ],
        "oxxoox-o-x": [
            "lose",
            0,
            null
        ],
        "xxxoox--o-": [
            "win",
            1,
            9
        ],
        "oxxooxx-o-": [
            "tie",
            2,
            9
        ],
        "xxxooxx-oo": [
            "tie",
            1,
            7
        ],
        "oxxoox--ox": [
            "lose",
            0,
            null
        ],
        "xxxoox---o": [
            "win",
            1,
            8
        ],
        "oxxooxx--o": [
            "tie",
            2,
            8
        ],
        "oxxoox--xo": [
            "lose",
            0,
            null
        ],
        "oxxoo-x---": [
            "tie",
            4,
            9
        ],
        "xxxooox---": [
            "tie",
            3,
            7
        ],
        "oxxooox-x-": [
            "win",
            1,
            7
        ],
        "xxxoooxox-": [
            "lose",
            0,
            null
        ],
        "xxxooox-xo": [
            "tie",
            1,
            7
        ],
        "oxxooox--x": [
            "win",
            1,
            7
        ],
        "xxxoooxo-x": [
            "lose",
            0,
            null
        ],
        "xxxooox-ox": [
            "tie",
            1,
            7
        ],
        "xxxoo-xo--": [
            "win",
            3,
            5
        ],
        "oxxoo-xox-": [
            "win",
            1,
            5
        ],
        "xxxoo-xoxo": [
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
        "xxxoo-x-o-": [
            "tie",
            3,
            9
        ],
        "oxxoo-x-ox": [
            "tie",
            2,
            5
        ],
        "xxxoo-x--o": [
            "tie",
            3,
            8
        ],
        "oxxoo-x-xo": [
            "tie",
            2,
            5
        ],
        "oxxoo---x-": [
            "win",
            3,
            5
        ],
        "xxxooo--x-": [
            "lose",
            2,
            6
        ],
        "oxxooo--xx": [
            "win",
            1,
            6
        ],
        "xxxoooo-xx": [
            "lose",
            0,
            null
        ],
        "xxxooo-oxx": [
            "lose",
            0,
            null
        ],
        "xxxoo-o-x-": [
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
        "xxxoo--ox-": [
            "win",
            1,
            5
        ],
        "oxxoo--oxx": [
            "win",
            1,
            5
        ],
        "xxxoo---xo": [
            "win",
            1,
            5
        ],
        "oxxoo----x": [
            "win",
            3,
            5
        ],
        "xxxooo---x": [
            "lose",
            2,
            6
        ],
        "xxxoo-o--x": [
            "win",
            1,
            5
        ],
        "xxxoo--o-x": [
            "win",
            1,
            5
        ],
        "xxxoo---ox": [
            "win",
            1,
            5
        ],
        "xxx-oo----": [
            "win",
            1,
            3
        ],
        "oxxxoo----": [
            "lose",
            0,
            null
        ],
        "oxx-oox---": [
            "tie",
            4,
            3
        ],
        "xxx-ooxo--": [
            "win",
            1,
            3
        ],
        "oxxxxoo--o": [
            "lose",
            0,
            null
        ],
        "oxx-ooxox-": [
            "win",
            1,
            3
        ],
        "xxx-ooxoxo": [
            "win",
            1,
            3
        ],
        "oxxxxoooxo": [
            "lose",
            0,
            null
        ],
        "oxx-ooxo-x": [
            "win",
            1,
            3
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
        "xxx-oox-o-": [
            "win",
            1,
            3
        ],
        "oxxxxoo-o-": [
            "lose",
            0,
            null
        ],
        "oxx-oox-ox": [
            "tie",
            2,
            3
        ],
        "xxx-oox--o": [
            "win",
            1,
            3
        ],
        "oxxxxooo--": [
            "lose",
            0,
            null
        ],
        "oxx-oox-xo": [
            "tie",
            2,
            3
        ],
        "oxx-oo--x-": [
            "win",
            1,
            6
        ],
        "xxx-ooo-x-": [
            "lose",
            0,
            null
        ],
        "xxx-oo-ox-": [
            "win",
            1,
            3
        ],
        "oxxxoo-ox-": [
            "lose",
            0,
            null
        ],
        "oxxo-oo-xx": [
            "win",
            1,
            4
        ],
        "xxx-oo--xo": [
            "win",
            1,
            3
        ],
        "oxxxoo--xo": [
            "lose",
            0,
            null
        ],
        "oxx-oo---x": [
            "win",
            1,
            6
        ],
        "xxx-ooo--x": [
            "lose",
            0,
            null
        ],
        "xxx-oo-o-x": [
            "win",
            1,
            3
        ],
        "oxxxoo-o-x": [
            "lose",
            0,
            null
        ],
        "xxx-oo--ox": [
            "win",
            1,
            3
        ],
        "oxxxoo--ox": [
            "lose",
            0,
            null
        ],
        "xxx-o-o---": [
            "win",
            1,
            3
        ],
        "oxxxo-o---": [
            "lose",
            0,
            null
        ],
        "oxx-oxo---": [
            "lose",
            2,
            3
        ],
        "xxx-oxoo--": [
            "win",
            1,
            3
        ],
        "oxxxoxoo--": [
            "lose",
            0,
            null
        ],
        "oxx-oxoox-": [
            "lose",
            0,
            null
        ],
        "oxx-oxoo-x": [
            "lose",
            0,
            null
        ],
        "xxx-oxo-o-": [
            "win",
            1,
            3
        ],
        "oxxxoxo-o-": [
            "lose",
            0,
            null
        ],
        "oxx-oxo-ox": [
            "lose",
            0,
            null
        ],
        "xxx-oxo--o": [
            "win",
            1,
            3
        ],
        "oxx-oxo-xo": [
            "lose",
            0,
            null
        ],
        "oxx-o-o-x-": [
            "win",
            1,
            5
        ],
        "xxx-o-oox-": [
            "win",
            1,
            3
        ],
        "oxxxo-oox-": [
            "lose",
            0,
            null
        ],
        "xxx-o-o-xo": [
            "win",
            1,
            3
        ],
        "oxx-o-o--x": [
            "win",
            1,
            5
        ],
        "xxx-o-oo-x": [
            "win",
            1,
            3
        ],
        "xxx-o-o-ox": [
            "win",
            1,
            3
        ],
        "xxx-o--o--": [
            "win",
            1,
            3
        ],
        "oxxxo--o--": [
            "lose",
            0,
            null
        ],
        "oxx-ox-o--": [
            "lose",
            2,
            3
        ],
        "xxx-ox-oo-": [
            "win",
            1,
            3
        ],
        "oxxxox-oo-": [
            "lose",
            0,
            null
        ],
        "oxx-oxxoo-": [
            "win",
            1,
            9
        ],
        "xxx-oxxooo": [
            "lose",
            0,
            null
        ],
        "oxx-ox-oox": [
            "lose",
            0,
            null
        ],
        "xxx-ox-o-o": [
            "win",
            1,
            3
        ],
        "oxxxox-o-o": [
            "lose",
            0,
            null
        ],
        "oxx-oxxo-o": [
            "win",
            1,
            8
        ],
        "oxx-ox-oxo": [
            "lose",
            0,
            null
        ],
        "oxx-o-xo--": [
            "lose",
            4,
            3
        ],
        "xxx-o-xoo-": [
            "win",
            1,
            3
        ],
        "oxxxx-o-oo": [
            "lose",
            0,
            null
        ],
        "oxx-o-xoox": [
            "lose",
            2,
            3
        ],
        "xxx-o-xo-o": [
            "win",
            1,
            3
        ],
        "oxxxx-oo-o": [
            "lose",
            0,
            null
        ],
        "oxx-o-xoxo": [
            "lose",
            2,
            3
        ],
        "oxx-o--ox-": [
            "lose",
            2,
            3
        ],
        "xxx-o--oxo": [
            "win",
            1,
            3
        ],
        "oxxxo--oxo": [
            "lose",
            0,
            null
        ],
        "oxx-o--o-x": [
            "lose",
            2,
            3
        ],
        "xxx-o--oox": [
            "win",
            1,
            3
        ],
        "oxxxo--oox": [
            "lose",
            0,
            null
        ],
        "xxx-o---o-": [
            "win",
            1,
            3
        ],
        "oxxxo---o-": [
            "lose",
            0,
            null
        ],
        "oxx-ox--o-": [
            "lose",
            2,
            3
        ],
        "xxx-ox--oo": [
            "win",
            1,
            3
        ],
        "oxxxox--oo": [
            "lose",
            0,
            null
        ],
        "oxx-oxx-oo": [
            "win",
            1,
            7
        ],
        "oxx-o-x-o-": [
            "tie",
            4,
            3
        ],
        "xxx-o-x-oo": [
            "win",
            1,
            3
        ],
        "oxxxx-ooo-": [
            "lose",
            0,
            null
        ],
        "oxx-o---ox": [
            "lose",
            2,
            3
        ],
        "xxx-o----o": [
            "win",
            1,
            3
        ],
        "oxxxo----o": [
            "lose",
            0,
            null
        ],
        "oxx-ox---o": [
            "lose",
            2,
            3
        ],
        "oxx-o-x--o": [
            "tie",
            4,
            3
        ],
        "oxx-o---xo": [
            "lose",
            2,
            3
        ],
        "oxo--x----": [
            "lose",
            4,
            9
        ],
        "xxoo-x----": [
            "win",
            1,
            9
        ],
        "oxoo-xx---": [
            "lose",
            2,
            4
        ],
        "xxoooxx---": [
            "win",
            1,
            9
        ],
        "oxoooxx-x-": [
            "tie",
            2,
            9
        ],
        "xxoooxxox-": [
            "win",
            1,
            9
        ],
        "oxxoxxooox": [
            "lose",
            0,
            null
        ],
        "xxoooxx-xo": [
            "tie",
            1,
            7
        ],
        "oxxo-xo-ox": [
            "lose",
            0,
            null
        ],
        "xxoo-xxo--": [
            "win",
            1,
            4
        ],
        "oxoo-xxox-": [
            "lose",
            2,
            4
        ],
        "xxoo-xxoxo": [
            "win",
            1,
            4
        ],
        "oxxo-xoo-x": [
            "lose",
            0,
            null
        ],
        "xxoo-xx-o-": [
            "win",
            1,
            4
        ],
        "oxoo-xxxo-": [
            "lose",
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
        "xxoo-xx--o": [
            "win",
            1,
            4
        ],
        "oxoo-xxx-o": [
            "tie",
            2,
            4
        ],
        "oxoo-xx-xo": [
            "tie",
            2,
            4
        ],
        "oxoo-x-x--": [
            "lose",
            2,
            4
        ],
        "xxoo-xox--": [
            "win",
            1,
            4
        ],
        "oxx--xoxoo": [
            "win",
            1,
            3
        ],
        "xxxo-xoxoo": [
            "lose",
            0,
            null
        ],
        "oxoo-xox-x": [
            "lose",
            0,
            null
        ],
        "xxoo-x-xo-": [
            "win",
            1,
            4
        ],
        "xxoo-x-x-o": [
            "win",
            1,
            4
        ],
        "oxxo-x-xoo": [
            "win",
            1,
            6
        ],
        "oxoo-x--x-": [
            "tie",
            4,
            9
        ],
        "xxooox--x-": [
            "win",
            1,
            9
        ],
        "oxx--xooox": [
            "lose",
            0,
            null
        ],
        "xxoo-xo-x-": [
            "win",
            1,
            9
        ],
        "xxoo-x-ox-": [
            "win",
            1,
            9
        ],
        "oxxo-x-oox": [
            "lose",
            0,
            null
        ],
        "xxoo-x--xo": [
            "tie",
            3,
            6
        ],
        "oxoo-x---x": [
            "lose",
            0,
            null
        ],
        "xxo-ox----": [
            "win",
            1,
            9
        ],
        "oxo-oxx---": [
            "tie",
            4,
            9
        ],
        "xxo-oxx-o-": [
            "win",
            1,
            9
        ],
        "xxo-oxx--o": [
            "tie",
            3,
            8
        ],
        "oxo-oxx-xo": [
            "tie",
            2,
            7
        ],
        "oxo-ox---x": [
            "lose",
            0,
            null
        ],
        "xxo--xo---": [
            "win",
            1,
            9
        ],
        "oxo--xox--": [
            "lose",
            2,
            3
        ],
        "xxo--xoxo-": [
            "win",
            1,
            3
        ],
        "xxo--xox-o": [
            "win",
            1,
            3
        ],
        "oxxo-xoxo-": [
            "win",
            1,
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
        "xxo--xo-xo": [
            "tie",
            3,
            3
        ],
        "oxo--xo--x": [
            "lose",
            0,
            null
        ],
        "xxo--x-o--": [
            "win",
            1,
            9
        ],
        "oxo--xxo--": [
            "lose",
            2,
            3
        ],
        "xxo--xxoo-": [
            "win",
            1,
            4
        ],
        "xxo--xxo-o": [
            "win",
            1,
            4
        ],
        "oxo--xxoxo": [
            "tie",
            2,
            4
        ],
        "oxo--x-ox-": [
            "tie",
            4,
            9
        ],
        "xxo--x-oxo": [
            "tie",
            3,
            6
        ],
        "oxo--x-o-x": [
            "lose",
            0,
            null
        ],
        "xxo--x--o-": [
            "win",
            1,
            9
        ],
        "oxo--xx-o-": [
            "lose",
            2,
            3
        ],
        "xxo--xx-oo": [
            "win",
            1,
            4
        ],
        "oxo--x-xo-": [
            "lose",
            2,
            3
        ],
        "oxo--x--ox": [
            "lose",
            0,
            null
        ],
        "xxo--x---o": [
            "win",
            3,
            4
        ],
        "oxo--xx--o": [
            "tie",
            4,
            4
        ],
        "oxo--x-x-o": [
            "lose",
            2,
            3
        ],
        "oxo--x--xo": [
            "tie",
            4,
            7
        ],
        "oxo---x---": [
            "tie",
            6,
            5
        ],
        "xxoo--x---": [
            "win",
            3,
            4
        ],
        "oxoo--xx--": [
            "lose",
            4,
            4
        ],
        "xxoo-oxx--": [
            "win",
            1,
            4
        ],
        "oxx--oxxoo": [
            "lose",
            2,
            3
        ],
        "xxxo-oxxoo": [
            "win",
            1,
            4
        ],
        "oxxo-oox-x": [
            "win",
            1,
            4
        ],
        "xxoo--xxo-": [
            "win",
            1,
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
        "oxoo--x-x-": [
            "lose",
            4,
            4
        ],
        "xxooo-x-x-": [
            "win",
            3,
            9
        ],
        "oxxox-o-ox": [
            "lose",
            2,
            5
        ],
        "xxxoxoo-ox": [
            "win",
            1,
            7
        ],
        "xxxox-ooox": [
            "win",
            1,
            5
        ],
        "xxoo-ox-x-": [
            "win",
            3,
            7
        ],
        "oxxoxoo--x": [
            "win",
            1,
            7
        ],
        "xxxoxooo-x": [
            "lose",
            0,
            null
        ],
        "xxoo--xox-": [
            "win",
            3,
            5
        ],
        "oxxox-oo-x": [
            "win",
            1,
            5
        ],
        "xxoo--x-xo": [
            "win",
            3,
            4
        ],
        "oxxo--o--x": [
            "win",
            3,
            5
        ],
        "xxxo-oo--x": [
            "lose",
            2,
            4
        ],
        "xxxo--oo-x": [
            "win",
            1,
            5
        ],
        "xxxo--o-ox": [
            "win",
            1,
            5
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
        "xxo-oox-x-": [
            "win",
            3,
            9
        ],
        "oxx-xoo-ox": [
            "lose",
            2,
            3
        ],
        "xxo-o-x-xo": [
            "tie",
            3,
            7
        ],
        "oxx---o-ox": [
            "lose",
            2,
            3
        ],
        "xxx--oo-ox": [
            "win",
            1,
            3
        ],
        "xxx---ooox": [
            "win",
            1,
            3
        ],
        "xxo--ox---": [
            "tie",
            5,
            8
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
        "xxo--oxx-o": [
            "win",
            1,
            4
        ],
        "oxxo-oxxo-": [
            "tie",
            2,
            4
        ],
        "oxo--ox-x-": [
            "tie",
            4,
            9
        ],
        "xxo--oxox-": [
            "tie",
            3,
            3
        ],
        "oxxoxo--ox": [
            "win",
            1,
            7
        ],
        "xxo--ox-xo": [
            "tie",
            3,
            7
        ],
        "oxx--oo--x": [
            "win",
            1,
            4
        ],
        "xxx--ooo-x": [
            "win",
            1,
            3
        ],
        "xxo---xo--": [
            "win",
            3,
            5
        ],
        "oxo---xox-": [
            "tie",
            4,
            9
        ],
        "xxo---xoxo": [
            "tie",
            3,
            5
        ],
        "oxx---oo-x": [
            "lose",
            2,
            3
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
        "oxo---x-xo": [
            "tie",
            4,
            7
        ],
        "oxo----x--": [
            "lose",
            4,
            4
        ],
        "xxoo---x--": [
            "win",
            1,
            4
        ],
        "oxx----xoo": [
            "lose",
            2,
            3
        ],
        "xxxo---xoo": [
            "win",
            1,
            4
        ],
        "xxx--o-xoo": [
            "win",
            1,
            3
        ],
        "oxxx-o-xoo": [
            "lose",
            0,
            null
        ],
        "xxx---oxoo": [
            "win",
            1,
            3
        ],
        "oxoo---x-x": [
            "lose",
            2,
            4
        ],
        "xxoo-o-x-x": [
            "win",
            1,
            4
        ],
        "xxoo--ox-x": [
            "win",
            1,
            4
        ],
        "xxo--o-x--": [
            "win",
            1,
            4
        ],
        "oxx--o-xo-": [
            "lose",
            2,
            3
        ],
        "xxxo-o-xo-": [
            "win",
            1,
            4
        ],
        "xxx--ooxo-": [
            "win",
            1,
            3
        ],
        "oxo--o-x-x": [
            "win",
            1,
            8
        ],
        "xxo--oox-x": [
            "win",
            1,
            4
        ],
        "xxo---ox--": [
            "win",
            1,
            4
        ],
        "oxx---oxo-": [
            "lose",
            2,
            3
        ],
        "xxxo--oxo-": [
            "win",
            1,
            4
        ],
        "oxo---ox-x": [
            "lose",
            2,
            3
        ],
        "xxo----xo-": [
            "win",
            1,
            4
        ],
        "xxo----x-o": [
            "win",
            1,
            4
        ],
        "oxxo---xo-": [
            "tie",
            4,
            4
        ],
        "oxo-----x-": [
            "tie",
            6,
            9
        ],
        "xxoo----x-": [
            "win",
            3,
            7
        ],
        "oxx----oox": [
            "lose",
            2,
            3
        ],
        "xxxo---oox": [
            "win",
            1,
            5
        ],
        "xxx--o-oox": [
            "win",
            1,
            3
        ],
        "xxo--o--x-": [
            "win",
            3,
            7
        ],
        "oxx--o--ox": [
            "tie",
            4,
            3
        ],
        "xxxo-o--ox": [
            "tie",
            3,
            7
        ],
        "xxo---o-x-": [
            "win",
            3,
            7
        ],
        "xxo----ox-": [
            "tie",
            5,
            9
        ],
        "oxxo----ox": [
            "tie",
            4,
            5
        ],
        "xxo-----xo": [
            "tie",
            5,
            7
        ],
        "oxo------x": [
            "tie",
            6,
            5
        ],
        "xxoo-----x": [
            "win",
            1,
            5
        ],
        "xxo-o----x": [
            "win",
            1,
            5
        ],
        "xxo--o---x": [
            "tie",
            5,
            8
        ],
        "xxo---o--x": [
            "win",
            1,
            5
        ],
        "xxo----o-x": [
            "win",
            1,
            5
        ],
        "xxo-----ox": [
            "win",
            1,
            5
        ],
        "xx-o------": [
            "win",
            5,
            4
        ],
        "oxxo------": [
            "win",
            5,
            6
        ],
        "xxxo-o----": [
            "tie",
            5,
            7
        ],
        "oxxoxo----": [
            "win",
            1,
            7
        ],
        "xxxoxoo---": [
            "win",
            1,
            7
        ],
        "oxxxxo-oo-": [
            "lose",
            0,
            null
        ],
        "oxxoxoo-x-": [
            "win",
            1,
            7
        ],
        "xxxoxoxoo-": [
            "lose",
            0,
            null
        ],
        "xxxoxoo-xo": [
            "lose",
            0,
            null
        ],
        "xxxoxo-o--": [
            "lose",
            0,
            null
        ],
        "xxxoxo--o-": [
            "win",
            1,
            7
        ],
        "oxxoxox-o-": [
            "win",
            1,
            7
        ],
        "xxxoxox-oo": [
            "win",
            1,
            7
        ],
        "xxxoxo---o": [
            "win",
            1,
            7
        ],
        "oxxoxox--o": [
            "win",
            1,
            7
        ],
        "xxxoxoxo-o": [
            "lose",
            0,
            null
        ],
        "oxxxxo-o-o": [
            "lose",
            0,
            null
        ],
        "oxxoxo--xo": [
            "win",
            1,
            6
        ],
        "oxxo-ox---": [
            "win",
            1,
            7
        ],
        "xxxo-oxo--": [
            "lose",
            0,
            null
        ],
        "xxxo-ox-o-": [
            "tie",
            3,
            7
        ],
        "xxxo-ox--o": [
            "tie",
            3,
            7
        ],
        "oxxo-oxx-o": [
            "tie",
            2,
            4
        ],
        "oxxo-ox-xo": [
            "win",
            1,
            7
        ],
        "xxxo-oxoxo": [
            "lose",
            0,
            null
        ],
        "oxxo-o-x--": [
            "tie",
            4,
            4
        ],
        "xxxo-oox--": [
            "win",
            1,
            4
        ],
        "oxxo-ooxx-": [
            "win",
            1,
            4
        ],
        "xxxo-ooxxo": [
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
        "oxxo-o--x-": [
            "win",
            1,
            7
        ],
        "xxxo-oo-x-": [
            "lose",
            2,
            4
        ],
        "xxxo-o-ox-": [
            "lose",
            0,
            null
        ],
        "xxxo-o--xo": [
            "lose",
            2,
            4
        ],
        "oxxo-o---x": [
            "win",
            1,
            7
        ],
        "xxxo-o-o-x": [
            "lose",
            0,
            null
        ],
        "xxxo--o---": [
            "lose",
            4,
            9
        ],
        "oxxox-o---": [
            "win",
            1,
            9
        ],
        "xxxox-oo--": [
            "lose",
            2,
            5
        ],
        "oxxoxxoo--": [
            "win",
            1,
            9
        ],
        "xxxoxxooo-": [
            "win",
            1,
            9
        ],
        "xxxoxxoo-o": [
            "lose",
            0,
            null
        ],
        "oxxox-xoo-": [
            "win",
            1,
            5
        ],
        "xxxox-xooo": [
            "lose",
            0,
            null
        ],
        "xxxox-o-o-": [
            "win",
            1,
            7
        ],
        "oxxoxxo-o-": [
            "win",
            1,
            9
        ],
        "xxxoxxo-oo": [
            "lose",
            0,
            null
        ],
        "xxxox-o--o": [
            "lose",
            0,
            null
        ],
        "oxxo-xo---": [
            "win",
            1,
            9
        ],
        "xxxo-xoo--": [
            "win",
            1,
            8
        ],
        "oxxo-xoox-": [
            "lose",
            0,
            null
        ],
        "xxxo-xo-o-": [
            "win",
            1,
            9
        ],
        "xxxo-xo--o": [
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
        "xxxo--o-xo": [
            "lose",
            0,
            null
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
        "xxxox--o-o": [
            "lose",
            2,
            5
        ],
        "oxxoxx-o-o": [
            "win",
            1,
            6
        ],
        "oxxox-xo-o": [
            "win",
            1,
            5
        ],
        "oxxo-x-o--": [
            "lose",
            2,
            4
        ],
        "xxxo-x-oo-": [
            "win",
            1,
            9
        ],
        "oxxo-xxoo-": [
            "win",
            1,
            9
        ],
        "xxxo-xxooo": [
            "lose",
            0,
            null
        ],
        "xxxo-x-o-o": [
            "win",
            1,
            8
        ],
        "oxxo-xxo-o": [
            "win",
            1,
            8
        ],
        "oxxo-x-oxo": [
            "lose",
            0,
            null
        ],
        "oxxo--xo--": [
            "win",
            1,
            5
        ],
        "xxxo--xoo-": [
            "lose",
            2,
            4
        ],
        "xxxo--xo-o": [
            "lose",
            2,
            4
        ],
        "oxxo--xoxo": [
            "win",
            1,
            5
        ],
        "oxxo---ox-": [
            "win",
            1,
            5
        ],
        "xxxo---oxo": [
            "win",
            1,
            5
        ],
        "oxxo---o-x": [
            "win",
            1,
            5
        ],
        "xxxo----o-": [
            "tie",
            5,
            9
        ],
        "oxxox---o-": [
            "win",
            3,
            7
        ],
        "xxxox---oo": [
            "win",
            1,
            7
        ],
        "oxxoxx--oo": [
            "win",
            1,
            6
        ],
        "oxxox-x-oo": [
            "win",
            1,
            7
        ],
        "oxxo-x--o-": [
            "win",
            3,
            9
        ],
        "xxxo-x--oo": [
            "lose",
            2,
            4
        ],
        "oxxo-xx-oo": [
            "win",
            1,
            7
        ],
        "oxxo--x-o-": [
            "win",
            3,
            7
        ],
        "xxxo--x-oo": [
            "tie",
            3,
            7
        ],
        "xxxo-----o": [
            "lose",
            4,
            6
        ],
        "oxxox----o": [
            "win",
            1,
            6
        ],
        "oxxo-x---o": [
            "win",
            1,
            6
        ],
        "oxxo--x--o": [
            "win",
            3,
            7
        ],
        "oxxo---x-o": [
            "win",
            1,
            6
        ],
        "oxxo----xo": [
            "win",
            1,
            6
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
        "oxxx-o-o--": [
            "lose",
            0,
            null
        ],
        "oxx--oxo--": [
            "win",
            1,
            3
        ],
        "xxx--oxoo-": [
            "win",
            1,
            3
        ],
        "oxxxxo--oo": [
            "lose",
            0,
            null
        ],
        "xxx--oxo-o": [
            "win",
            1,
            3
        ],
        "oxx--oxoxo": [
            "win",
            1,
            3
        ],
        "oxx--o-ox-": [
            "win",
            1,
            3
        ],
        "xxx--ooox-": [
            "win",
            1,
            3
        ],
        "xxx--o-oxo": [
            "win",
            1,
            3
        ],
        "oxxx-o-oxo": [
            "lose",
            0,
            null
        ],
        "oxx--o-o-x": [
            "win",
            1,
            3
        ],
        "xxx---oo--": [
            "win",
            1,
            3
        ],
        "oxx--xoo--": [
            "lose",
            2,
            3
        ],
        "xxx--xooo-": [
            "win",
            1,
            3
        ],
        "xxx--xoo-o": [
            "win",
            1,
            3
        ],
        "oxx--xooxo": [
            "lose",
            0,
            null
        ],
        "oxx---oox-": [
            "lose",
            2,
            3
        ],
        "xxx---ooxo": [
            "win",
            1,
            3
        ],
        "xxx----oo-": [
            "win",
            1,
            3
        ],
        "oxxx---oo-": [
            "lose",
            0,
            null
        ],
        "oxx--x-oo-": [
            "win",
            1,
            9
        ],
        "xxx--x-ooo": [
            "lose",
            0,
            null
        ],
        "oxx---xoo-": [
            "win",
            1,
            9
        ],
        "xxx---xooo": [
            "lose",
            0,
            null
        ],
        "xxx----o-o": [
            "win",
            1,
            3
        ],
        "oxxx---o-o": [
            "lose",
            0,
            null
        ],
        "oxx--x-o-o": [
            "win",
            1,
            8
        ],
        "oxx---xo-o": [
            "win",
            1,
            8
        ],
        "oxx----oxo": [
            "lose",
            2,
            3
        ],
        "ox-o-x----": [
            "tie",
            6,
            9
        ],
        "xx-o-xo---": [
            "win",
            1,
            9
        ],
        "ox-x-x-oo-": [
            "win",
            1,
            9
        ],
        "xx-x-x-ooo": [
            "lose",
            0,
            null
        ],
        "ox-o-xo-x-": [
            "win",
            1,
            9
        ],
        "xx-o-xxoo-": [
            "win",
            1,
            4
        ],
        "xx-o-xo-xo": [
            "lose",
            0,
            null
        ],
        "xx-o-x-o--": [
            "win",
            1,
            9
        ],
        "ox-o-xxo--": [
            "lose",
            2,
            2
        ],
        "xx-o-xxo-o": [
            "win",
            1,
            4
        ],
        "ox-o-xxoxo": [
            "lose",
            2,
            2
        ],
        "ox-o-x-o-x": [
            "lose",
            0,
            null
        ],
        "xx-o-x--o-": [
            "win",
            1,
            9
        ],
        "ox-o-xx-o-": [
            "lose",
            2,
            2
        ],
        "xx-o-xx-oo": [
            "win",
            1,
            4
        ],
        "xx-o-x---o": [
            "tie",
            5,
            6
        ],
        "ox-o-xx--o": [
            "tie",
            4,
            4
        ],
        "ox-x-x-o-o": [
            "win",
            1,
            8
        ],
        "ox-o-x--xo": [
            "win",
            1,
            6
        ],
        "ox-o--x---": [
            "tie",
            6,
            5
        ],
        "xx-o-ox---": [
            "tie",
            5,
            7
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
        "ox-o-ox-x-": [
            "win",
            1,
            7
        ],
        "xx-o-oxox-": [
            "lose",
            0,
            null
        ],
        "xx-o-ox-xo": [
            "tie",
            3,
            7
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
        "xx-o--xoxo": [
            "win",
            3,
            5
        ],
        "xx-o--x-o-": [
            "win",
            3,
            4
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
        "ox-o--x-xo": [
            "tie",
            4,
            5
        ],
        "ox-x---o--": [
            "lose",
            4,
            2
        ],
        "xx-x-o-o--": [
            "win",
            1,
            2
        ],
        "oxx--o-x-o": [
            "lose",
            2,
            3
        ],
        "xxx--oox-o": [
            "win",
            1,
            3
        ],
        "ox-x-o-x-o": [
            "lose",
            2,
            2
        ],
        "xx-x---oo-": [
            "win",
            1,
            2
        ],
        "oxx---ox-o": [
            "win",
            1,
            3
        ],
        "xx-x---o-o": [
            "win",
            1,
            2
        ],
        "ox-o----x-": [
            "tie",
            6,
            9
        ],
        "xx-o-o--x-": [
            "win",
            3,
            7
        ],
        "xx-o--o-x-": [
            "win",
            3,
            9
        ],
        "xx-o----xo": [
            "tie",
            5,
            6
        ],
        "ox-o-----x": [
            "lose",
            4,
            5
        ],
        "xx-o-o---x": [
            "win",
            3,
            7
        ],
        "xx-o---o-x": [
            "win",
            1,
            5
        ],
        "xx---o----": [
            "tie",
            7,
            9
        ],
        "oxx--o----": [
            "tie",
            6,
            3
        ],
        "xxx--oo---": [
            "win",
            1,
            3
        ],
        "oxx-xoo---": [
            "lose",
            2,
            3
        ],
        "xxx-xoo-o-": [
            "win",
            1,
            3
        ],
        "xxx-xoo--o": [
            "win",
            1,
            3
        ],
        "oxx-xox-oo": [
            "win",
            1,
            7
        ],
        "oxx--oox--": [
            "win",
            1,
            4
        ],
        "oxx--oo-x-": [
            "win",
            1,
            4
        ],
        "xxx--oo-xo": [
            "win",
            1,
            3
        ],
        "xxx--o--o-": [
            "win",
            1,
            3
        ],
        "oxxx-o--o-": [
            "lose",
            0,
            null
        ],
        "oxx--ox-o-": [
            "tie",
            4,
            3
        ],
        "xxx--ox-oo": [
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
            3
        ],
        "oxx--ox--o": [
            "tie",
            4,
            3
        ],
        "oxx--o--xo": [
            "win",
            3,
            3
        ],
        "ox-x-o----": [
            "tie",
            6,
            2
        ],
        "xx-x-o--o-": [
            "win",
            1,
            2
        ],
        "ox---ox---": [
            "tie",
            6,
            9
        ],
        "xx---ox-o-": [
            "tie",
            5,
            2
        ],
        "xx---ox--o": [
            "tie",
            5,
            8
        ],
        "ox---ox-xo": [
            "tie",
            4,
            7
        ],
        "ox---o---x": [
            "tie",
            6,
            8
        ],
        "xx----o---": [
            "win",
            5,
            3
        ],
        "oxx---o---": [
            "win",
            5,
            3
        ],
        "xxx---o-o-": [
            "win",
            1,
            3
        ],
        "oxx-x-o-o-": [
            "lose",
            2,
            3
        ],
        "xxx-x-o-oo": [
            "win",
            1,
            3
        ],
        "oxx-xxo-oo": [
            "win",
            1,
            3
        ],
        "oxx--xo-o-": [
            "lose",
            2,
            3
        ],
        "xxx--xo-oo": [
            "win",
            1,
            3
        ],
        "xxx---o--o": [
            "win",
            1,
            3
        ],
        "oxx-x-o--o": [
            "win",
            1,
            3
        ],
        "oxx--xo--o": [
            "win",
            1,
            3
        ],
        "oxx---o-xo": [
            "win",
            1,
            3
        ],
        "oxx-----o-": [
            "tie",
            6,
            3
        ],
        "xxx-----oo": [
            "win",
            1,
            3
        ],
        "oxx--x--oo": [
            "win",
            1,
            7
        ],
        "oxx---x-oo": [
            "win",
            1,
            7
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
        "xx---xo--o": [
            "win",
            3,
            3
        ],
        "ox---xx-oo": [
            "win",
            1,
            7
        ],
        "ox-x----o-": [
            "lose",
            4,
            2
        ],
        "ox----x-o-": [
            "tie",
            6,
            5
        ],
        "xx----x-oo": [
            "win",
            5,
            7
        ],
        "xx-------o": [
            "win",
            5,
            3
        ],
        "oxx------o": [
            "win",
            5,
            3
        ],
        "ox---x---o": [
            "tie",
            6,
            7
        ],
        "ox----x--o": [
            "tie",
            6,
            7
        ],
        "o-x-------": [
            "tie",
            8,
            8
        ],
        "xox-------": [
            "tie",
            7,
            9
        ],
        "oox-x-----": [
            "tie",
            6,
            8
        ],
        "xoxox-----": [
            "win",
            3,
            5
        ],
        "ooxoxx----": [
            "lose",
            2,
            6
        ],
        "xoxoxxo---": [
            "win",
            1,
            8
        ],
        "ooxoxxo-x-": [
            "lose",
            0,
            null
        ],
        "xoxoxx-o--": [
            "win",
            1,
            6
        ],
        "ooxoxxxo--": [
            "lose",
            0,
            null
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
        "xoxoxx---o": [
            "win",
            1,
            6
        ],
        "ooxoxx--xo": [
            "lose",
            0,
            null
        ],
        "ooxox-x---": [
            "win",
            3,
            5
        ],
        "xoxoxox---": [
            "lose",
            2,
            7
        ],
        "ooxoxox-x-": [
            "win",
            1,
            7
        ],
        "xoxoxoxox-": [
            "lose",
            0,
            null
        ],
        "xoxox-xo--": [
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
        "xoxox-x-o-": [
            "win",
            1,
            5
        ],
        "ooxox---x-": [
            "win",
            3,
            5
        ],
        "xoxoxo--x-": [
            "lose",
            2,
            6
        ],
        "xoxox-o-x-": [
            "win",
            1,
            5
        ],
        "xoxox---xo": [
            "win",
            1,
            5
        ],
        "xox-xo----": [
            "tie",
            5,
            9
        ],
        "oox-xox---": [
            "win",
            1,
            9
        ],
        "xox-xox-o-": [
            "tie",
            3,
            9
        ],
        "xox-xox--o": [
            "lose",
            0,
            null
        ],
        "xox-x-o---": [
            "tie",
            5,
            9
        ],
        "oox-xxo---": [
            "tie",
            4,
            8
        ],
        "xox-xxo-o-": [
            "tie",
            3,
            9
        ],
        "xox-xxo--o": [
            "win",
            1,
            8
        ],
        "oox-xxx-oo": [
            "lose",
            0,
            null
        ],
        "oox-x-x-o-": [
            "tie",
            4,
            5
        ],
        "xox-x-x-oo": [
            "win",
            1,
            5
        ],
        "xox-x----o": [
            "win",
            3,
            5
        ],
        "oox-xx---o": [
            "lose",
            2,
            3
        ],
        "oox-x-x--o": [
            "win",
            1,
            5
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
        "ooxo-x--x-": [
            "lose",
            0,
            null
        ],
        "xox-ox----": [
            "win",
            1,
            8
        ],
        "oox-oxx---": [
            "win",
            1,
            7
        ],
        "xox-oxxo--": [
            "lose",
            0,
            null
        ],
        "xox-oxx-o-": [
            "tie",
            3,
            7
        ],
        "xox-oxx--o": [
            "win",
            1,
            8
        ],
        "oox-ox--x-": [
            "lose",
            0,
            null
        ],
        "xox--xo---": [
            "win",
            1,
            8
        ],
        "oox--xo-x-": [
            "lose",
            0,
            null
        ],
        "xox--x-o--": [
            "win",
            1,
            8
        ],
        "oox--xxo--": [
            "win",
            1,
            4
        ],
        "xox--xxoo-": [
            "win",
            1,
            4
        ],
        "xox--xxo-o": [
            "win",
            1,
            4
        ],
        "oox--x-ox-": [
            "lose",
            0,
            null
        ],
        "xox--x--o-": [
            "tie",
            5,
            9
        ],
        "oox--xx-o-": [
            "tie",
            4,
            4
        ],
        "xox--x---o": [
            "win",
            1,
            8
        ],
        "oox--xx--o": [
            "lose",
            2,
            3
        ],
        "oox--x--xo": [
            "lose",
            0,
            null
        ],
        "oox---x---": [
            "win",
            5,
            7
        ],
        "xox-o-x---": [
            "win",
            5,
            7
        ],
        "oox-o-x-x-": [
            "win",
            1,
            7
        ],
        "xox-oox-x-": [
            "lose",
            2,
            3
        ],
        "xox-o-xox-": [
            "lose",
            0,
            null
        ],
        "xox--ox---": [
            "tie",
            5,
            9
        ],
        "oox--ox-x-": [
            "win",
            1,
            9
        ],
        "xox--oxox-": [
            "lose",
            2,
            3
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
        "xox---x-o-": [
            "tie",
            5,
            9
        ],
        "xox---x--o": [
            "win",
            3,
            5
        ],
        "oox-----x-": [
            "win",
            5,
            5
        ],
        "xoxo----x-": [
            "win",
            1,
            5
        ],
        "xox-o---x-": [
            "win",
            1,
            5
        ],
        "xox--o--x-": [
            "lose",
            4,
            9
        ],
        "xox---o-x-": [
            "win",
            1,
            5
        ],
        "xox----ox-": [
            "win",
            1,
            5
        ],
        "xox-----xo": [
            "win",
            1,
            5
        ],
        "x-x-o-----": [
            "win",
            5,
            1
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
        "o-x-oxo-x-": [
            "lose",
            0,
            null
        ],
        "xoo--xx---": [
            "win",
            1,
            4
        ],
        "ooo--xx-x-": [
            "win",
            1,
            3
        ],
        "xoo-oxx-x-": [
            "lose",
            2,
            3
        ],
        "x-x-ox--o-": [
            "win",
            3,
            1
        ],
        "o-x-xxo-o-": [
            "win",
            3,
            9
        ],
        "xo---xx-o-": [
            "win",
            1,
            4
        ],
        "o-x-x-o---": [
            "tie",
            6,
            7
        ],
        "x-x-xoo---": [
            "win",
            3,
            1
        ],
        "o-x-xox-o-": [
            "win",
            3,
            7
        ],
        "x-x-x-o-o-": [
            "win",
            3,
            1
        ],
        "xoo---x-x-": [
            "win",
            5,
            3
        ],
        "o-x-o---x-": [
            "win",
            5,
            5
        ],
        "x-x-oo--x-": [
            "lose",
            4,
            6
        ],
        "x-x-o-o-x-": [
            "win",
            1,
            5
        ],
        "x-x--o----": [
            "tie",
            7,
            9
        ],
        "o-x-xo----": [
            "tie",
            6,
            7
        ],
        "xo---ox-x-": [
            "win",
            3,
            9
        ],
        "o-x--o--x-": [
            "win",
            5,
            1
        ],
        "xo----x---": [
            "win",
            5,
            3
        ],
        "oo---xx---": [
            "tie",
            6,
            4
        ],
        "xoo--x--x-": [
            "tie",
            5,
            3
        ],
        "xo-o-x--x-": [
            "win",
            1,
            2
        ],
        "oo----x-x-": [
            "win",
            5,
            3
        ],
        "x-x-----o-": [
            "tie",
            7,
            9
        ],
        "o-x--x--o-": [
            "tie",
            6,
            9
        ],
        "o----x----": [
            "tie",
            8,
            9
        ],
        "xo---x----": [
            "tie",
            7,
            9
        ],
        "x-o--x----": [
            "win",
            5,
            1
        ]
    }

}
var tictactoeai_p5 = new p5(b, 'tictactoeai');
