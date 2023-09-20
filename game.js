const gameBoard = (() => {
  const board = [];
  for (let row = 0; row < 3; row++) {
    board[row] = [];
    for (let col = 0; col < 3; col++) {
      board[row][col] = Cell(row, col);
    }
  }
  const getBoard = () => board;
  const placeToken = (row, col, player) => {
    if (availableCellsCount() === 0 || board[row][col].getValue() !== null)
      return;
    else {
      board[row][col].addToken(player.getToken());
    }
  };
  const availableCellsCount = () => {
    return board.flat().filter((cell) => cell.getValue() === null).length;
  };
  const printBoard = () => {
    const boardwithCells = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardwithCells);
  };
  return { getBoard, placeToken, printBoard, availableCellsCount };
})();

function Cell(row, col) {
  let value = null;
  const getValue = () => value;
  const addToken = (playerToken) => {
    value = playerToken;
  };
  const getPosition = () => ({
    row,
    col,
  });
  return { getValue, addToken, getPosition };
}

function Player(name, token) {
  const getName = () => name;
  const getToken = () => token;
  return { getName, getToken };
}

const gameController = (() => {
  const playerOne = Player('Player 1', 'X');
  const playerTwo = Player('Player 2', 'O');
  let activePlayer = playerOne;
  const getActivePlayer = () => activePlayer;
  const switchPlayerTurn = () =>
    (activePlayer = activePlayer === playerOne ? playerTwo : playerOne);

  let gameOver = false;
  let tieGame = false;
  const getResult = () => ({ gameOver, tieGame });
  const playRound = (row, col) => {
    gameBoard.placeToken(row, col, activePlayer);
    let board = gameBoard.getBoard();

    const playerHasWon = () => {
      let columnFlag = false;
      // when columnFlag = true, check winning cols instead
      for (let row = 0; row < 3; row++) {
        let winningLine = true;
        for (let col = 0; col < 3; col++) {
          let cell = columnFlag ? board[col][row] : board[row][col];
          if (cell.getValue() !== activePlayer.getToken()) {
            winningLine = false;
            break;
          }
        }
        if (winningLine) return true;
        // reset loop, check winning columns instead
        if (row === 2 && columnFlag === false) {
          columnFlag = true;
          row = -1;
        }
      }

      //check diaganol lines
      return [
        board[0][0].getValue(),
        board[1][1].getValue(),
        board[2][2].getValue(),
      ].every((cell) => cell === activePlayer.getToken()) ||
        [
          board[2][0].getValue(),
          board[1][1].getValue(),
          board[0][2].getValue(),
        ].every((cell) => cell === activePlayer.getToken())
        ? true
        : false;
    };

    if (playerHasWon()) {
      gameOver = true;
      tieGame = false;
    } else if (gameBoard.availableCellsCount() === 0) {
      gameOver = true;
      tieGame = true;
    } else switchPlayerTurn();
  };

  return { getActivePlayer, playRound, getResult };
})();

const displayController = (() => {
  const playerTurnDiv = document.querySelector('#player-turn');
  const boardDiv = document.querySelector('.board');

  function updateScreen() {
    boardDiv.textContent = '';
    playerTurnDiv.textContent = `${gameController
      .getActivePlayer()
      .getName()}'s turn..`;

    gameBoard.getBoard().forEach((row) =>
      row.forEach((cell) => {
        const cellButton = document.createElement('button');
        cellButton.classList.add('cell');
        cellButton.classList.add(`${cell.getValue()}-token`);
        cellButton.dataset.row = cell.getPosition().row;
        cellButton.dataset.col = cell.getPosition().col;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      })
    );
  }

  function clickHandlerBoard(ev) {
    const selectedCell = ev.target;
    if (selectedCell.dataset.row) {
      gameController.playRound(
        selectedCell.dataset.row,
        selectedCell.dataset.col
      );
      updateScreen();
      // check if game is over
      if (gameController.getResult().gameOver) {
        if (gameController.getResult().tieGame) {
          playerTurnDiv.textContent = 'Tie game..';
        } else {
          playerTurnDiv.textContent = `${gameController
            .getActivePlayer()
            .getName()} is the Winner!`;
        }
        document
          .querySelectorAll('.cell')
          .forEach((button) => button.setAttribute('disabled', true));
      }
    }
  }

  boardDiv.addEventListener('click', (ev) => clickHandlerBoard(ev));
  return { updateScreen };
})();

displayController.updateScreen();
