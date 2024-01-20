const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartButton = document.getElementById('restartButton');
let currentPlayer = 'Black';

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
// gameBoard.addEventListener('click', handleCellClick); // run handleCellClick everytime gameBoard is clicked
restartButton.addEventListener('click', restartGame); // run restartGame when Restart button is clicked
restartGame();