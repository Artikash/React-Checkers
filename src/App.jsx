import React from "react";
import Square from "./Square";
import StartingPosition from "./StartingPosition";

class App extends React.Component {
  state = {
    board: StartingPosition,
    selectedPieceCoords: null,
    validMoves: [],
    turn: "W",
  };

  isValidMoveOfSelectedPiece = coordinates =>
    // Return value: whether the input move is valid
    this.state.validMoves.reduce(
      (a, v) => a || (v.y === coordinates.y && v.x === coordinates.x),
      false,
    );

  gameWinner = () => {
    // Return value: null if game in progress, an array with just the winning color otherwise
    const winner = this.state.board
      .map(row => row.map(piece => piece.substr(0, 1)).join(""))
      .join("")
      .match(/^([BW])\1*$/);
    return winner ? winner[1] : winner;
  };

  computeValidMoves = (pieceCoords) => {
    // Return value: array of valid moves for piece at pieceCoords
    const computeMove = (offsets) => {
      try {
        // Try catch in case we access a value off the board
        if (this.state.board[pieceCoords.y + offsets.y][pieceCoords.x + offsets.x] === "") {
          return { y: pieceCoords.y + offsets.y, x: pieceCoords.x + offsets.x };
        } else if (
          !this.state.board[pieceCoords.y + offsets.y][pieceCoords.x + offsets.x].match(this.state.turn) &&
          this.state.board[pieceCoords.y + offsets.y * 2][pieceCoords.x + offsets.x * 2] === ""
        ) {
          // If a piece can be captured
          return { y: pieceCoords.y + offsets.y * 2, x: pieceCoords.x + offsets.x * 2 };
        }
        return null;
      } catch (error) {
        return null;
      }
    };
    if (this.state.board[pieceCoords.y][pieceCoords.x].match("K")) {
      return [
        computeMove({ y: +1, x: +1 }),
        computeMove({ y: +1, x: -1 }),
        computeMove({ y: -1, x: +1 }),
        computeMove({ y: -1, x: -1 }),
      ].filter(v => v !== null);
    }
    if (this.state.board[pieceCoords.y][pieceCoords.x] === "W") {
      return [computeMove({ y: -1, x: +1 }), computeMove({ y: -1, x: -1 })].filter(v => v !== null);
    }
    if (this.state.board[pieceCoords.y][pieceCoords.x] === "B") {
      return [computeMove({ y: +1, x: +1 }), computeMove({ y: +1, x: -1 })].filter(v => v !== null);
    }
    return [];
  };

  movePiece = (initCoords, finalCoords) => {
    const board = this.state.board.slice();
    let captured = false;
    board[finalCoords.y][finalCoords.x] = board[initCoords.y][initCoords.x];
    board[initCoords.y][initCoords.x] = "";
    if (Math.abs(finalCoords.y - initCoords.y) === 2) {
      // If piece is being captured
      captured = true;
      board[(finalCoords.y + initCoords.y) / 2][(finalCoords.x + initCoords.x) / 2] = "";
    }
    if (finalCoords.y === 0 || finalCoords.y === 7) {
      // K gets added for king pieces: WK = White King BK = Black King
      board[finalCoords.y][finalCoords.x] = `${this.state.turn}K`;
    }
    this.setState({ board });
    if (!captured) {
      this.setState({ turn: this.state.turn === "W" ? "B" : "W" });
    }
    this.deselectPiece();
  };

  selectPiece = (coordinates) => {
    this.setState({
      selectedPieceCoords: coordinates,
      validMoves: this.computeValidMoves(coordinates),
    });
  };

  deselectPiece = () => {
    this.setState({ selectedPieceCoords: null, validMoves: [] });
  };

  clickHandler = (coordinates) => {
    if (!this.state.selectedPieceCoords) {
      if (this.state.board[coordinates.y][coordinates.x].match(this.state.turn)) {
        this.selectPiece(coordinates);
      }
    } else if (this.isValidMoveOfSelectedPiece(coordinates)) {
      this.movePiece(this.state.selectedPieceCoords, coordinates);
    } else if (
      this.state.selectedPieceCoords.y === coordinates.y &&
      this.state.selectedPieceCoords.x === coordinates.x
    ) {
      this.deselectPiece();
    }
  };

  render = () => (
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
                this.state.selectedPieceCoords &&
                x === this.state.selectedPieceCoords.x &&
                y === this.state.selectedPieceCoords.y
              }
              coords={{ y, x }}
              handleClick={this.clickHandler}
              validMove={this.isValidMoveOfSelectedPiece({ y, x })}
            />
          )))}
        <div className="info">
          <div>{`To move: ${this.state.turn}`}</div>
          <div>{`Winner: ${this.gameWinner() ? this.gameWinner() : "Undecided"}`}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
