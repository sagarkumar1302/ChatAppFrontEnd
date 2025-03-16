import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

function Person({ trainPosition, index }) {
  const personRef = useRef();
  const [status, setStatus] = useState('waiting'); // waiting, boarding, boarded
  const startPosition = [-8 - index, 0, 2]; // Changed from right to left side

  useFrame(() => {
    if (!personRef.current || status === 'boarded') return;

    if (status === 'waiting') {
      // Start boarding when train is at station and stopped
      if (Math.abs(trainPosition.z - 2) < 0.1 && trainPosition.isStopped) {
        setStatus('boarding');
      }
    }

    if (status === 'boarding') {
      // Move towards train from left to right
      if (personRef.current.position.x < trainPosition.x) {
        personRef.current.position.x += 0.05; // Changed from -= to +=
      }
      // When close enough to train, mark as boarded
      if (personRef.current.position.x >= trainPosition.x - 2) { // Changed from <= and +2 to >= and -2
        setStatus('boarded');
      }
    }
  });

  return status !== 'boarded' ? (
    <group ref={personRef} position={startPosition}>
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.2, 1, 4, 8]} />
        <meshStandardMaterial color={`hsl(${index * 40}, 70%, 50%)`} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#DEB887" />
      </mesh>
      {/* Letter */}
      <mesh position={[-0.3, 1.2, 0.2]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.2, 0.15, 0.01]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  ) : null;
}

function Station() {
  return (
    <group position={[4, 0, 0]}>
      {/* Platform */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[4, 0.4, 30]} />
        <meshStandardMaterial color="#cbd5e0" />
      </mesh>
      {/* Station Building */}
      <group position={[0, 2, 0]}>
        {/* Main building */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3, 4, 8]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[3, 1, 8.5]} />
          <meshStandardMaterial color="#718096" />
        </mesh>
        {/* Windows - moved to opposite side */}
        {[-2, 0, 2].map((z, i) => (
          <mesh key={i} position={[-1.51, 0.5, z]}>
            <boxGeometry args={[0.1, 1.5, 1]} />
            <meshStandardMaterial color="#A0D8EF" />
          </mesh>
        ))}
        {/* Door - moved to opposite side */}
        <mesh position={[-1.51, -0.5, 0]}>
          <boxGeometry args={[0.1, 2.5, 1.5]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
      </group>
    </group>
  );
}

