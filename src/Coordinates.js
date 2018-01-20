class Coordinates {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  midpoint = otherCoords =>
    new Coordinates((this.x + otherCoords.x) / 2, (this.y + otherCoords.y) / 2);

  add = otherCoords => new Coordinates(this.x + otherCoords.x, this.y + otherCoords.y);

  equals = otherCoords => this.x === otherCoords.x && this.y === otherCoords.y;
}

export default Coordinates;
