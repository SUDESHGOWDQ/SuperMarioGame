import React from "react";
import "./Player.css";

const Player = ({ x, y }) => {
  return (
    <div
      className="player"
      style={{
        left: `${x}px`,
        bottom: `${y}px`,
      }}
    >
      <img
        src="https://orig00.deviantart.net/3db4/f/2017/343/5/f/smb_running_small_mario_by_greenlightning57-dbw8cu7.png"
        height={"100px"}
        width={"100px"}
      />
    </div>
  );
};

export default Player;
