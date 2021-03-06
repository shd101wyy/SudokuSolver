﻿// global variable
var CURRENT_SELECTIONS = null;
var CURRENT_CHOSEN_BLOCK = null;
var CURRENT_BOARD = null;
var CURRENT_SIZE = 3;
var SOLVE_TEXT = null;
var CAN_CHANGE = false;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

// get canvas
var paper = Raphael(0, 0, WIDTH, HEIGHT);
// draw background
//var background = paper.rect(0, 0, WIDTH, HEIGHT);
//background.attr("fill", "#60a0f9");
var background = paper.image("/images/background_image.jpg", 0, 0, WIDTH, HEIGHT);
//var image = document.getElementById('background');
/*
image.onload = function(){
    var engine = new RainyDay({
                image: this
            });
    engine.rain([ [1, 2, 8000] ]);
    engine.rain([ [3, 3, 0.88], [5, 5, 0.9], [6, 2, 1] ], 100);
}
*/
//image.crossOrigin = 'anonymous';
//image.src = 'http://i.imgur.com/N7ETzFO.jpg';


/*
    draw text in block
    x: block left coord
    y: block top coord
    width: block width
    text: text to draw on block
    block: bind text object to that block
*/
var drawTextInBlock = function (x, y, width, height, text, block, f) {
    var font_size = width * 0.4;
    var left = x + width * 0.5;
    var top = y + height / 2;
    var t = paper.text(left, top, text).attr({ "fill": "white", "font-size": typeof (f) === "undefined" ? font_size : f });
    block.text_object = t;
}

/*
    clear current selection
*/
var clearSelection = function () {
    if (CURRENT_SELECTIONS == null) return;
    if (CURRENT_CHOSEN_BLOCK !== null) {
        // restore fill color
        CURRENT_CHOSEN_BLOCK.attr("fill", CURRENT_CHOSEN_BLOCK.original_fill_color);
        CURRENT_CHOSEN_BLOCK = null;
    }
    // console.log("selections length " + CURRENT_SELECTIONS.length);
    for (var i = 0; i < CURRENT_SELECTIONS.length; i++) {
        // paper.remove(CURRENT_SELECTIONS[i]);
        CURRENT_SELECTIONS[i].text_object.remove();
        CURRENT_SELECTIONS[i].remove();
    }
    CURRENT_SELECTIONS = null;
}

/*
 *  draw selections
 *  n: num
 *  block: draw selections next to that block
 *  y : top
 */
