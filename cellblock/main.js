

// Better to use named constants then explicit numbers in the code
var EMPTY = 0, PLAYER1 = 1, PLAYER2 = 2;
var SIZE = 10;
var WIN_LENGTH = 5;
var PLAYER_HTML = ["", "<i class=\"fa fa-dollar\"></i>", "<i class=\"fa fa-btc\"></i>"] // The content of the table for each player

var board; // This will hold a two dimensional array that will represent the board
var currentPlayer; // This will hold the index of the current player (PLAYER1/PLAYER2/EMPTY)


// Generates the table on which the game will be played
// The functions creates an empty string, the outer loops represets rows (tr) 
// and the inner loop represents cells in each row
function generate_table_html(height, width) {
    result = "";
    for (var i = 0; i < height; i++) {
        result += "<tr>\n"; // row open tag. + is used to concatenate strings.
        for (var j = 0; j < width; j++) {
            // The "replace" is a string method. It takes as an argument a regular expression (read more online).
            // /row/g means - replace ALL occurrences of the word row (g stands for global).
            // This is used to create proper unique ids and unique handle_click parameters for each cell
            cell_td_tag = "<td id=\"cell_row_col\" onclick=\"handle_click(row,col)\"></td>\n".replace(/row/g, i).replace(/col/g, j);
            result += cell_td_tag;
        }
        result += "<\tr>\n" // row closing tag
    }
    return result;
}

// Initialzes the two dimensional array to hold empty cells
function init_board(height, width) {
    board = []; // an empty array
    for (var i = 0; i < height; i++) {
        row = [] 
        for (var j = 0; j < width; j++) {
            row.push(EMPTY); // push adds an element to the array
        }
        board.push(row);
    }
}

// Handles the on_click event on a cell
function handle_click(i, j) {
    if (currentPlayer == EMPTY) {
        return; // Game over
    }
    if (board[i][j] != EMPTY) {
        return; // Do nothing if cell is occupied
    }
    board[i][j] = currentPlayer;
    // jQuery for getting a specific cell and changing its html content
    $("#cell_row_col".replace("row", i).replace("col", j))
        .html(PLAYER_HTML[currentPlayer]); 
    test_victory(currentPlayer, i, j);
    currentPlayer = PLAYER1 + PLAYER2 - currentPlayer; // Switch current player
}

// Tries to find WIN_LENGTH consecutive cells of a given players from a given point (i,j) in a given direction (di,dj)
function test_win(player, i, j, di, dj) {
    var count = 0;
    while (i >= 0 && j >= 0 && i < SIZE && j < SIZE) {
        if (board[i][j] == player) {
            count++;
        }
        else {
            count = 0;
        }
        if (count == WIN_LENGTH) {
            handle_win(i - WIN_LENGTH * di, j - WIN_LENGTH * dj, di, dj)
        }
        i += di;
        j += dj;
    }
}

// Mark winning sequence and change the current player to EMPTY
function handle_win(i, j, di, dj) {
    for (var k = 0; k < WIN_LENGTH; k++) {
        i += di;
        j += dj;
        $("#cell_row_col".replace("row", i).replace("col", j)).addClass("wincell"); // This code adds a css class to the given tag
    }
    currentPlayer = EMPTY;
}

// Given the last played cell (i,j), try all possible rows, columns and diagonals on which a winning sequence is possible
function test_victory(player, i, j) {
    test_win(player, i, 0, 0, 1);
    test_win(player, i, 0, 1, 1);
    test_win(player, 0, j, 1, 0);
    test_win(player, 0, j, 1, 1);
    if (i > j) {
        test_win(player, i - j, 0, 1, 1);
    }
    else {
        test_win(player, 0, j - i, 1, 1);
    }
    if (i + j < SIZE) {
        test_win(player, 0, i + j, 1, -1);
    }
    else {
        test_win(player, i + j + 1 - SIZE, SIZE - 1, 1, -1);
    }
}

// This means: when the document is ready, run the code inside the block
$(document).ready(function () {

    var tableContents = generate_table_html(SIZE, SIZE);
    init_board(SIZE, SIZE);
    currentPlayer = PLAYER1;
    $("#gameTable").html(tableContents); // Set the html of the object whose id is gameTable to variable tableContents

});

