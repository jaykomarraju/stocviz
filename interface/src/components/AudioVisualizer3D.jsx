// import React, { useState, useRef, useEffect } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';

// export default function AudioVisualizer3D() {
//   const [audioContext, setAudioContext] = useState(null);
//   const [analyzer, setAnalyzer] = useState(null);
//   const [audioSource, setAudioSource] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [fileName, setFileName] = useState('');

//   // Handle file input: read file, decode, and setup Analyser
//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setFileName(file.name);

//     // Create or reuse an AudioContext
//     const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
//     setAudioContext(newAudioContext);

//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       if (!event?.target?.result) return;
//       const arrayBuffer = event.target.result;

//       // Decode the audio data
//       const audioBuffer = await newAudioContext.decodeAudioData(arrayBuffer);

//       // Create a buffer source
//       const source = newAudioContext.createBufferSource();
//       source.buffer = audioBuffer;

//       // Create an analyser node
//       const newAnalyzer = newAudioContext.createAnalyser();
//       newAnalyzer.fftSize = 128; // can adjust to taste

//       // Connect source -> analyser -> destination
//       source.connect(newAnalyzer);
//       newAnalyzer.connect(newAudioContext.destination);

//       // Store
//       setAnalyzer(newAnalyzer);
//       setAudioSource(source);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const handlePlay = () => {
//     if (!audioContext || !audioSource) return;

//     // If context is suspended, resume it
//     if (audioContext.state === 'suspended') {
//       audioContext.resume();
//     }

//     // Start playing from the beginning
//     try {
//       audioSource.start(0);
//       setIsPlaying(true);
//     } catch (err) {
//       // If user plays multiple times, source can only start once
//       console.warn('Audio source may already have been started:', err);
//     }
//   };

//   const handleStop = () => {
//     if (!audioSource) return;
//     try {
//       audioSource.stop();
//     } catch (err) {
//       console.warn('Audio source may already have been stopped:', err);
//     }
//     setIsPlaying(false);
//   };

//   return (
//     <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
//       {/* Controls */}
//       <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
//         <input type="file" accept="audio/*" onChange={handleFileChange} 
//             style={{
//                 marginBottom: '10px',
//                 padding: '5px',
//                 borderRadius: '5px',
//                 // border: '3px solid #ccc',
//                 backgroundColor: '#f9f9f9',
//                 fontSize: '14px',
//                 cursor: 'pointer'

//             }}
//         />
//         {fileName && <p>Loaded: {fileName}</p>}
//         {!isPlaying ? (
//           <button 
//             onClick={handlePlay} 
//             disabled={!analyzer || isPlaying}
//             onMouseEnter={(e) => e.target.style.background = 'rgb(72, 72, 72)'}
//             onMouseLeave={(e) => e.target.style.background = 'rgb(52, 52, 52)'}
//             style={{
//                 padding: '5px 10px',
//                 borderRadius: '5px',
//                 background: 'rgb(52, 52, 52)',
//                 color: 'white',
//                 fontSize: '14px',
//                 cursor: 'pointer'
//             }}
//           >
//             Play
//           </button>
//         ) : (
//           <button onClick={handleStop}>Stop</button>
//         )}
//       </div>

//       {/* 3D Canvas */}
//       <Canvas
//         camera={{ position: [0, 3, 8], fov: 60 }}
//         style={{ background: '#fff', width: '100%', height: '100%' }}
//       >
//         <ambientLight intensity={0.4} />
//         <pointLight position={[10, 10, 10]} />
//         <OrbitControls />

//         {analyzer && <Bars analyzer={analyzer} />}
//       </Canvas>
//     </div>
//   );
// }

// // A sub-component (still in the same file) that renders our bars in a circle
// function Bars({ analyzer }) {
//   const barsRef = useRef([]);
//   const barCount = 64; // number of frequency bins to visualize
//   const radius = 3;    // radius of the circular arrangement

//   // We'll store frequency data in a typed array for performance
//   const dataArray = useRef(new Uint8Array(analyzer.frequencyBinCount));

//   useFrame(() => {
//     if (!analyzer) return;
//     // Get the frequency data
//     analyzer.getByteFrequencyData(dataArray.current);

//     // For each bar, scale according to frequency data
//     barsRef.current.forEach((mesh, i) => {
//       if (!mesh) return;
//       const scaleY = (dataArray.current[i] / 255) * 5; // scale factor
//       mesh.scale.y = 0.1 + scaleY;
//     });
//   });

