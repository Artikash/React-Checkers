import React from "react";

const Square = props => (
  <button
    className="Square"
    onClick={props.handleClick}
    onTouchEnd={props.handleClick}
    style={{ backgroundColor: props.movingFrom ? "green" : props.validMove ? "red" : "white" }}
  >
    {`${props.piece}`}
  </button>
);
export default Square;
