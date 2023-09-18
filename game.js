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
    const availableCells = board.filter((row) =>
      row.filter((cell) => cell.getValue !== null)
    );
    if (availableCells.size() === 0) return;
    else {
      board[row][col].addToken(player.token);
    }
    console.log(availableCells);
  };

  return { getBoard, placeToken };
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
