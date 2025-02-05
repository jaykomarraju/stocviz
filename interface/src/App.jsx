import { useState } from "react";
import AudioVisualizer3D from "./components/AudioVisualizer3D";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import WHAT from "./articles/WHAT";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AudioVisualizer3D />} />
                <Route path="/about" element={<WHAT />} />
            </Routes>
        </Router>
    );  
}

export default App;
