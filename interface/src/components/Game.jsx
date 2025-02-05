import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// 🎭 Maze Grid
const GRID_SIZE = 10;
const maze = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(1));

// 🚀 Player Component
function Player({ position }) {
  const ref = useRef();
  
  useFrame(() => {
    if (ref.current) {
      ref.current.position.lerp(new THREE.Vector3(...position), 0.1);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="limegreen" />
    </mesh>
  );
}

// 🏆 Goal Component
function Goal({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.7, 0.7, 0.7]} />
      <meshStandardMaterial color="gold" />
    </mesh>
  );
}

// 🏗️ Maze Component
function Maze() {
  return (
    <group>
      {maze.map((row, i) =>
        row.map((cell, j) =>
          cell === 1 ? (
            <mesh key={`${i}-${j}`} position={[i - GRID_SIZE / 2, 0.5, j - GRID_SIZE / 2]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="gray" />
            </mesh>
          ) : null
        )
      )}
    </group>
  );
}

// 🎮 Game Logic
function Game() {
  const [playerPos, setPlayerPos] = useState([0, 0.5, 0]);
  const goalPos = [GRID_SIZE - 1, 0.5, GRID_SIZE - 1];
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      setPlayerPos((prev) => {
        const [x, y, z] = prev;
        let newX = x, newZ = z;

        if (event.key === "ArrowLeft" && maze[x - 1]?.[z] !== 1) newX -= 1;
        if (event.key === "ArrowRight" && maze[x + 1]?.[z] !== 1) newX += 1;
        if (event.key === "ArrowUp" && maze[x]?.[z - 1] !== 1) newZ -= 1;
        if (event.key === "ArrowDown" && maze[x]?.[z + 1] !== 1) newZ += 1;
        
        return [newX, y, newZ];
      });
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <h1 style={{ position: "absolute", top: 20, left: 20, color: "white" }}>Maze Runner</h1>
      <Canvas camera={{ position: [0, 10, 10], fov: 60 }}>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <Player position={playerPos} />
        <Goal position={goalPos} />
        <Maze />
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default Game;
