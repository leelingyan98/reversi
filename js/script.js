const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartButton = document.getElementById('restartButton');

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
        for (let column = 0; column < gameBoardLayout[row].length; column++) {
            const cellIndex = row * gameBoardLayout.length + column; // Generate index number of each cell i.e. row 0 * 8 cells + column 0
            const cell = cells[cellIndex]; // Access the cells array with index
            cell.dataset.row = row; // define row
            cell.dataset.col = column; // define column
        }
    }
}

// Render the current game layout to game board
function drawLayout() {
    // Loop through each row to access layout values
    for (let row = 0; row < gameBoardLayout.length; row++) {
        //Loop through each column to access layout values
        for (let column = 0; column < gameBoardLayout[row].length; column++) {
            const colValue =  gameBoardLayout[row][column]; // Get layout array value
            const cellIndex = row * gameBoardLayout.length + column; // Generate index number of each cell i.e. row 0 * 8 cells + column 0
            const cell = cells[cellIndex]; // Access the cells array with index
            if (colValue === 1) {
                cell.classList.add('white');
            } else if (colValue === 2) {
                cell.classList.add('black');
            }
        }
    }

    console.log(gameBoardLayout);

    // Switch the player
    if (currentPlayer == 1) {
        currentPlayer = 2;
        statusText.innerText = "Black's Turn";
    } else if (currentPlayer == 2) {
        currentPlayer = 1;
        statusText.innerText = "White's Turn";
    }
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

     if (isCell && cell.innerText === '') {
        if (currentPlayer === 1) {
            cell.classList.add('white');
        } else if (currentPlayer === 2) {
            cell.classList.add('black');
        }
        cell.classList.add('used'); // adding a class to prevent players to change cell values after it is set
        const cellRow = parseInt(cell.dataset.row); // ensure row value is a number
        const cellCol = parseInt(cell.dataset.col); // ensure col value is a number
        console.log(`${cellRow} ${cellCol}`) // check cell row and cell column value
        drawLayout();
        countPlayerCells();
        checkIfClickable(cellRow, cellCol);
     }
}

function checkIfClickable(row, col) {
    // check top right bottom left values
    const topVal = gameBoardLayout[row-1][col];
    const rightVal = gameBoardLayout[row][col+1];
    const btmVal = gameBoardLayout[row][col];
    const leftVal = gameBoardLayout[row][col-1];
    console.log(`top right bottom left ${topVal} ${rightVal} ${btmVal} ${leftVal}`);
    // check diagonals values
    const topLeftVal = gameBoardLayout[row-1][col-1];
    const topRightVal = gameBoardLayout[row-1][col+1];
    const btmRightVal = gameBoardLayout[row+1][col+1];
    const btmLeftVal = gameBoardLayout[row+1][col-1];
    console.log(`TL TR BR BL ${topLeftVal} ${topRightVal} ${btmRightVal} ${btmLeftVal}`);
}

// Restart the game
function restartGame() {
    // Clear the cells
    cells.forEach(cell => {
        // If cell does not contain class "default", remove classes "used", "black" and "white"
        if (!cell.classList.contains('default')) {
            cell.classList.remove('used');
            cell.classList.remove('black');
            cell.classList.remove('white');
        }
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
}

// Initialize the game
assignLayoutPos();
gameBoard.addEventListener('click', handleCellClick); // run handleCellClick everytime gameBoard is clicked
restartButton.addEventListener('click', restartGame); // run restartGame when Restart button is clicked
restartGame();