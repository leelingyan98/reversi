// Game Setup
const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartButton = document.getElementById('restartButton');

// Game Logic
let clickable = false; // default clickable to boolean 'false'
let affectedTiles = []; // array of affected tiles

// Game Player (to change into Object later?)
const blackPlayer = 2; // Assign numerical value "2" to player Black
let blackPlayerCount = document.getElementById('blackCounter');
const whitePlayer = 1; // Assign numerical value "1" to player Black
let whitePlayerCount = document.getElementById('whiteCounter');
let currentPlayer = 2; // Start with Black player

console.log(cells);

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
            if (colValue === 1) {
                cell.classList.add('white');
            } else if (colValue === 2) {
                cell.classList.add('black');
            }
            cell.dataset.value = gameBoardLayout[row][col];
        }
    }
    console.log(gameBoardLayout);
}

// Count how many Black and White in the game board
function countPlayerCells() {
    const blackCount = document.querySelectorAll('.cell.black');
    blackPlayerCount.innerText = blackCount.length;
    const whiteCount = document.querySelectorAll('.cell.white');
    whitePlayerCount.innerText = whiteCount.length;
}

// Handle each cell click
function handleCellClick(event) {
    // Handle click event from the cell
    const cell = event.target;
    const isCell = cell.classList.contains('cell');

    const cellRow = parseInt(cell.dataset.row); // set and ensure row value is a number
    const cellCol = parseInt(cell.dataset.col); // set and ensure col value is a number
    const cellVal = gameBoardLayout[cellRow][cellCol]; // access current gameboard tile value
    console.log(`Row ${cellRow} Col ${cellCol} Tile ${cellVal}`) // check current cell row, column and value

    // if cell already contains black or white, do not run functions
    if (cell.classList.contains('black') || cell.classList.contains('white')) {
        return;
    } else if (isCell) {
        checkIfClickable(cellRow, cellCol);
        if (!clickable) {
            return;
        } else if (clickable && isCell) {
            if (currentPlayer === 1) {
                cell.classList.add('white'); // add white tile to cell
                gameBoardLayout[cellRow][cellCol] = 1; // change gameBoardLayout value to 1
            } else if (currentPlayer === 2) {
                cell.classList.add('black'); // add black tile to cell
                gameBoardLayout[cellRow][cellCol] = 2; // change gameBoardLayout value to 2
            }
            console.log('Affected tiles:');
            console.log(affectedTiles);
            flipTiles(affectedTiles);
            cell.classList.add('used'); // adding a class to prevent players to change cell values after it is set
            drawLayout();
            countPlayerCells();
            // Switch the player
            if (currentPlayer == 1) {
                currentPlayer = 2;
                statusText.innerText = "Black's Turn";
            } else if (currentPlayer == 2) {
                currentPlayer = 1;
                statusText.innerText = "White's Turn";
            }

            clickable = false; // reset clickable variable to false
            affectedTiles = []; // reset array of affected tiles
        }
    }
}

