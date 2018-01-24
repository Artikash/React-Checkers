class Coordinates {
  constructor(x = NaN, y = NaN) {
    this.x = x;
    this.y = y;
  }

  add = (otherCoords = new Coordinates()) =>
    new Coordinates(this.x + otherCoords.x, this.y + otherCoords.y);

  midpoint = (otherCoords = new Coordinates()) =>
    new Coordinates((this.x + otherCoords.x) / 2, (this.y + otherCoords.y) / 2);

  equals = (otherCoords = new Coordinates()) =>
    this.x === otherCoords.x && this.y === otherCoords.y;
}

export default Coordinates;