var drawSelectionsPanel = function (n, block, x, y) {

    // var x = block.attr("x");
    // var y = block.attr("y");
    var b_width = block.attr("width");
    if (n == 4) b_width *= 0.6;

    var selections = [];

    clearSelection(); // clear current selections panel
    CURRENT_SELECTIONS = selections; // set current selections
    CURRENT_CHOSEN_BLOCK = block; // set current chosen block

    // draw close
    var left = x + b_width;
    var top = y;
    var r = paper.rect(left, top, b_width, b_width);
    r.attr({ "fill": "#f04848", "stroke": "#454545", "stroke-width": 5, "stroke-linecap": "round" });
    drawTextInBlock(left, top, b_width, b_width, "X", r);
    selections.push(r);

    r.click(function () {
        clearSelection();
        // console.log("Clear Selections");
    })

    // draw clear
    left = x;
    top = y;
    r = paper.rect(left, top, b_width, b_width);
    r.attr({ "fill": "#f04848", "stroke": "#454545", "stroke-width": 5, "stroke-linecap": "round" });
    drawTextInBlock(left, top, b_width, b_width, "_", r);
    selections.push(r);
    r.click(function () {
        CURRENT_CHOSEN_BLOCK.text_object.attr({"text":""});
    });

    for (var a = 0; a < n; a++) {
        // draw each selection
        left = x;
        top = y + b_width * (a + 1);
        r = paper.rect(left, top, b_width, b_width);
        r.attr({ "fill": "#454545", "stroke": "#524f4f", "stroke-width": 4, "stroke-linecap": "round" });
        drawTextInBlock(left, top, b_width, b_width, parseInt(a + 1), r);
        selections.push(r);
    }

    // add click event
    for (var i = 2; i < selections.length; i++) {
        selections[i].click(function () {
            CURRENT_CHOSEN_BLOCK.text_object.attr({ "text": this.text_object.attr("text") });
            // console.log(this.text_object.attr("text"))                    
        });
        selections[i].text_object.click(function () {
            CURRENT_CHOSEN_BLOCK.text_object.attr({ "text": this.attr("text") });
            // console.log(this.text_object.attr("text"))                    
        });
    }
}
/*
    remove current board
*/
var removeCurrentBoard = function () {
    for (var a = 0; a < CURRENT_BOARD.length; a++) {
        for (var b = 0; b < CURRENT_BOARD[a].length; b++) {
            var b_ = CURRENT_BOARD[a][b];
            b_.text_object.remove(); // remvoe text
            b_.remove(); // remove block
        }
    }
    CURRENT_BOARD = null;
}
/*
    draw change size panel
*/
var drawChangeSizePanel = function (block, b_width, x, y) {
    var selections = [];

    clearSelection(); // clear current selections panel
    CURRENT_SELECTIONS = selections; // set current selections
    CURRENT_CHOSEN_BLOCK = block; // set current chosen block

    // draw size
    var left = x;
    var top = y;
    var r = paper.rect(left, top, b_width, b_width);
    r.attr({ "fill": "#f04848", "stroke": "#454545", "stroke-width": 5, "stroke-linecap": "round" });
    drawTextInBlock(left, top, b_width, b_width, "choose", r, 20);
    selections.push(r);

    var s = ["2", "3", "4"/*, "5"*/];
    for (var a = 0; a < s.length; a++) {
        // draw each selection
        left = x;
        top = y + b_width * (a + 1);
        r = paper.rect(left, top, b_width, b_width);
        r.attr({ "fill": "#454545", "stroke": "#524f4f", "stroke-width": 4, "stroke-linecap": "round" });
        drawTextInBlock(left, top, b_width, b_width, s[a], r);
        selections.push(r);
    }
    // add click event
    for (var i = 1; i < selections.length; i++) {
        selections[i].click(function () {
            var n = parseInt(this.text_object.attr("text"));
            // clear current board
            removeCurrentBoard();
            // clear selection panel
            clearSelection();

            var board_width = HEIGHT * 0.8;
            var board_left = (WIDTH - board_width) / 2 * 0.6;
            var board_top = (HEIGHT - board_width) / 2 * 0.9;

            drawSudoku(board_left, board_top, board_width, n);

        });
        selections[i].text_object.click(function () {
            var n = parseInt(this.attr("text"));
            // clear current board
            removeCurrentBoard();
            // clear selection panel
            clearSelection();

            var board_width = HEIGHT * 0.8;
            var board_left = (WIDTH - board_width) / 2 * 0.6;
            var board_top = (HEIGHT - board_width) / 2 * 0.9;

            drawSudoku(board_left, board_top, board_width, n);

        });
    }

}

/*
    draw sudoku board
    x: left coord
    y: top  coord
    width: width of the board
    n : eg 3*3, 4*4, 5*5
*/
var drawSudoku = function (x, y, width, n) {
    CAN_CHANGE = true;
    clearSelection();
    var horizontal_num = n * n;
    var big_width = width / horizontal_num * n;
    var b_width = big_width / n; // width of each small block

    var board = [];
    CURRENT_BOARD = board;
    CURRENT_SIZE = n;
    var left, top, r;
    for (var i = 0; i < n * n; i++) {
        board.push([]);
    }
    // draw big
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            left = x + j * big_width;
            top = y + i * big_width;
            // draw big block
            r = paper.rect(left, top, big_width, big_width).attr({ "fill": "#9460e6", "stroke": "white", "stroke-width": 10 });
            // draw small inside
            for (var a = 0; a < n; a++) {
                for (var b = 0; b < n; b++) {
                    // draw small block
                    var small_r = paper.rect(left + b * b_width, top + a * b_width, b_width, b_width)
                    small_r.attr({ "fill": "#a982e8", "stroke": "white", "stroke-width": 2 });
                    small_r.animate({ "fill": "#9460e6" }, 200);
                    // add to board
                    board[i * n + a].push(small_r);

                    // draw text
                    drawTextInBlock(left + b * b_width, top + a * b_width, b_width, b_width, "", small_r);
                }
            }
        }
    }
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            r = board[i][j];
            r.click(function () {
                if (CAN_CHANGE === false) return;
                if (this == CURRENT_CHOSEN_BLOCK) return;
                this.original_fill_color = "#9460e6";
                this.attr({ "fill": "#454545" });
                // this.text_object.attr({"text":"=>"});
                drawSelectionsPanel(n * n, this, x + width + 5, y);
            })
        }
    }

    // when click background, clear selections panel
    background.click(function () {
        clearSelection();
    })
}

