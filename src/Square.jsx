import React from "react";

const Square = props => (
  <button
    className="Square"
    onClick={() => props.handleClick(props.coords)}
    onTouchEnd={() => props.handleClick(props.coords)}
    style={{ backgroundColor: props.movingFrom ? "green" : props.validMove ? "red" : "white" }}
  >
    {`${props.piece}`}
  </button>
);
export default Square;
