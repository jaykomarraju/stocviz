import { useState } from "react";
import AudioVisualizer3D from "./components/AudioVisualizer3D";

function App() {
  const [symbol, setSymbol] = useState("AAPL");

  return (
    <div
      style={{
        textAlign: "left", padding: "20px", height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <AudioVisualizer3D/>
    </div>
  );
}

export default App;