var solveSudoku = function () {
    if (CAN_CHANGE === false) return;
    SOLVE_TEXT.attr({ "opacity": 1 });
    var b = CURRENT_BOARD;
    var board = [];
    // format board
    for (var i = 0; i < b.length; i++) {
        board.push([]);
        for (var j = 0; j < b[i].length; j++) {
            var t = b[i][j].text_object.attr("text");
            board[i].push((t === "" || t.length === 0) ? 0 : parseInt(t));
        }
    }
    // console.log(board);
    var solutions = solve_sudoku(board);
    // console.log(solutions);
    // put solutions back to board
    for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < b[i].length; j++) {
            var t = b[i][j].text_object.attr("text");
            if (t === "" || t.length === 0) {
                b[i][j].animate({ "fill": "#e5703b" }, 200);
                // b[i][j].attr("fill", "#e5703b");
            }
            b[i][j].text_object.attr({ "text": parseInt(solutions[i][j]) });
        }
    }

    //SOLVE_TEXT.attr({ "text": "Done~~~"});
    SOLVE_TEXT.animate({ "opacity": 0 }, 2000);
    SOLVE_TEXT.attr("text", "Solving~~");

    clearSelection();

    CAN_CHANGE = false; // cannot change board
}



var board_width = HEIGHT * 0.8;
var board_left = (WIDTH - board_width) / 2 * 0.6;
var board_top = (HEIGHT - board_width) / 2 * 0.9;

drawSudoku(board_left, board_top, board_width, 3);


/* draw buttons */
var button_width = 300;
var button_height = 80;
// draw solve button
var x = WIDTH - button_width;
var y = HEIGHT * 0.25;
var r = paper.rect(x, y, button_width, button_height)
r.attr({ "fill": "#cc29d3", "stroke": "white", "stroke-width": 0 });
drawTextInBlock(x, y, button_width, button_height, "solve", r, 30);
r.click(function () {
    // solve sudoku
    solveSudoku();
})
r.text_object.click(function () {
    solveSudoku();
});

// draw board size button
//left = width - button_width * 2;
y = y + button_height * 1;
r = paper.rect(x, y, button_width, button_height).attr({ "fill": "#0aa4b1", "stroke": "white", "stroke-width": 0 });
drawTextInBlock(x, y, button_width, button_height, "change size", r, 30);
var this_y = y;
// add change board size function
r.click(function () {
    r.original_fill_color = r.attr("fill");
    drawChangeSizePanel(this, button_height, x - button_height, this_y);
})
// clear button
//left = width - button_width * 2;
y = y + button_height * 1;
r = paper.rect(x, y, button_width, button_height).attr({ "fill": "#72bf98", "stroke": "white", "stroke-width": 0 });
drawTextInBlock(x, y, button_width, button_height, "clear", r, 30);
// add change board size function
var clear_fn = function () {
    /*
    var board_width = HEIGHT * 0.8;
    var board_left = (WIDTH - board_width) / 2 * 0.6;
    var board_top = (HEIGHT - board_width) / 2 * 0.9;
    drawSudoku(board_left, board_top, board_width, CURRENT_SIZE);
    */
    for (var i = 0; i < CURRENT_BOARD.length; i++) {
        for (var j = 0; j < CURRENT_BOARD[i].length; j++) {
            CURRENT_BOARD[i][j].animate({ "fill": "#9460e6" }, 200); // restore color
            CURRENT_BOARD[i][j].text_object.attr({ "text": "" });
        }
    }
    CAN_CHANGE = true;
}
r.click(clear_fn);
r.text_object.click(clear_fn);

y = y + button_height * 2;
SOLVE_TEXT = paper.text(x, y, "Solving~~").attr({ "fill": "#9a5757", "font-size": 50, "opacity": 0 });
