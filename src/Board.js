class Board {
  constructor(StartingPosition) {
    this.contents = StartingPosition;
  }

  getAt = coordinates => this.contents[coordinates.y][coordinates.x];

  setAt = (coordinates, value) => {
    this.contents[coordinates.y][coordinates.x] = value;
  };
}

export default Board;
