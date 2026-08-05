import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Grid, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Drone Component
function Drone({ state }) {
  const droneRef = useRef();
  const rotorRefs = [useRef(), useRef(), useRef(), useRef()];
  const scannerRef = useRef();

  useFrame((stateContext, delta) => {
    if (!droneRef.current) return;

    // Spin rotors
    const spinSpeed = state.droneState === 'landed' ? 0.5 : (state.droneState === 'crashed' ? 0 : 25);
    rotorRefs.forEach(ref => {
      if (ref.current) ref.current.rotation.y += spinSpeed * delta;
    });

    // Spin LiDAR scanner
    if (scannerRef.current) {
      scannerRef.current.rotation.y += (state.droneState === 'scanning' ? 15 : 2) * delta;
    }

    const currentPos = droneRef.current.position;
    const currentRot = droneRef.current.rotation;

    // Smooth movement interpolation
    currentPos.y = THREE.MathUtils.lerp(currentPos.y, state.altitude + 0.3, 0.05);
    currentPos.x = THREE.MathUtils.lerp(currentPos.x, state.dronePos.x, 0.05);
    currentPos.z = THREE.MathUtils.lerp(currentPos.z, state.dronePos.z, 0.05);

    // Dynamic rotation based on movement and state
    let targetPitch = 0;
    let targetRoll = 0;
    
    // Tilt into movement
    const dx = state.dronePos.x - currentPos.x;
    const dz = state.dronePos.z - currentPos.z;
    if (state.droneState === 'moving') {
      targetRoll = -dx * 0.2;
      targetPitch = dz * 0.2;
    }

    if (state.droneState === 'crashed') {
      targetPitch = Math.PI / 2.5; // Flipped/tilted
      targetRoll = Math.PI / 3;
    } else if (state.droneState === 'descending') {
      // Wobbly descent if low success probability (early episodes)
      if (state.episode < 100) {
        targetPitch = (Math.random() - 0.5) * 0.2;
        targetRoll = (Math.random() - 0.5) * 0.2;
      }
    }

    currentRot.x = THREE.MathUtils.lerp(currentRot.x, targetPitch, 0.1);
    currentRot.z = THREE.MathUtils.lerp(currentRot.z, targetRoll, 0.1);
  });

  return (
    <group ref={droneRef} position={[0, 10, 0]}>
      {/* Attached Light to always illuminate the drone */}
      <pointLight position={[0, 2, 0]} intensity={2.5} distance={15} color="#ffffff" />
      
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[1, 0.3, 1]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.2} roughness={0.1} />
      </mesh>
      
      {/* Arms & Rotors */}
      {[[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]].map((pos, i) => (
        <group key={i}>
          <mesh position={[pos[0]/2, 0, pos[1]/2]} rotation={[0, Math.atan2(pos[1], pos[0]), 0]}>
            <boxGeometry args={[1, 0.1, 0.1]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[pos[0], 0.1, pos[1]]}>
            <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>
          <mesh ref={rotorRefs[i]} position={[pos[0], 0.25, pos[1]]}>
            <boxGeometry args={[0.8, 0.02, 0.1]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.8} />
          </mesh>
        </group>
      ))}

      {/* LiDAR Scanner Module */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      
      {/* Rotating Laser Core */}
      <mesh ref={scannerRef} position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

// Procedural Point Cloud
function LiDARPointCloud({ state }) {
  const pointsRef = useRef();
  const [positions, setPositions] = useState(new Float32Array(0));
  const [colors, setColors] = useState(new Float32Array(0));

  useEffect(() => {
    if (state.droneState === 'scanning') {
      const numPoints = Math.floor(state.pointCloudDensity);
      const pos = new Float32Array(numPoints * 3);
      const col = new Float32Array(numPoints * 3);
      
      const safeColor = new THREE.Color('#22c55e');
      const medColor = new THREE.Color('#eab308');
      const dangerColor = new THREE.Color('#ef4444');

      for (let i = 0; i < numPoints; i++) {
        // Random spread around drone
        const r = Math.random() * 8;
        const theta = Math.random() * 2 * Math.PI;
        const px = state.dronePos.x + r * Math.cos(theta);
        const pz = state.dronePos.z + r * Math.sin(theta);
        
        // Procedural height mapping based on terrain seed
        const noise = Math.sin(px * 1.5 + state.terrainSeed * 10) * Math.cos(pz * 1.5) * 0.5;
        const py = noise > 0 ? noise : 0;

        pos[i * 3] = px;
        pos[i * 3 + 1] = py + 0.05;
        pos[i * 3 + 2] = pz;

        // Color based on safety (flat = green, bumpy = red)
        let c = safeColor;
        if (Math.abs(noise) > 0.3) c = dangerColor;
        else if (Math.abs(noise) > 0.1) c = medColor;

        col[i * 3] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;
      }
      setPositions(pos);
      setColors(col);
    }
  }, [state.droneState, state.pointCloudDensity, state.terrainSeed, state.dronePos]);

  if (state.droneState !== 'scanning' && state.droneState !== 'evaluating' && state.droneState !== 'moving') return null;
  if (positions.length === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.15} vertexColors transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// Glowing Target Zone
function TargetZone({ state }) {
  if (state.targetRadius <= 0) return null;
  return (
    <mesh position={[state.targetPos.x, 0.05, state.targetPos.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[state.targetRadius - 0.2, state.targetRadius, 32]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

// Procedural Terrain
function Terrain({ seed, type }) {
  const obstacles = useMemo(() => {
    const arr = [];
    let numObstacles = 10;
    let w = 2, h = 2, d = 2;
    let isBuilding = type === 'Buildings';
    let isTree = type === 'Trees';
    
    if (isBuilding) {
      numObstacles = 15;
      w = 4; h = 10; d = 4;
    } else if (isTree) {
      numObstacles = 25;
      w = 1; h = 4; d = 1;
    } else if (type === 'Random obstacles' || type === 'Concrete' || type === 'Road') {
      numObstacles = 30;
      w = 1; h = 1; d = 1;
    } else if (type === 'Grass' || type === 'Sand' || type === 'Water') {
      numObstacles = 5; // very few
      w = 1; h = 0.5; d = 1;
    }

    for(let i=0; i<numObstacles; i++) {
      arr.push({
        x: (Math.sin(seed * i * 12.3) - 0.5) * 40,
        z: (Math.cos(seed * i * 45.6) - 0.5) * 40,
        w: (Math.random() * w) + w/2,
        h: (Math.random() * h) + h/2,
        d: (Math.random() * d) + d/2,
        isTree: isTree
      });
    }
    return arr;
  }, [seed, type]);

  const color = useMemo(() => {
    switch(type) {
      case 'Grass': return '#1a3e1a'; // Green
      case 'Road': return '#333333'; // Dark gray
      case 'Sand': return '#c2b280'; // Sandy
      case 'Rock': return '#5a5a5a'; // Rocky gray
      case 'Water': return '#1ca3ec'; // Blue
      case 'Concrete': return '#7f8c8d'; // Light gray
      case 'Trees': return '#2e4a19'; // Forest green ground
      case 'Buildings': return '#222222'; // Dark ground
      default: return '#1e2430'; // fallback
    }
  }, [type]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={color} roughness={type === 'Water' ? 0.1 : 0.9} metalness={type === 'Water' ? 0.8 : 0.1} />
      </mesh>
      
      {obstacles.map((obs, i) => (
        <group key={i} position={[obs.x, 0, obs.z]}>
          {obs.isTree ? (
            // Tree
            <group>
              <mesh position={[0, obs.h/2, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.2, 0.2, obs.h]} />
                <meshStandardMaterial color="#3d2817" />
              </mesh>
              <mesh position={[0, obs.h, 0]} castShadow receiveShadow>
                <coneGeometry args={[obs.w * 1.5, obs.h, 8]} />
                <meshStandardMaterial color="#2d5a27" />
              </mesh>
            </group>
          ) : (
            // Box obstacle / Building
            <mesh position={[0, obs.h/2, 0]} castShadow receiveShadow>
              <boxGeometry args={[obs.w, obs.h, obs.d]} />
              <meshStandardMaterial color={type === 'Buildings' ? '#111' : '#4a5568'} roughness={0.8} />
            </mesh>
          )}
        </group>
      ))}

      <Grid infiniteGrid fadeDistance={40} sectionColor="rgba(56, 189, 248, 0.3)" cellColor="rgba(56, 189, 248, 0.05)" />
    </group>
  );
}

// Cinematic Camera Controller
function CinematicCamera({ state }) {
  const { camera } = useThree();
  const time = useRef(0);
  
  useFrame((_, delta) => {
    time.current += delta;
    const dronePos = new THREE.Vector3(state.dronePos.x, state.altitude, state.dronePos.z);
    let targetCamPos = new THREE.Vector3();
    let targetLookAt = dronePos.clone();

    switch (state.droneState) {
      case 'generating':
        targetCamPos.set(0, 30, 30);
        targetLookAt.set(0, 0, 0);
        break;
      case 'scanning':
        // Orbit around drone
        targetCamPos.set(
          dronePos.x + Math.sin(time.current * 0.5) * 8,
          dronePos.y + 6,
          dronePos.z + Math.cos(time.current * 0.5) * 8
        );
        break;
      case 'moving':
      case 'takeoff':
      case 'hovering':
        // Follow behind
        targetCamPos.set(dronePos.x - 6, Math.max(dronePos.y + 3, 4), dronePos.z + 8);
        break;
      case 'descending':
      case 'landed':
      case 'crashed':
        // Close up cinematic
        targetCamPos.set(dronePos.x + 3.5, Math.max(dronePos.y + 1.5, 1), dronePos.z + 3.5);
        break;
      default:
        targetCamPos.set(0, 10, 10);
    }

    camera.position.lerp(targetCamPos, 0.03);
    
    // Lerp camera lookAt by using a dummy object or calculating quaternion
    // Simplest approach: create a dummy object, point it, slerp camera rotation
    const dummy = new THREE.Object3D();
    dummy.position.copy(camera.position);
    dummy.lookAt(targetLookAt);
    camera.quaternion.slerp(dummy.quaternion, 0.05);
  });

  return null;
}

export default function Simulation3D({ state }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <Canvas shadows camera={{ position: [0, 10, 10], fov: 45 }}>
        <color attach="background" args={['#0a0e17']} />
        
        <ambientLight intensity={1.2} />
        <directionalLight castShadow position={[20, 40, 20]} intensity={1.5} shadow-mapSize={[2048, 2048]} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#38bdf8" />
        
        <Drone state={state} />
        <LiDARPointCloud state={state} />
        <TargetZone state={state} />
        <Terrain seed={state.terrainSeed} type={state.terrain} />
        
        <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={20} blur={2} far={15} />
        
        <CinematicCamera state={state} />
      </Canvas>
    </div>
  );
}
