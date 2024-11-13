import React, { useState, useEffect } from "react";
import Player from "./Player";
import Ground from "./Ground";
import Obstacle from "./Obstacle";
import "./Game.css";

const Game = () => {
  const initialPlayerPosition = { x: 50, y: 200 };
  const [playerPosition, setPlayerPosition] = useState(initialPlayerPosition);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // Game settings
  const gravity = 0.5;
  const jumpHeight = -200;
  const groundHeight = 240;
  const obstacleSpeed = 30;
  const spawnRate = 2000;

  // Handle movement
  const handleMovement = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        return { x: -5, y: 0 };
      case "ArrowRight":
        return { x: 10, y: 0 };
      case "ArrowUp":
        if (!isJumping) {
          setIsJumping(true);
          return { x: 0, y: jumpHeight };
        }
        return { x: 0, y: 0 };
      case " ":
        if (!isJumping) {
          setIsJumping(true);
          return { x: 0, y: jumpHeight };
        }
        return { x: 0, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const movePlayer = (e) => {
    const newVelocity = handleMovement(e);
    setVelocity((prev) => ({ ...prev, ...newVelocity }));
  };

  const handleKeyDown = (e) => {
    movePlayer(e);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isJumping]);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      if (gameOver) {
        clearInterval(gameInterval);
        return;
      }

      // Apply gravity
      setVelocity((prev) => ({ ...prev, y: prev.y + gravity }));

      // Update player position
      setPlayerPosition((prev) => ({
        x: prev.x + velocity.x,
        y: Math.min(prev.y + velocity.y, groundHeight),
      }));

      // Stop jumping if hitting the ground
      if (playerPosition.y >= groundHeight) {
        setIsJumping(false);
        setVelocity((prev) => ({ ...prev, y: 0 }));
      }

      // Move obstacles and check collisions
      setObstacles((prev) => {
        return prev
          .map((obstacle) => ({
            ...obstacle,
            x: obstacle.x - obstacleSpeed,
          }))
          .filter((obstacle) => {
            // Check for collision with player
            if (
              playerPosition.x < obstacle.x + obstacle.width &&
              playerPosition.x + 50 > obstacle.x &&
              playerPosition.y < obstacle.y + obstacle.height &&
              playerPosition.y + 70 > obstacle.y
            ) {
              setGameOver(true);
              return false; // Remove the obstacle on collision
            }
            return obstacle.x > -50; // Remove obstacles that move off screen
          });
      });

      // Update score
      if (!gameOver) {
        setScore((prev) => prev + 1);
      }
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameInterval);
  }, [velocity, playerPosition.y, obstacles, gameOver]);

  // Create new obstacles at random intervals
  useEffect(() => {
    const obstacleInterval = setInterval(() => {
      const newObstacle = {
        x: window.innerWidth,
        y: groundHeight - Math.floor(Math.random() * 80) - 20,
        width: 50 + Math.floor(Math.random() * 50),
        height: 30 + Math.floor(Math.random() * 30),
      };
      setObstacles((prev) => [...prev, newObstacle]);
    }, spawnRate); // Spawns every 2 seconds

    return () => clearInterval(obstacleInterval);
  }, []);

  const resetGame = () => {
    setPlayerPosition(initialPlayerPosition);
    setVelocity({ x: 0, y: 0 });
    setIsJumping(false);
    setScore(0);
    setObstacles([]);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <Ground />

      <Player x={playerPosition.x} y={playerPosition.y} />

      {obstacles.map((obstacle, index) => (
        <Obstacle
          key={index}
          x={obstacle.x}
          y={obstacle.y}
          width={obstacle.width}
          height={obstacle.height}
        />
      ))}
      <div className="score">Score: {score}</div>
      {gameOver && (
        <div className="game-over">
          Game Over! Final Score: {score}
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default Game;
