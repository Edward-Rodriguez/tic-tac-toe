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
    const availableCells = board
      .flat()
      .filter((cell) => cell.getValue() === null);
    if (availableCells.length === 0 || board[row][col].getValue() !== null)
      return;
    else {
      board[row][col].addToken(player);
    }
  };

  const printBoard = () => {
    const boardwithCells = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardwithCells);
    console.log('available cells:');
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

  return { getValue, addToken, getPosition };
}

function Player(name, token) {
  const getName = () => name;
  const getToken = () => token;
  return { getName, getToken };
}

gameBoard.placeToken(0, 0, 'x');
