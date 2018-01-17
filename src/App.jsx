import React from "react";
import Square from "./Square";
import StartingPosition from "./StartingPosition";

class App extends React.Component {
  state = {
    board: StartingPosition,
    movingFrom: null,
    validMoves: [],
    turn: "W",
  };

  validMove = coordinates =>
    this.state.validMoves.reduce(
      (a, v) => a || (v.y === coordinates.y && v.x === coordinates.x),
      false,
    );

  gameWinner = () => {
    const winner = this.state.board
      .map(row => row.map(piece => piece.substr(0, 1)).join(""))
      .join("")
      .match(/^([BW])\1*$/);
    return winner ? winner[1] : winner;
  };

  clickHandler = coordinates => () => {
    if (!this.state.movingFrom) {
      if (this.state.board[coordinates.y][coordinates.x].match(this.state.turn)) {
        const validMoves = [];
        const addValidMove = (offsets) => {
          try { // Try block in case we access a value off the board
            if (this.state.board[coordinates.y + offsets.y][coordinates.x + offsets.x] === "") {
              validMoves.push({ y: coordinates.y + offsets.y, x: coordinates.x + offsets.x });
            } else if (
              !this.state.board[coordinates.y + offsets.y][coordinates.x + offsets.x].match(this.state.turn) &&
              this.state.board[coordinates.y + offsets.y * 2][coordinates.x + offsets.x * 2] === ""
            ) { // If a piece is being captured
              validMoves.push({
                y: coordinates.y + offsets.y * 2,
                x: coordinates.x + offsets.x * 2,
              });
            }
          } catch (error) {}
        };
        if (this.state.turn === "W" || this.state.board[coordinates.y][coordinates.x].match("K")) {
          addValidMove({ y: -1, x: -1 });
          addValidMove({ y: -1, x: +1 });
        }
        if (this.state.turn === "B" || this.state.board[coordinates.y][coordinates.x].match("K")) {
          addValidMove({ y: +1, x: -1 });
          addValidMove({ y: +1, x: +1 });
        }
        this.setState({ movingFrom: coordinates, validMoves });
      }
    } else if (this.validMove(coordinates)) {
      const board = this.state.board.slice();
      let switchTurn = true;
      board[coordinates.y][coordinates.x] = board[this.state.movingFrom.y][this.state.movingFrom.x];
      board[this.state.movingFrom.y][this.state.movingFrom.x] = "";
      if (Math.abs(this.state.movingFrom.y - coordinates.y) !== 1) { // If piece is being captured
        switchTurn = false;
        board[(this.state.movingFrom.y + coordinates.y) / 2][
          (this.state.movingFrom.x + coordinates.x) / 2
        ] =
          "";
      }
      if (coordinates.y === 0 || coordinates.y === 7) {
        board[coordinates.y][coordinates.x] = `${board[coordinates.y][coordinates.x].substr(
          0,
          1,
        )}K`; // K gets added for king pieces: WK = White King BK = Black King
      }
      if (switchTurn) {
        this.setState({ turn: this.state.turn === "W" ? "B" : "W" });
      }
      this.setState({ movingFrom: null, validMoves: [], board });
    } else if (
      this.state.movingFrom.y === coordinates.y &&
      this.state.movingFrom.x === coordinates.x
    ) { // Deselect a currently selected piece
      this.setState({ movingFrom: null, validMoves: [] });
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Checkers in React.js</h1>
        </header>
        <div className="Game">
          {this.state.board.map((row, y) =>
            row.map((piece, x) => (
              <Square
                piece={piece}
                movingFrom={
                  this.state.movingFrom &&
                  x === this.state.movingFrom.x &&
                  y === this.state.movingFrom.y
                }
                handleClick={this.clickHandler({ y, x })}
                validMove={this.validMove({ y, x })}
              />
            )))}
          <div />
          <div />
          <div>{`To move: ${this.state.turn}`}</div>
          <div />
          <div />
          <div>{`Winner: ${this.gameWinner() ? this.gameWinner() : "Undecided"}`}</div>
          <div />
          <div />
        </div>
      </div>
    );
  }
}

export default App;
