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

  return { getBoard, placeToken, printBoard };
})();

function Cell(row, col) {
  let value = null;
  const getValue = () => value;
  const addToken = (playerToken) => {
    value = playerToken;
  };
  const getPosition = () => {
    row, col;
  };

  return { getValue, addToken, getPosition, availableCellsCount };
}

function Player(name, token) {
  const getName = () => name;
  const getToken = () => token;
  return { getName, getToken };
}

const gameController = (() => {
  const playerOne = Player('Player One', 'X');
  const playerTwo = Player('Player Two', '0');
  const activePlayer = playerOne;
  const getActivePlayer = () => activePlayer;
  const switchPlayerTurn = () =>
    activePlayer === playerOne ? playerTwo : playerOne;
  const playRound = (row, col) => {
    gameBoard.placeToken(row, col, activePlayer);

    const playerHasWon = () => {
      gameBoard.printBoard();
      let board = gameBoard.getBoard();
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
    playerHasWon()
      ? console.log(activePlayer.getName, 'is the winner')
      : gameBoard.availableCellsCount() === 0
      ? console.log(`Game is tied`)
      : console.log(`No winner yet, other players turn`);
  };

  return { getActivePlayer, playRound };
})();

gameController.playRound(0, 2);
gameController.playRound(1, 2);
gameController.playRound(2, 2);
