// Game Setup
const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartButton = document.getElementById('restartButton');

// Game Logic
let blackCount = document.querySelectorAll('.cell.black');
let whiteCount = document.querySelectorAll('.cell.white');
let affectedTiles = []; // array of affected tiles
let blackClickableSpots = 0;
let whiteClickableSpots = 0;
let gameOver = false;

// Game Player
const blackPlayer = 2; // Assign numerical value "2" to player Black
let blackPlayerCount = document.getElementById('blackCounter');
const whitePlayer = 1; // Assign numerical value "1" to player Black
let whitePlayerCount = document.getElementById('whiteCounter');
let currentPlayer = 2; // Start with Black player

// Define game board layout with array
let gameBoardLayout = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

// Assign gameBoardLayout position to each cell
function assignLayoutPos() {
    // Loop through each row to access layout values
    for (let row = 0; row < gameBoardLayout.length; row++) {
        //Loop through each column to access layout values
        for (let col = 0; col < gameBoardLayout[row].length; col++) {
            const cellIndex = row * gameBoardLayout.length + col; // Generate index number of each cell i.e. row 0 * 8 cells + column 0
            const cell = cells[cellIndex]; // Access the cells array with index
            cell.dataset.row = row; // define row
            cell.dataset.col = col; // define column
        }
    }
}

// check if player can make any moves by iterating over every cell with checkIfClickable function
function checkMoves(player) {
    for (let row = 0; row < gameBoardLayout.length; row++) {
        for (let col = 0; col < gameBoardLayout[row].length; col++) {
            affectedTiles = []; // reset affectedTiles for next iteration
            let findAffectedTiles = [];
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            // get cell and check if "used" class exists. If no, run the check
            if (!cell.classList.contains('used')) {
                findAffectedTiles = checkIfClickable(row, col);
            }
            if (findAffectedTiles.length > 0) {
                cell.classList.add('clickableSpot');
                findAffectedTiles = []; // reset findAffectedTiles for next iteration
            }
        }
    }

    // check if any clickable spots, if not, gameover if no one can move or switch the player turn.
    const clickableSpots = document.getElementsByClassName('clickableSpot');
    if (player === 2) {
        blackClickableSpots = clickableSpots.length;
    } else if (player === 1) {
        whiteClickableSpots = clickableSpots.length;
    }

    if (clickableSpots.length === 0) {
        if (blackClickableSpots === 0 && whiteClickableSpots === 0) {
            gameOver = true;
            gameOverScreen();
        } else if (player === 2) {
            currentPlayer = 1;
            drawLayout();
        } else if (player === 1) {
            currentPlayer = 2;
            drawLayout();
        }
    }

}

function gameOverScreen() {
    if (blackCount.length === whiteCount.length) {
        statusText.innerText = "It's a tie!";
    } else if (blackCount.length > whiteCount.length) {
        statusText.innerText = "Black wins!";
    } else if (blackCount.length < whiteCount.length) {
        statusText.innerText = "White wins!";
    }
}

// Render the current game layout to game board
function drawLayout() {
    // Loop through each row to access layout values
    for (let row = 0; row < gameBoardLayout.length; row++) {
        //Loop through each column to access layout values
        for (let col = 0; col < gameBoardLayout[row].length; col++) {
            const colValue = gameBoardLayout[row][col]; // Get layout array value
            const cellIndex = row * gameBoardLayout.length + col; // Generate index number of each cell i.e. row 0 * 8 cells + column 0
            const cell = cells[cellIndex]; // Access the cells array with index
            cell.classList.remove('white');
            cell.classList.remove('black');
            cell.classList.remove('clickableSpot');
            if (colValue === 1) {
                cell.classList.add('white');
                cell.classList.add('used');
            } else if (colValue === 2) {
                cell.classList.add('black');
                cell.classList.add('used');
            }
            cell.dataset.value = gameBoardLayout[row][col];
        }
    }

    checkMoves(currentPlayer);
    countPlayerCells();
}

// Count how many Black and White in the game board and update UI
function countPlayerCells() {
    blackCount = document.querySelectorAll('.cell.black');
    const blackPlayerCount = document.getElementById('blackCounter');
    blackPlayerCount.innerText = blackCount.length;
    
    whiteCount = document.querySelectorAll('.cell.white');
    const whitePlayerCount = document.getElementById('whiteCounter');
    whitePlayerCount.innerText = whiteCount.length;
}

