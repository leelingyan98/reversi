const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartButton = document.getElementById('restartButton');

const blackPlayer = 2; // Assign numerical value "2" to player Black
const whitePlayer = 1; // Assign numerical value "1" to player Black
let currentPlayer = 2; // Start with Black player

console.log(cells);

// Define game board layout with array
const gameBoardLayout = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

function drawLayout() {
    // Loop through each row to access layout values
    for (let row = 0; row < gameBoardLayout.length; row++) {
        const rowValue = gameBoardLayout[row];
        console.log(rowValue);

        //Loop through each column to access layout values
        for (let column = 0; column < rowValue.length; column++) {
            const colValue = rowValue[column];
            console.log(colValue);
        }
    }
}

// How do I restart the game?
function restartGame() {
    // Clear the cells
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('used');
    });
    // Show the status of whose turn it is
    statusText.innerText = `${currentPlayer}'s Turn`;
}

// Initialize the game
drawLayout();
// gameBoard.addEventListener('click', handleCellClick); // run handleCellClick everytime gameBoard is clicked
restartButton.addEventListener('click', restartGame); // run restartGame when Restart button is clicked
restartGame();