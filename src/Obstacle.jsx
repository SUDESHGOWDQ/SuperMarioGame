import React from "react";
import "./Obstacle.css";

const Obstacle = ({ x, y, width, height }) => {
  return (
    <div
      className="obstacle"
      style={{
        left: `${x}px`,
        bottom: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    ></div>
  );
};

export default Obstacle;