//   const meshes = [];
//   for (let i = 0; i < barCount; i++) {
//     const angle = (i / barCount) * Math.PI * 2;
//     const x = Math.cos(angle) * radius;
//     const z = Math.sin(angle) * radius;
//     const y = 0; // keep everything on the "floor" at y=0

//     meshes.push(
//       <mesh
//         key={i}
//         position={[x, y, z]}
//         rotation={[0, angle, 0]}
//         ref={(ref) => (barsRef.current[i] = ref)}
//       >
//         <boxGeometry args={[0.2, 1, 0.2]} />
//         {/* Gradually change color around the circle */}
//         <meshStandardMaterial color={`hsl(${(i / barCount) * 360}, 100%, 50%)`} />
//       </mesh>
//     );
//   }

//   return <group>{meshes}</group>;
// }


import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame} from '@react-three/fiber';
import { OrbitControls, Text3D, Points } from '@react-three/drei';
import * as THREE from 'three';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons'



export default function AudioVisualizer3D() {
  const [audioContext, setAudioContext] = useState(null);
  const [analyzer, setAnalyzer] = useState(null);
  const [audioSource, setAudioSource] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileName, setFileName] = useState('');
  const [visualType, setVisualType] = useState('bars'); // "bars", "waveform", "limiter", "dynamics"

  // Handle file input: read file, decode, and setup Analyser
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    // Create or reuse an AudioContext
    const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(newAudioContext);

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event?.target?.result) return;
      const arrayBuffer = event.target.result;

      // Decode the audio data
      const audioBuffer = await newAudioContext.decodeAudioData(arrayBuffer);

      // Create a buffer source
      const source = newAudioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Create an analyser node
      const newAnalyzer = newAudioContext.createAnalyser();
      newAnalyzer.fftSize = 2048; // We'll use a larger FFT to get more waveform detail for time-domain

      // Connect source -> analyser -> destination
      source.connect(newAnalyzer);
      newAnalyzer.connect(newAudioContext.destination);

      // Store
      setAnalyzer(newAnalyzer);
      setAudioSource(source);
    };
    reader.readAsArrayBuffer(file);
  };

const handlePlay = () => {
    if (!audioContext || !audioSource) return;
  
    // If context is suspended, resume it
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  
    // Create a new buffer source
    const newSource = audioContext.createBufferSource();
    newSource.buffer = audioSource.buffer;
  
    // Connect to analyzer
    newSource.connect(analyzer);
    
    // Update the source reference
    setAudioSource(newSource);
  
    // Start playing from the beginning
    try {
      newSource.start(0);
      setIsPlaying(true);
    } catch (err) {
      console.warn('Audio source may already have been started:', err);
    }
  };

  const handleStop = () => {
    if (!audioSource) return;
    try {
      audioSource.stop();
    } catch (err) {
      console.warn('Audio source may already have been stopped:', err);
    }
    setIsPlaying(false);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', margiTop: '100px' }}>

      <h1
        style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            fontSize: '24px',
            color: 'black',
            textAlign: 'center',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: '1.2px',
        }}
      >WAV WHEEL</h1>
      {/* Controls */}
      <div style={{ position: 'absolute', top: '10%', left: '25%', zIndex: 100 }}>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          style={{
            marginBottom: '10px',
            padding: '5px',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        />
        {fileName && <p
            style={{
                fontSize: '14px',
                marginBottom: '10px',
                textAlign: 'center',
                width: '100%',
                textTransform: 'uppercase',
            }}
        >Loaded: {fileName}</p>}

        {!isPlaying ? (
       <button
       onClick={handlePlay}
       disabled={!analyzer || isPlaying}
       style={{
         padding: '5px 10px',
         borderRadius: '5px',
         background: 'rgb(52, 52, 52)',
         color: 'white',
         fontSize: '24px',
         cursor: 'pointer',
         marginRight: '5px',
         marginLeft: '40px',
         marginBottom: '5px',
         marginTop: '10px',
         width: '60px', 
         height: '60px',
       }}
     >
       <FontAwesomeIcon icon={faPlay} /> 
     </button>
        ) : (
          <button onClick={handleStop}
            style={{
                padding: '5px 10px',
                borderRadius: '5px',
                background: 'rgb(52, 52, 52)',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                marginRight: '5px',
                marginLeft: '40px',
                marginBottom: '5px',
                marginTop: '20px',
                width: '60px', 
                height: '60px',
            }}
          >
            <FontAwesomeIcon icon={faStop} />
          </button>
        )}

        <br />

        <label style={{ fontSize: '14px', marginRight: '5px' }}>Select Visualization:</label>
        <select
          value={visualType}
          onChange={(e) => setVisualType(e.target.value)}
          style={{ padding: '5px', fontSize: '14px' }}
        >
          <option value="bars">EQ Bars</option>
          <option value="waveform">Waveform</option>
          <option value="limiter">Limiter Info</option>
          <option value="dynamics">Dynamics</option>
        </select>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 3, 8], fov: 60 }}
        style={{ background: '#fff', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />

        {analyzer && visualType === 'bars' && <Bars analyzer={analyzer} />}
        {analyzer && visualType === 'waveform' && <Waveform analyzer={analyzer} />}
        {analyzer && visualType === 'limiter' && <LimiterSphere analyzer={analyzer} />}
        {analyzer && visualType === 'dynamics' && <DynamicsRing analyzer={analyzer} />}
      </Canvas>
    </div>
  );
}

