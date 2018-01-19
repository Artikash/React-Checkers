import React from "react";

const Square = props => (
  <button
    className="Square"
    onClick={() => props.onClick(props.coords)}
    onTouchEnd={() => props.onClick(props.coords)}
    style={{ backgroundColor: props.selected ? "green" : props.validMove ? "red" : "white" }}
  >
    {`${props.piece}`}
  </button>
);
export default Square;
