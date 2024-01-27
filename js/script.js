// Game Setup
const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartButton = document.getElementById('restartButton');

// Game Logic
let clickable = false; // default clickable to boolean 'false'

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
            const colValue =  gameBoardLayout[row][col]; // Get layout array value
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

    const cellRow = parseInt(cell.dataset.row); // ensure row value is a number
    const cellCol = parseInt(cell.dataset.col); // ensure col value is a number
    console.log(`${cellRow} ${cellCol}`) // check cell row and cell column value

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
        }
    }
}

// check if cells are clickable
function checkIfClickable(row, col) {
    // check top right bottom left values and convert to integer
    const leftVal = parseInt(gameBoardLayout[row][col-1]);
    const rightVal = parseInt(gameBoardLayout[row][col+1]);
    const topVal = parseInt(gameBoardLayout[row-1][col]);
    const btmVal = parseInt(gameBoardLayout[row+1][col]);
    console.log(`left right top bottom ${leftVal} ${rightVal} ${topVal}  ${btmVal}`);

    // check diagonals values and convert to integer
    const topLeftVal = parseInt(gameBoardLayout[row-1][col-1]);
    const topRightVal = parseInt(gameBoardLayout[row-1][col+1]);
    const btmRightVal = parseInt(gameBoardLayout[row+1][col+1]);
    const btmLeftVal = parseInt(gameBoardLayout[row+1][col-1]);
    console.log(`TL TR BR BL ${topLeftVal} ${topRightVal} ${btmRightVal} ${btmLeftVal}`);

    // if (currentPlayer === 2) {
    //     clickable = checkValues.includes(1);
    // } else if (currentPlayer === 1) {
    //     clickable = checkValues.includes(2);
    // }

    /////////////////////////////////
    //    TOP LEFT BOTTOM RIGHT
    /////////////////////////////////

    // check left values by decreasing col value
    if (leftVal > 0) {
        // push values into an array to check if last value is equal to player tile
        const leftArr = [];
        for (let i = col; i > 0 ; i--) {
            const val = gameBoardLayout[row][i];
            if (val > 0) leftArr.push(val);
        }

        const isValidMove = checkTileValues(leftArr);
        
        // if valid move, cell is clickable and run flipTiles
        if (isValidMove) {
            clickable = true;
            for (let i = col; i > 0 ; i--) {
                flipTiles(row, i);
            }
        }
    }

    // check right values by increasing col value
    if (rightVal > 0 ) {
        // push values into an array to check if last value is equal to player tile
        const rightArr = [];
        for (let i = col; i < 7 ; i++) {
            const val = gameBoardLayout[row][i];
            if (val > 0) rightArr.push(val);
        }

        const isValidMove = checkTileValues(rightArr);
        
        // if valid move, cell is clickable and run flipTiles
        if (isValidMove) {
            clickable = true;
            for (let i = col; i < 7; i++) {
                flipTiles(row, i);
            }
        }
    }

    // check top values by decreasing row value
    if (topVal > 0) {
        // push values into an array to check if last value is equal to player tile
        const topArr = [];
        for (let i = row; i > 0 ; i--) {
            const val = gameBoardLayout[i][col];
            if (val > 0) topArr.push(val);
        }

        const isValidMove = checkTileValues(topArr);
        
        // if valid move, cell is clickable and run flipTiles
        if (isValidMove) {
            clickable = true;
            for (let i = row; i > 0; i--) {
                flipTiles(i, col);
            }
        }
    }

    // check bottom values by increasing col value
    if (btmVal > 0) {
        // push values into an array to check if last value is equal to player tile
        const btmArr = [];
        for (let i = row; i < 7 ; i++) {
            const val = gameBoardLayout[i][col];
            if (val > 0) btmArr.push(val);
        }

        const isValidMove = checkTileValues(btmArr);
        
        // if valid move, cell is clickable and run flipTiles
        if (isValidMove) {
            clickable = true;
            for (let i = row; i < 7; i++) {
                flipTiles(i, col);
            }
        }
    }

    /////////////////////////////////
    //          DIAGONALS
    /////////////////////////////////

    // check top left values by decreasing row col value
    if (topLeftVal > 0) {
        // push values into an array to check if last value is equal to player tile
        const topLeftArr = [];
        let rowIndex = row;
        let colIndex = col;
        while (rowIndex > 0  && colIndex > 0) {
            rowIndex -= 1;
            colIndex -= 1;
            const val = gameBoardLayout[rowIndex][colIndex];
            if (val <= 0) topLeftArr.push(val);
        }

        const isValidMove = checkTileValues(topLeftArr);
        
        // if valid move, cell is clickable and run flipTiles
        if (isValidMove) {
            clickable = true;
            let rowIndex = row;
            let colIndex = col;
            console.log(`${rowIndex} ${colIndex}`);
            while (rowIndex > 0 && colIndex > 0) {
                rowIndex -= 1;
                colIndex -= 1;
                flipTiles(rowIndex, colIndex);
            }
        }
    }

    // check top right values by decreasing row and increasing col
    if (topRightVal > 0) {
        // push values into an array to check if last value is equal to player tile
        const topRightArr = [];
        let rowIndex = row;
        let colIndex = col;
        while (rowIndex > 0 && colIndex < 7) {
            rowIndex -= 1;
            colIndex += 1;
            const val = gameBoardLayout[rowIndex][colIndex];
            if (val > 0) topRightArr.push(val);
        }

        const isValidMove = checkTileValues(topRightArr);
        
        // if valid move, cell is clickable and run flipTiles
        if (isValidMove) {
            clickable = true;
            let rowIndex = row;
            let colIndex = col;
            console.log(`${rowIndex} ${colIndex}`);
            while (rowIndex > 0 && colIndex < 7) {
                rowIndex -= 1;
                colIndex += 1;
                flipTiles(rowIndex, colIndex);
            }
        }
    }

    // check bottom left values by increasing row and decreasing col
    if (btmLeftVal > 0) {
        // push values into an array to check if last value is equal to player tile
        const btmLeftArr = [];
        let rowIndex = row;
        let colIndex = col;
        while (rowIndex < 7 && colIndex > 0) {
            rowIndex += 1;
            colIndex -= 1;
            const val = gameBoardLayout[rowIndex][colIndex];
            if (val > 0) btmLeftArr.push(val);
        }

        const isValidMove = checkTileValues(btmLeftArr);
        
        // if valid move, cell is clickable and run flipTiles
        if (isValidMove) {
            clickable = true;
            let rowIndex = row;
            let colIndex = col;
            console.log(`${rowIndex} ${colIndex}`);
            while (rowIndex < 7 && colIndex > 0) {
                rowIndex += 1;
                colIndex -= 1;
                flipTiles(rowIndex, colIndex);
            }
        }
    }

    // check bottom right values by increasing row col
    if (btmRightVal > 0) {
        // push values into an array to check if last value is equal to player tile
        const btmRightArr = [];
        let rowIndex = row;
        let colIndex = col;
        while (rowIndex < 7 && colIndex < 7) {
            rowIndex += 1;
            colIndex += 1;
            const val = gameBoardLayout[rowIndex][colIndex];
            if (val > 0) btmRightArr.push(val);
        }

        const isValidMove = checkTileValues(btmRightArr);
        
        // if valid move, cell is clickable and run flipTiles
        if (isValidMove) {
            clickable = true;
            let rowIndex = row;
            let colIndex = col;
            console.log(`${rowIndex} ${colIndex}`);
            while (rowIndex < 7 && colIndex < 7) {
                rowIndex += 1;
                colIndex += 1;
                flipTiles(rowIndex, colIndex);
            }
        }
    }

    // check if adjacent tile is not player tile and last tile is player tile within array
    function checkTileValues(arr) {
        const firstVal = arr[0];
        const lastVal = arr[arr.length - 1];
        console.log(arr);
        console.log(`first: ${firstVal} Last: ${lastVal}`);
        if (firstVal !== currentPlayer && lastVal === currentPlayer) {
            return true;
        } else {
            return false;
        }
    }

    // code to flip tiles
    function flipTiles(row, col) {
        const val = gameBoardLayout[row][col];
        if (currentPlayer === 2 && val === 1) {
            gameBoardLayout[row][col] = 2;
            drawLayout();
        } else if (currentPlayer === 1 && val === 2) {
            gameBoardLayout[row][col] = 1;
            drawLayout();
        }
    }
    
    return clickable;
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