/** 1) EQ Visual — Bars in a circle */
function Bars({ analyzer }) {
    const barsRef = useRef([]);
    const barCount = 64;
    const radius = 3;
    const dataArray = useRef(new Uint8Array(analyzer.frequencyBinCount));
    const [peakFreq, setPeakFreq] = useState(0);
    const [avgMagnitude, setAvgMagnitude] = useState(0);
  
    useFrame(() => {
      analyzer.getByteFrequencyData(dataArray.current);
      
      let peak = 0;
      let peakIndex = 0;
      let sum = 0;
      
      barsRef.current.forEach((mesh, i) => {
        if (!mesh) return;
        const value = dataArray.current[i];
        const scaleY = (value / 255) * 5;
        mesh.scale.y = 0.1 + scaleY;
        
        sum += value;
        if (value > peak) {
          peak = value;
          peakIndex = i;
        }
      });
  
      // Calculate peak frequency and average magnitude
      const nyquist = analyzer.context.sampleRate / 2;
      setPeakFreq(Math.round((peakIndex / barCount) * nyquist));
      setAvgMagnitude(Math.round((sum / barCount) * 100) / 100);
    });
  
    const meshes = [];
    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      meshes.push(
        <mesh
          key={i}
          position={[x, 0, z]}
          rotation={[0, angle, 0]}
          ref={(ref) => (barsRef.current[i] = ref)}
        >
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial color={`hsl(${(i / barCount) * 360}, 100%, 50%)`} />
        </mesh>
      );
    }
  
    return (
      <>
        <group>{meshes}</group>
        </>
    );


  }

/** 2) Waveform Visual — “Snake” line that plots the time-domain data */
// function Waveform({ analyzer }) {
//   const lineRef = useRef();
//   const dataArray = useRef(new Uint8Array(analyzer.fftSize));
//   const waveGeometryRef = useRef(null);

//   useFrame(() => {
//     analyzer.getByteTimeDomainData(dataArray.current);

//     const points = [];
//     // We'll make a "snake" line that travels on the X-axis 
//     // and uses the Y-axis for waveform amplitude
//     // You can also do more complex 3D shapes or rotations
//     for (let i = 0; i < dataArray.current.length; i++) {
//       const x = (i / dataArray.current.length) * 6 - 3; // from -3 to +3
//       const y = (dataArray.current[i] - 128) / 128; // -1 to +1
//       points.push(new THREE.Vector3(x, y, 0));
//     }

//     if (waveGeometryRef.current) {
//       waveGeometryRef.current.setFromPoints(points);
//     }
//   });