// check if cells are clickable
function checkIfClickable(row, col) {
    // Default logic values
    let rowIndex = row;
    let colIndex = col;
    let tilesToFlip = 0;

    /////////////////////////////////
    //    TOP LEFT BOTTOM RIGHT
    /////////////////////////////////

    // check towards the left

    // push values into an array to check if last value is equal to player tile
    const leftArr = [];
    while (colIndex > 0) {
        colIndex -= 1;
        const val = gameBoardLayout[rowIndex][colIndex];
        leftArr.push(val);
    }

    let isValidMove = checkTileValues(leftArr);

    // if valid move, cell is clickable
    if (isValidMove) {
        clickable = true;
        rowIndex = row;
        colIndex = col;
        tilesToFlip = isValidMove.length;
        console.log(`${rowIndex} ${colIndex}`);
        while (colIndex > 0 && tilesToFlip > 0) {
            colIndex -= 1;
            tilesToFlip -= 1;
            const affectedTilePos = { row: rowIndex, col: colIndex }; // set affected tile as object
            affectedTiles.push(affectedTilePos); // push object into a global array
        }
    }


    // check towards the right

    // push values into an array to check if last value is equal to player tile
    const rightArr = [];
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
        clickable = true;
        colIndex = col;
        rowIndex = row;
        tilesToFlip = isValidMove.length;
        console.log(`${rowIndex} ${colIndex}`);
        while (colIndex < 7 && tilesToFlip > 0) {
            colIndex += 1;
            tilesToFlip -= 1;
            const affectedTilePos = { row: rowIndex, col: colIndex };
            affectedTiles.push(affectedTilePos);
        }
    }

    // check towards the top

    // push values into an array to check if last value is equal to player tile
    const topArr = [];
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
        clickable = true;
        colIndex = col;
        rowIndex = row;
        tilesToFlip = isValidMove.length;
        console.log(`${rowIndex} ${colIndex}`);
        while (rowIndex > 0 && tilesToFlip > 0) {
            rowIndex -= 1;
            tilesToFlip -= 1;
            const affectedTilePos = { row: rowIndex, col: colIndex };
            affectedTiles.push(affectedTilePos);
        }
    }

    // check towards the bottom

    // push values into an array to check if last value is equal to player tile
    const btmArr = [];
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
        clickable = true;
        colIndex = col;
        rowIndex = row;
        tilesToFlip = isValidMove.length;
        console.log(`${rowIndex} ${colIndex}`);
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
    // push values into an array to check if last value is equal to player tile
    const topLeftArr = [];
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
        clickable = true;
        rowIndex = row;
        colIndex = col;
        tilesToFlip = isValidMove.length;
        console.log(`${rowIndex} ${colIndex}`);
        while (rowIndex > 0 && colIndex > 0 && tilesToFlip > 0) {
            rowIndex -= 1;
            colIndex -= 1;
            tilesToFlip -= 1;
            const affectedTilePos = { row: rowIndex, col: colIndex };
            affectedTiles.push(affectedTilePos);
        }
    }

    // check towards the top right
    // push values into an array to check if last value is equal to player tile
    const topRightArr = [];
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
        clickable = true;
        rowIndex = row;
        colIndex = col;
        tilesToFlip = isValidMove.length;
        console.log(`${rowIndex} ${colIndex}`);
        while (rowIndex > 0 && colIndex < 7 && tilesToFlip > 0) {
            rowIndex -= 1;
            colIndex += 1;
            tilesToFlip -= 1;
            const affectedTilePos = { row: rowIndex, col: colIndex };
            affectedTiles.push(affectedTilePos);
        }
    }

    // check towards the bottom left
    // push values into an array to check if last value is equal to player tile
    const btmLeftArr = [];
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
        clickable = true;
        rowIndex = row;
        colIndex = col;
        tilesToFlip = isValidMove.length;
        console.log(`${rowIndex} ${colIndex}`);
        while (rowIndex < 7 && colIndex > 0 && tilesToFlip > 0) {
            rowIndex += 1;
            colIndex -= 1;
            tilesToFlip -= 1;
            const affectedTilePos = { row: rowIndex, col: colIndex };
            affectedTiles.push(affectedTilePos);
        }
    }

    // check towards the bottom right
    // push values into an array to check if last value is equal to player tile
    const btmRightArr = [];
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
        clickable = true;
        rowIndex = row;
        colIndex = col;
        tilesToFlip = isValidMove.length;
        console.log(`${rowIndex} ${colIndex}`);
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
            const playerTileLastIndex = arr.indexOf(currentPlayer); // search for current player index
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

// code to flip tiles
function flipTiles(affectedTiles) {
    for (let i = 0; i < affectedTiles.length; i++) {
        const tileObj = affectedTiles[i];
        console.log(tileObj);
        const tileVal = gameBoardLayout[tileObj.row][tileObj.col];
        if (currentPlayer === 2 && tileVal === 1) {
            gameBoardLayout[tileObj.row][tileObj.col] = 2;
            drawLayout();
        } else if (currentPlayer === 1 && tileVal === 2) {
            gameBoardLayout[tileObj.row][tileObj.col] = 1;
            drawLayout();
        }
    }
}

// Restart the game
function restartGame() {
    // Clear the cells
    cells.forEach(cell => {
        // Remove classes "used", "black" and "white"
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

    // Reset player count
    countPlayerCells();
    drawLayout();
}

// Initialize the game
assignLayoutPos();
gameBoard.addEventListener('click', handleCellClick); // run handleCellClick everytime gameBoard is clicked
restartButton.addEventListener('click', restartGame); // run restartGame when Restart button is clicked
restartGame();