function Environment() {
  return (
    <group>
      {/* Ground */}
      <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#90b167" />
      </mesh>
      
      {/* Trees with fixed positions */}
      {[
        [-10, 0, -10],
        [-15, 0, -5],
        [-12, 0, 5],
        [-8, 0, 15],
        [8, 0, -12],
        [12, 0, -8],
        [15, 0, 5],
        [10, 0, 15],
        [-18, 0, 0],
        [18, 0, 0]
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Tree trunk */}
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 2]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Tree top */}
          <mesh position={[0, 2.5, 0]}>
            <coneGeometry args={[1.5, 3, 8]} />
            <meshStandardMaterial color="#2F4F4F" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Train({ setTrainPosition }) {
  const trainRef = useRef();
  const [trainState, setTrainState] = useState({
    position: { x: 0, y: 0, z: -20 },
    isStopped: false,
    stationTimer: 0
  });

  useFrame((state, delta) => {
    if (!trainRef.current) return;

    // Update train state based on current position and timing
    setTrainState(prev => {
      const newState = { ...prev };
      
      // If train is near station (z ≈ 2), stop for passengers
      if (Math.abs(trainRef.current.position.z - 2) < 0.1 && !prev.isStopped) {
        newState.isStopped = true;
        newState.stationTimer = 0;
      }

      // If stopped at station, wait for 5 seconds
      if (prev.isStopped) {
        newState.stationTimer = prev.stationTimer + delta;
        if (newState.stationTimer > 5) { // 5 seconds wait
          newState.isStopped = false;
        }
      }

      // Move train if not stopped
      if (!newState.isStopped) {
        trainRef.current.position.z += 0.05;
        if (trainRef.current.position.z > 20) {
          trainRef.current.position.z = -20;
        }
      }

      newState.position = {
        x: trainRef.current.position.x,
        y: trainRef.current.position.y,
        z: trainRef.current.position.z
      };

      setTrainPosition({
        ...newState.position,
        isStopped: newState.isStopped
      });

      return newState;
    });
  });

  return (
    <group ref={trainRef} position={[0, 0, -20]}>
      {/* Main locomotive body - Red */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2, 2.4, 6]} />
        <meshStandardMaterial color="#cc0000" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Front nose - Red with black trim */}
      <mesh position={[0, 0.8, 3.5]}>
        <boxGeometry args={[2, 1.6, 2]} />
        <meshStandardMaterial color="#cc0000" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.3, 4]}>
        <boxGeometry args={[2.1, 0.2, 1]} />
        <meshStandardMaterial color="#111111" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Cabin with details - Black trim */}
      <mesh position={[0, 2.2, -1.5]}>
        <boxGeometry args={[1.8, 1, 2]} />
        <meshStandardMaterial color="#111111" metalness={0.4} />
      </mesh>

      {/* Windows with white frame */}
      {[-0.5, 0.5].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 2.2, -1.5]}>
            <boxGeometry args={[0.6, 0.6, 2.1]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[x, 2.2, -1.5]}>
            <boxGeometry args={[0.4, 0.4, 2.2]} />
            <meshStandardMaterial color="#A0D8EF" opacity={0.7} transparent />
          </mesh>
        </group>
      ))}

      {/* Chimney - Black with silver trim */}
      <mesh position={[0, 3, 0.5]}>
        <cylinderGeometry args={[0.3, 0.4, 1]} />
        <meshStandardMaterial color="#111111" metalness={0.8} />
      </mesh>
      <mesh position={[0, 3.6, 0.5]}>
        <cylinderGeometry args={[0.45, 0.3, 0.3]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} />
      </mesh>

      {/* Side details - White stripes */}
      <mesh position={[1.01, 1.2, 0]}>
        <boxGeometry args={[0.01, 0.3, 5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-1.01, 1.2, 0]}>
        <boxGeometry args={[0.01, 0.3, 5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Wheels with details - Black with silver rims */}
      {[-2.5, -1, 0.5, 2].map((pos, i) => (
        <group key={i}>
          {/* Main wheel */}
          <mesh position={[-1.1, 0.5, pos]}>
            <cylinderGeometry args={[0.5, 0.5, 0.2]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[1.1, 0.5, pos]}>
            <cylinderGeometry args={[0.5, 0.5, 0.2]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Wheel rim - Silver */}
          <mesh position={[-1.1, 0.5, pos]}>
            <cylinderGeometry args={[0.52, 0.52, 0.05]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#ffffff" metalness={0.9} />
          </mesh>
          <mesh position={[1.1, 0.5, pos]}>
            <cylinderGeometry args={[0.52, 0.52, 0.05]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#ffffff" metalness={0.9} />
          </mesh>
          {/* Wheel hub - Silver */}
          <mesh position={[-1.1, 0.5, pos]}>
            <cylinderGeometry args={[0.1, 0.1, 0.22]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#ffffff" metalness={0.9} />
          </mesh>
          <mesh position={[1.1, 0.5, pos]}>
            <cylinderGeometry args={[0.1, 0.1, 0.22]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#ffffff" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Front buffer - Black with silver trim */}
      <mesh position={[0, 0.6, 4.5]}>
        <boxGeometry args={[1.8, 0.3, 0.2]} />
        <meshStandardMaterial color="#111111" metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.6, 4.6]}>
        <boxGeometry args={[1.6, 0.2, 0.1]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} />
      </mesh>

      {/* Additional details - Red with black trim */}
      <mesh position={[0, 1.8, 3]}>
        <boxGeometry args={[1.9, 0.2, 1]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  );
}

function Tracks() {
  return (
    <group position={[0, -1, 0]}>
      {/* Rails */}
      <mesh position={[-1, 0, 0]}>
        <boxGeometry args={[0.2, 0.1, 100]} />
        <meshStandardMaterial color="#718096" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1, 0, 0]}>
        <boxGeometry args={[0.2, 0.1, 100]} />
        <meshStandardMaterial color="#718096" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Sleepers */}
      {[...Array(50)].map((_, i) => (
        <mesh key={i} position={[0, -0.1, i * 2 - 25]}>
          <boxGeometry args={[2.5, 0.2, 0.5]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
      ))}
    </group>
  );
}

export default function ThreeScene() {
  const [trainPos, setTrainPos] = useState({ 
    x: 0, 
    y: 0, 
    z: -20, 
    isStopped: false 
  });

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [15, 8, 15], fov: 60 }}
        className="w-full h-full"
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
          preserveDrawingBuffer: true
        }}
      >
        <color attach="background" args={['#87CEEB']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} />
        
        <Train setTrainPosition={setTrainPos} />
        {/* Add three passengers */}
        {[0, 1, 2].map((index) => (
          <Person key={index} trainPosition={trainPos} index={index} />
        ))}
        <Tracks />
        <Station />
        <Environment />
        
        <OrbitControls enableZoom={true} makeDefault />
        <fog attach="fog" args={['#ffffff', 5, 50]} />
      </Canvas>
    </div>
  );
}