// Handle each cell click
function handleCellClick(event) {
    // Handle click event from the cell
    const cell = event.target;
    const isCell = cell.classList.contains('cell');

    const cellRow = parseInt(cell.dataset.row); // set and ensure row value is a number
    const cellCol = parseInt(cell.dataset.col); // set and ensure col value is a number

    // if cell already contains black or white, do not run functions
    if (cell.classList.contains('black') || cell.classList.contains('white')) {
        return;
    } else if (isCell) {
        checkIfClickable(cellRow, cellCol);
        if (!cell.classList.contains('clickableSpot')) {
            return;
        } else if (cell.classList.contains('clickableSpot')) {
            if (currentPlayer === 1) {
                cell.classList.add('white'); // add white tile to cell
                gameBoardLayout[cellRow][cellCol] = 1; // change gameBoardLayout value to 1
            } else if (currentPlayer === 2) {
                cell.classList.add('black'); // add black tile to cell
                gameBoardLayout[cellRow][cellCol] = 2; // change gameBoardLayout value to 2
            }

            flipTiles(affectedTiles);

            cell.classList.add('used'); // adding a class to prevent players to change cell values after it is set

            // Switch the player
            if (currentPlayer == 1) {
                currentPlayer = 2;
                statusText.innerText = "Black's Turn";
            } else if (currentPlayer == 2) {
                currentPlayer = 1;
                statusText.innerText = "White's Turn";
            }

            drawLayout();
        }
    }
}

// check if cells are clickable
function checkIfClickable(row, col) {
    // Default logic values
    let rowIndex = row;
    let colIndex = col;
    let tilesToFlip = 0;
    affectedTiles = []; // reset array of affected tiles

    /////////////////////////////////
    //    TOP LEFT BOTTOM RIGHT
    /////////////////////////////////

    // check towards the left
    const leftArr = []; // push values into an array to check if last value is equal to player tile
    while (colIndex > 0) {
        colIndex -= 1;
        const val = gameBoardLayout[rowIndex][colIndex];
        leftArr.push(val);
    }

    let isValidMove = checkTileValues(leftArr);

    // if valid move, cell is clickable
    if (isValidMove) {
        rowIndex = row;
        colIndex = col;
        tilesToFlip = isValidMove.length;
        while (colIndex > 0 && tilesToFlip > 0) {
            colIndex -= 1;
            tilesToFlip -= 1;
            const affectedTilePos = { row: rowIndex, col: colIndex }; // set affected tile as object
            affectedTiles.push(affectedTilePos); // push object into a global array
        }
    }

    // check towards the right
    const rightArr = []; // push values into an array to check if last value is equal to player tile
    rowIndex = row;
    colIndex = col;
    while (colIndex < 7) {
        colIndex += 1;
        const val = gameBoardLayout[rowIndex][colIndex];
        rightArr.push(val);
    }

    isValidMove = checkTileValues(rightArr);

    // if valid move, cell is clickable
    if (isValidMove) {
        colIndex = col;
        rowIndex = row;
        tilesToFlip = isValidMove.length;
        while (colIndex < 7 && tilesToFlip > 0) {
            colIndex += 1;
            tilesToFlip -= 1;
            const affectedTilePos = { row: rowIndex, col: colIndex };
            affectedTiles.push(affectedTilePos);
        }
    }

    // check towards the top
    const topArr = []; // push values into an array to check if last value is equal to player tile
    rowIndex = row;
    colIndex = col;
    while (rowIndex > 0) {
        rowIndex -= 1;
        const val = gameBoardLayout[rowIndex][colIndex];
        topArr.push(val);
    }

    isValidMove = checkTileValues(topArr);

    // if valid move, cell is clickable
    if (isValidMove) {
        colIndex = col;
        rowIndex = row;
        tilesToFlip = isValidMove.length;
        while (rowIndex > 0 && tilesToFlip > 0) {
            rowIndex -= 1;
            tilesToFlip -= 1;
            const affectedTilePos = { row: rowIndex, col: colIndex };
            affectedTiles.push(affectedTilePos);
        }
    }

    // check towards the bottom
    const btmArr = []; // push values into an array to check if last value is equal to player tile
    rowIndex = row;
    colIndex = col;
    while (rowIndex < 7) {
        rowIndex += 1;
        const val = gameBoardLayout[rowIndex][colIndex];
        btmArr.push(val);
    }

    isValidMove = checkTileValues(btmArr);

    // if valid move, cell is clickable
    if (isValidMove) {
        colIndex = col;
        rowIndex = row;
        tilesToFlip = isValidMove.length;
        while (rowIndex < 7 && tilesToFlip > 0) {
            rowIndex += 1;
            tilesToFlip -= 1;
            const affectedTilePos = { row: rowIndex, col: colIndex };
            affectedTiles.push(affectedTilePos);
        }
    }

    /////////////////////////////////
    //          DIAGONALS
    /////////////////////////////////

    // check towards the top left
    const topLeftArr = []; // push values into an array to check if last value is equal to player tile
    rowIndex = row;
    colIndex = col;
    while (rowIndex > 0 && colIndex > 0) {
        rowIndex -= 1;
        colIndex -= 1;
        const val = gameBoardLayout[rowIndex][colIndex];
        topLeftArr.push(val);
    }

    isValidMove = checkTileValues(topLeftArr);

    // if valid move, cell is clickable
    if (isValidMove) {
        rowIndex = row;
        colIndex = col;
        tilesToFlip = isValidMove.length;
        while (rowIndex > 0 && colIndex > 0 && tilesToFlip > 0) {
            rowIndex -= 1;
            colIndex -= 1;
            tilesToFlip -= 1;
            const affectedTilePos = { row: rowIndex, col: colIndex };
            affectedTiles.push(affectedTilePos);
        }
    }

    // check towards the top right
    const topRightArr = []; // push values into an array to check if last value is equal to player tile
    rowIndex = row;
    colIndex = col;
    while (rowIndex > 0 && colIndex < 7) {
        rowIndex -= 1;
        colIndex += 1;
        const val = gameBoardLayout[rowIndex][colIndex];
        topRightArr.push(val);
    }

    isValidMove = checkTileValues(topRightArr);

    // if valid move, cell is clickable
    if (isValidMove) {
        rowIndex = row;
        colIndex = col;
        tilesToFlip = isValidMove.length;
        while (rowIndex > 0 && colIndex < 7 && tilesToFlip > 0) {
            rowIndex -= 1;
            colIndex += 1;
            tilesToFlip -= 1;
            const affectedTilePos = { row: rowIndex, col: colIndex };
            affectedTiles.push(affectedTilePos);
        }
    }

    // check towards the bottom left
    const btmLeftArr = []; // push values into an array to check if last value is equal to player tile
    rowIndex = row;
    colIndex = col;
    while (rowIndex < 7 && colIndex > 0) {
        rowIndex += 1;
        colIndex -= 1;
        const val = gameBoardLayout[rowIndex][colIndex];
        btmLeftArr.push(val);
    }

    isValidMove = checkTileValues(btmLeftArr);

    // if valid move, cell is clickable
    if (isValidMove) {
        rowIndex = row;
        colIndex = col;
        tilesToFlip = isValidMove.length;
        while (rowIndex < 7 && colIndex > 0 && tilesToFlip > 0) {
            rowIndex += 1;
            colIndex -= 1;
            tilesToFlip -= 1;
            const affectedTilePos = { row: rowIndex, col: colIndex };
            affectedTiles.push(affectedTilePos);
        }
    }

    // check towards the bottom right
    const btmRightArr = []; // push values into an array to check if last value is equal to player tile
    rowIndex = row;
    colIndex = col;
    while (rowIndex < 7 && colIndex < 7) {
        rowIndex += 1;
        colIndex += 1;
        const val = gameBoardLayout[rowIndex][colIndex];
        btmRightArr.push(val);
    }

    isValidMove = checkTileValues(btmRightArr);

    // if valid move, cell is clickable
    if (isValidMove) {
        rowIndex = row;
        colIndex = col;
        tilesToFlip = isValidMove.length;
        while (rowIndex < 7 && colIndex < 7 && tilesToFlip > 0) {
            rowIndex += 1;
            colIndex += 1;
            tilesToFlip -= 1;
            const affectedTilePos = { row: rowIndex, col: colIndex };
            affectedTiles.push(affectedTilePos);
        }
    }

    return affectedTiles;

    // check if adjacent tile is not player tile and last tile is player tile within array
    function checkTileValues(arr) {
        const firstVal = arr[0]; // get first value in the array
        if (firstVal < 1) {
            return false;
        } else {
            const blankTileIndex = arr.indexOf(0); // check the array for any 0 value
            const playerTileLastIndex = arr.indexOf(currentPlayer); // search for current player index
            // if index exists and it is positioned earlier than the player tile
            if (blankTileIndex !== -1 && blankTileIndex < playerTileLastIndex) {
                return false;
            } else {
                const lastVal = arr[playerTileLastIndex]; // use the current player tile found as the last value
                const flippableTiles = arr.slice(0, playerTileLastIndex);
                if (firstVal !== currentPlayer && lastVal === currentPlayer) {
                    return flippableTiles; // returns the length of flippable tiles to run the loop
                } else {
                    return false;
                }
            }
            
        }
    }
}

