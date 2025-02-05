import React, { useState, useRef } from 'react';
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from 'three';

const choices = [
  { name: "BUY AN ANSWER", link: "https://example.com/1" },
  { name: "MINT A VOTE", link: "https://example.com/2" },
  { name: "GENESIS LYF", link: "https://example.com/3" },
  { name: "HOLDBTC WTF", link: "https://example.com/4" },
  { name: "WAV MASTERING", link: "https://example.com/5" }
];

function Choice({ position, rotation, data, onHover }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  const { scale, color } = useSpring({
    scale: hovered ? [1.2, 6.4, 1.2] : [1, 8, 1],
    color: hovered ? "#758ECD" : "#A0E8AF",
  });

  const handleClick = () => {
    window.location.href = data.link;
  };

  const handleHover = (event) => {
    event.stopPropagation();
    setHovered(true);
    if (meshRef.current) {
      const worldPosition = new THREE.Vector3();
      meshRef.current.getWorldPosition(worldPosition);
      onHover({
        position: [worldPosition.x, worldPosition.y + 2, worldPosition.z],
        content: data.name
      });
    }
  };

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerOver={handleHover}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      <boxGeometry args={[2, 2, 2]} />
      <animated.meshPhysicalMaterial
        color={color}
        metalness={0.3}
        roughness={0.4}
      />
    </animated.mesh>
  );
}

function WheelBase() {
  return (
    <mesh rotation={[Math.PI , 0, 0]} position={[0, 1, 0]}>
      <cylinderGeometry args={[8.5, 8.5, 0.5, 32]} />
      <meshPhysicalMaterial 
        color="#3AB795"
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
}

function Tooltip({ content, position }) {
  const { camera } = useThree();
  const tooltipRef = useRef();

  useFrame(() => {
    if (tooltipRef.current && position) {
      tooltipRef.current.quaternion.copy(camera.quaternion);
    }
  });

  if (!position) return null;

  return (
    <group ref={tooltipRef} position={position}>
      <Text
        position={[0, 0, 0]}
        fontSize={0.5}
        color="#62929E"
        anchorX="center"
        anchorY="middle"
        backgroundColor="#ffffff"
        padding={0.5}
      >
        {content}
      </Text>
    </group>
  );
}

function Wheel() {
  const [tooltipData, setTooltipData] = useState(null);
  const groupRef = useRef();
  const radius = 8;

  useFrame(() => {
    if (groupRef.current && !tooltipData) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  const generatePositionAndRotation = (index, total) => {
    const angle = (index / total) * Math.PI * 2;
    const position = [
      radius * Math.cos(angle),
      0,
      radius * Math.sin(angle)
    ];
    // Calculate rotation to face the center
    const rotation = [0, -angle - Math.PI / 2, 0];
    
    return { position, rotation };
  };

  return (
    <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]}>
      <WheelBase />
      {choices.map((choice, index) => {
        const { position, rotation } = generatePositionAndRotation(index, choices.length);
        return (
          <Choice
            key={index}
            position={position}
            rotation={rotation}
            data={choice}
            onHover={setTooltipData}
          />
        );
      })}
      {tooltipData && (
        <Tooltip
          content={tooltipData.content}
          position={tooltipData.position}
        />
      )}
    </group>
  );
}

function Chart() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 30, 0], fov: 45 }}>
        <color attach="background" args={["#EDEAD0"]} />
        
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <spotLight
          position={[-10, 15, 10]}
          angle={0.3}
          penumbra={1}
          intensity={0.8}
          castShadow
        />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          minDistance={15}
          maxDistance={50}
        />

        <Wheel />
      </Canvas>
    </div>
  );
}

export default Chart;