//   return (
//     <line ref={lineRef}>
//       <bufferGeometry ref={waveGeometryRef} />
//       <lineBasicMaterial color="orange" linewidth={2} />
//     </line>
//   );
// }
function Waveform({ analyzer }) {
    const groupRef = useRef();
    const linesRef = useRef([]);
    const dataArray = useRef(new Uint8Array(analyzer.fftSize));
    const historySize = 64;
    const waveHistory = useRef(Array(historySize).fill(new Float32Array(analyzer.fftSize)));
    
    // Create initial geometry
    useEffect(() => {
      linesRef.current = Array(historySize).fill().map(() => new THREE.BufferGeometry());
    }, []);
  
    useFrame(({ clock }) => {
      analyzer.getByteTimeDomainData(dataArray.current);
      
      // Shift historical data
      waveHistory.current.shift();
      waveHistory.current.push(new Float32Array(dataArray.current));
  
      // Update each line in the spiral
      waveHistory.current.forEach((historySlice, historyIndex) => {
        const points = [];
        const segments = 128;
        const radius = 2 + (historyIndex * 0.03);
        
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const heightIndex = Math.floor((i / segments) * historySlice.length);
          const amplitude = (historySlice[heightIndex] - 128) / 128;
          
          const x = Math.cos(angle + (historyIndex * 0.1)) * radius;
          const z = Math.sin(angle + (historyIndex * 0.1)) * radius;
          const y = amplitude * 1.5 + (historyIndex * 0.05);
  
          points.push(new THREE.Vector3(x, y, z));
        }
  
        // Close the loop
        const firstPoint = points[0];
        points.push(firstPoint);
  
        // Update geometry
        if (linesRef.current[historyIndex]) {
          linesRef.current[historyIndex].setFromPoints(points);
        }
      });
  
      // Rotate the entire visualization
      if (groupRef.current) {
        groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      }
    });

    // Create particles positions array
    const particlePositions = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500 * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 10;     // x
      particlePositions[i + 1] = (Math.random() - 0.5) * 10; // y
      particlePositions[i + 2] = (Math.random() - 0.5) * 10; // z
    }
  
    return (
      <group ref={groupRef}>
        {/* Center sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.5} />
        </mesh>
  
        {/* Historical waveforms */}
        {Array(historySize).fill().map((_, index) => (
          <line key={index}>
            <bufferGeometry ref={el => linesRef.current[index] = el} />
            <lineBasicMaterial 
              color={`hsl(${(index / historySize) * 30 + 20}, 100%, 50%)`}
              linewidth={2}
              transparent={true}
              opacity={1 - (index / historySize) * 0.8}
            />
          </line>
        ))}
  
        {/* Particle system */}
        <Points>
          <pointsMaterial 
            size={0.02} 
            color="#ffffff" 
            transparent={true} 
            opacity={0.3}
          />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={1500}
              array={particlePositions}
              itemSize={3}
            />
          </bufferGeometry>
        </Points>
      </group>
    );
}

/** 3) Limiter Info Visual — A sphere that changes color/intensity if volume is near clipping */
function LimiterSphere({ analyzer }) {
  const sphereRef = useRef();
  const materialRef = useRef();
  const dataArray = useRef(new Uint8Array(analyzer.fftSize));

  useFrame(() => {
    analyzer.getByteTimeDomainData(dataArray.current);
    // Compute approximate amplitude:
    let sum = 0;
    for (let i = 0; i < dataArray.current.length; i++) {
      const val = dataArray.current[i] - 128; // center around 0
      sum += val * val;
    }
    const rms = Math.sqrt(sum / dataArray.current.length); // root mean square amplitude

    // We'll interpret 'rms' in 0..128 range as normal
    // If it’s near 128 (i.e. ±128 from center), that's basically clipping
    const normalized = rms / 128;
    const clippingThreshold = 0.8; // beyond this is "clipping"

    if (sphereRef.current && materialRef.current) {
      // Scale sphere from 1 to 2 based on amplitude
      sphereRef.current.scale.setScalar(1 + normalized);

      // If near clipping, color is red, else green
      if (normalized > clippingThreshold) {
        materialRef.current.color.set('red');
      } else {
        materialRef.current.color.set('green');
      }
    }
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial ref={materialRef} color="green" />
    </mesh>
  );
}

/** 4) Dynamics Visual — A ring that expands and contracts based on average amplitude */
function DynamicsRing({ analyzer }) {
  const ringRef = useRef();
  const dataArray = useRef(new Uint8Array(analyzer.fftSize));

  useFrame(() => {
    analyzer.getByteFrequencyData(dataArray.current);
    // We'll approximate “dynamics” by the average frequency magnitude
    let sum = 0;
    for (let i = 0; i < dataArray.current.length; i++) {
      sum += dataArray.current[i];
    }
    const avg = sum / dataArray.current.length; // 0..255
    const scale = 0.5 + (avg / 255) * 2; // scale between 0.5..2.5

    if (ringRef.current) {
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={ringRef} rotation-x={Math.PI / 2}>
      {/* ringGeometry(innerRadius, outerRadius, thetaSegments, phiSegments) */}
      <ringGeometry args={[0.8, 1, 64, 1]} />
      <meshStandardMaterial color="blue" side={THREE.DoubleSide} />
    </mesh>
  );
}
