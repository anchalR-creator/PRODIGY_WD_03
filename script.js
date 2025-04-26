const board = document.getElementById("board");
const statusText = document.getElementById("status");
const aiToggle = document.getElementById("aiToggle");

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let playVsAI = false;

const winConditions = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left col
  [1, 4, 7], // middle col
  [2, 5, 8], // right col
  [0, 4, 8], // main diag
  [2, 4, 6]  // anti diag
];

aiToggle.addEventListener("change", () => {
  playVsAI = aiToggle.checked;
  resetGame();
});

function createBoard() {
  board.innerHTML = '';
  gameState.forEach((_, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.dataset.index = index;
    cellDiv.addEventListener("click", handleCellClick);
    board.appendChild(cellDiv);
  });
}

function handleCellClick(event) {
  const index = event.target.dataset.index;
  if (gameState[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);
  if (checkGameOver()) return;

  if (playVsAI && currentPlayer === "O") {
    setTimeout(() => {
      const aiMove = getBestMove();
      makeMove(aiMove, "O");
      checkGameOver();
    }, 300);
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  const cell = document.querySelectorAll(".cell")[index];
  cell.textContent = player;
  cell.classList.add(player);
  currentPlayer = player === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkGameOver() {
  const winningCombo = getWinningCombo();

  if (winningCombo) {
    statusText.textContent = `Player ${currentPlayer === "X" ? "O" : "X"} wins!`;
    gameActive = false;
    highlightWinningCells(winningCombo);
    return true;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return true;
  }

  return false;
}

function getWinningCombo() {
  for (const [a, b, c] of winConditions) {
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function highlightWinningCells(combo) {
  const cells = document.querySelectorAll(".cell");
  combo.forEach(index => {
    cells[index].style.textShadow = "0 0 20px #ff0, 0 0 30px #ff0";
  });
}

function resetGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  createBoard();

  if (playVsAI && currentPlayer === "O") {
    const aiMove = getBestMove();
    makeMove(aiMove, "O");
  }
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;

  gameState.forEach((cell, index) => {
    if (cell === "") {
      gameState[index] = "O";
      let score = minimax(gameState, 0, false);
      gameState[index] = "";
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });

  return move;
}

function minimax(state, depth, isMaximizing) {
  const win = getWinner(state);
  if (win === "O") return 10 - depth;
  if (win === "X") return depth - 10;
  if (!state.includes("")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    state.forEach((_, index) => {
      if (state[index] === "") {
        state[index] = "O";
        best = Math.max(best, minimax(state, depth + 1, false));
        state[index] = "";
      }
    });
    return best;
  } else {
    let best = Infinity;
    state.forEach((_, index) => {
      if (state[index] === "") {
        state[index] = "X";
        best = Math.min(best, minimax(state, depth + 1, true));
        state[index] = "";
      }
    });
    return best;
  }
}

function getWinner(state) {
  for (const [a, b, c] of winConditions) {
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return state[a];
    }
  }
  return null;
}

createBoard();
