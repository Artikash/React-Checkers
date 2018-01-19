import React from "react";
import Square from "./Square";
import Coordinates from "./Coordinates";
import Board from "./Board";
import StartingPosition from "./StartingPosition";

class App extends React.Component {
  state = {
    board: new Board(StartingPosition),
    selectedPieceCoords: null,
    validMoves: [],
    turn: "W",
  };

  onClick = (coordinates) => {
    if (!this.state.selectedPieceCoords) {
      if (this.state.board.getAt(coordinates).match(this.state.turn)) {
        this.selectPiece(coordinates);
      }
    } else if (this.isValidMoveOfSelectedPiece(coordinates)) {
      this.movePiece(this.state.selectedPieceCoords, coordinates);
    } else if (coordinates.equals(this.state.selectedPieceCoords)) {
      this.deselectPiece();
    }
  };

  isValidMoveOfSelectedPiece = coordinates =>
    // Return value: whether the input move is valid
    this.state.validMoves.reduce(
      (accumulator, move) => accumulator || move.equals(coordinates),
      false,
    );

  validMovesOfPiece = (pieceCoords = new Coordinates()) => {
    // Return value: array of valid moves for piece at pieceCoords
    const computeMove = (offset) => {
      try {
        // Try catch in case we access a value off the board
        if (this.state.board.getAt(pieceCoords.add(offset)) === "") {
          return pieceCoords.add(offset);
        } else if (
          !this.state.board.getAt(pieceCoords.add(offset)).match(this.state.turn) &&
          this.state.board.getAt(pieceCoords.add(offset).add(offset)) === ""
        ) {
          // If a piece can be captured
          return pieceCoords.add(offset).add(offset);
        }
        return new Coordinates();
      } catch (error) {
        return new Coordinates();
      }
    };
    if (this.state.board.getAt(pieceCoords).match("K")) {
      return [
        computeMove(new Coordinates(+1, +1)),
        computeMove(new Coordinates(-1, +1)),
        computeMove(new Coordinates(+1, -1)),
        computeMove(new Coordinates(-1, -1)),
      ];
    }
    if (this.state.board.getAt(pieceCoords) === "W") {
      return [computeMove(new Coordinates(-1, -1)), computeMove(new Coordinates(+1, -1))];
    }
    if (this.state.board.getAt(pieceCoords) === "B") {
      return [computeMove(new Coordinates(-1, +1)), computeMove(new Coordinates(+1, +1))];
    }
    return [];
  };

  gameWinner = () =>
    // Return value: null if game in progress, an array with just the winning color otherwise
    this.state.board.contents
      .map(row => row.map(piece => piece.substr(0, 1)).join(""))
      .join("")
      .match(/^([BW])\1*$/);

  movePiece = (initCoords, finalCoords) => {
    const board = Object.assign({}, this.state.board);
    let captured = false;
    board.setAt(finalCoords, board.getAt(initCoords));
    board.setAt(initCoords, "");
    if (Math.abs(finalCoords.y - initCoords.y) === 2) {
      // If piece is being captured
      captured = true;
      board.setAt(initCoords.midpoint(finalCoords), "");
    }
    if (finalCoords.y === 0 || finalCoords.y === 7) {
      // K gets added for king pieces: WK = White King BK = Black King
      board.setAt(finalCoords, `${this.state.turn}K`);
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
      validMoves: this.validMovesOfPiece(coordinates),
    });
  };

  deselectPiece = () => {
    this.setState({ selectedPieceCoords: null, validMoves: [] });
  };

  render = () => (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Checkers in React.js</h1>
      </header>
      <div className="Game">
        {this.state.board.contents.map((row, y) =>
          row.map((piece, x) => (
            <Square
              piece={piece}
              movingFrom={
                this.state.selectedPieceCoords &&
                this.state.selectedPieceCoords.equals(new Coordinates(x, y))
              }
              coords={new Coordinates(x, y)}
              onClick={this.onClick}
              validMove={this.isValidMoveOfSelectedPiece(new Coordinates(x, y))}
            />
          )))}
        <div className="info">
          <div>{`To move: ${this.state.turn}`}</div>
          <div>{`Winner: ${this.gameWinner() ? this.gameWinner()[1] : "Undecided"}`}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
