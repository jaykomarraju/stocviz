import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from 'three';

const choices = [
  { name: "BUY AN ANSWER", link: "https://example.com/1" },
  { name: "MINT A VOTE", link: "https://example.com/2" },
  { name: "GENESIS LYF", link: "https://example.com/3" },
  { name: "HOLDBTC WTF", link: "https://example.com/4" },
  { name: "WAV MASTERING", link: "https://example.com/5" }
];

function FloatingChoice({ position, data }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  const { scale, color } = useSpring({
    scale: hovered ? [1.3, 1.3, 1.3] : [1, 1, 1],
    color: hovered ? "#FFD700" : "#3498db",
  });

  const handleClick = () => {
    window.open(data.link, "_blank");
  };

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <animated.meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      <Html position={[0, 1.2, 0]} center>
        <div style={{ color: "white", fontSize: "14px", fontWeight: "bold", background: "rgba(0, 0, 0, 0.6)", padding: "5px", borderRadius: "5px" }}>
          {data.name}
        </div>
      </Html>
    </animated.mesh>
  );
}

function FloatingChoices() {
  const groupRef = useRef();
  const radius = 5;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {choices.map((choice, index) => {
        const angle = (index / choices.length) * Math.PI * 2;
        const position = [
          radius * Math.cos(angle),
          Math.sin(angle) * 2,
          radius * Math.sin(angle)
        ];
        return <FloatingChoice key={index} position={position} data={choice} />;
      })}
    </group>
  );
}

function Experience() {
  return (
    <Canvas camera={{ position: [0, 3, 10], fov: 50 }}>
      <color attach="background" args={["#1a1a1a"]} />
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 10, 5]} intensity={1.2} />
      <FloatingChoices />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} />
    </Canvas>
  );
}

export default Experience;
