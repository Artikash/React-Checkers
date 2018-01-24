import Coordinates from "./Coordinates";

class Board {
  constructor(StartingPosition = [[""]]) {
    this.contents = StartingPosition;
  }

  getAt = (coordinates = new Coordinates()) => this.contents[coordinates.y][coordinates.x];

  setAt = (coordinates = new Coordinates(), value = "") => {
    this.contents[coordinates.y][coordinates.x] = value;
  };
}

export default Board;
