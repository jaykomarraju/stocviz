import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useStockData } from "../controls/useStockData";
import { animated, useSpring } from "@react-spring/three";

function Bar({ position, height, trend }) {
  const color = trend === "up" ? "green" : trend === "down" ? "red" : "blue";

  const springProps = useSpring({
    scale: [1, height / 20, 1],
    config: { tension: 120, friction: 14 }
  });

  return (
    <animated.mesh position={position} scale={springProps.scale}>
      <boxGeometry args={[0.5, 1, 0.5]} />
      <meshStandardMaterial color={color} />
    </animated.mesh>
  );
}

function StockChart3D({ symbol }) {
  const { data, loading } = useStockData(symbol);

  if (loading) return <p>Loading stock data...</p>;

  return (
    <Canvas camera={{ position: [0, 10, 20] }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />

      {data.map((d, i) => {
        const trend = d.close > d.open ? "up" : d.close < d.open ? "down" : "flat";
        return (
          <Bar
            key={i}
            position={[i - data.length / 2, d.close / 20, 0]}
            height={d.close}
            trend={trend}
          />
        );
      })}
    </Canvas>
  );
}

export default StockChart3D;