// code to flip tiles
function flipTiles(affectedTiles) {
    // loop through affected tiles
    for (let i = 0; i < affectedTiles.length; i++) {
        const tileObj = affectedTiles[i];
        const tileVal = gameBoardLayout[tileObj.row][tileObj.col];
        if (currentPlayer === 2 && tileVal === 1) {
            gameBoardLayout[tileObj.row][tileObj.col] = 2; // change gameBoardLayout values from 1 to 2
        } else if (currentPlayer === 1 && tileVal === 2) {
            gameBoardLayout[tileObj.row][tileObj.col] = 1; // change gameBoardLayout values from 2 to 1
        }
    }
}

// Restart the game
function restartGame() {
    // Clear the cells and make them clickable by removing "used" class
    cells.forEach(cell => {
        cell.classList.remove('used');
    });

    // Reset game board layout
    gameBoardLayout = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    // Reset starting player to Black
    currentPlayer = 2;
    statusText.innerText = "Black's Turn";

    countPlayerCells(); // Reset player count
    drawLayout(); // draw game layout
    gameOver = false; // reset gameOver
    checkMoves(currentPlayer); // check clickable spots
}

// Initialize the game
assignLayoutPos(); //
gameBoard.addEventListener('click', handleCellClick); // run handleCellClick everytime gameBoard is clicked
restartButton.addEventListener('click', restartGame); // run restartGame when Restart button is clicked
restartGame(); // use restartGame() to initalize