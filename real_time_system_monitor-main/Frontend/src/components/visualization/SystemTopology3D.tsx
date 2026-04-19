'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useAppContext } from '@/components/layout/AppShell';

function ProcessNode({ process, index, total }: { process: any, index: number, total: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Arrange nodes in a 3D circle/helix
  const angle = (index / total) * Math.PI * 2;
  const radius = 10 + (process.cpuUsage / 10);
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = (process.cpuUsage / 10) - 2;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = y + Math.sin(state.clock.getElapsedTime() + index) * 0.2;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const color = process.cpuUsage > 80 ? '#FF3B30' : process.cpuUsage > 50 ? '#FF9500' : '#34C759';
  const size = 0.5 + (process.memUsage / 1000);

  return (
    <group position={[x, y, z]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>
      
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.4}
        color="white"
        font="/fonts/Inter-Bold.ttf"
        anchorX="center"
        anchorY="middle"
      >
        {process.name}
      </Text>
      
      <Text
        position={[0, -size - 0.5, 0]}
        fontSize={0.3}
        color="#888"
        anchorX="center"
        anchorY="middle"
      >
        {process.cpuUsage.toFixed(1)}%
      </Text>
    </group>
  );
}

function ConnectionLines({ processes }: { processes: any[] }) {
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    // Just draw some connections for visual effect, or use causal logic
    for (let i = 0; i < processes.length; i++) {
        if (i > 0 && i % 3 === 0) {
            const p1 = processes[i];
            const p2 = processes[i-1];
            
            const angle1 = (i / processes.length) * Math.PI * 2;
            const angle2 = ((i-1) / processes.length) * Math.PI * 2;
            
            points.push(new THREE.Vector3(Math.cos(angle1) * 10, (p1.cpuUsage/10)-2, Math.sin(angle1) * 10));
            points.push(new THREE.Vector3(Math.cos(angle2) * 10, (p2.cpuUsage/10)-2, Math.sin(angle2) * 10));
        }
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [processes]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial color="#A0373B" transparent opacity={0.3} />
    </lineSegments>
  );
}

export default function SystemTopology3D() {
  const { processes } = useAppContext();
  
  const activeProcesses = useMemo(() => 
    processes.filter(p => p.cpuUsage > 1).slice(0, 20), 
  [processes]);

  return (
    <div className="w-full h-full min-h-[600px] rounded-3xl overflow-hidden bg-black relative border border-white/10">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h2 className="text-2xl font-headline font-bold text-white mb-1">Spatial Topology</h2>
        <p className="text-xs text-on-surface-muted uppercase tracking-widest">Real-time 3D Neural Distribution</p>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 15, 30]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#A0373B" />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#007AFF" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <group rotation={[0, 0, 0]}>
          {activeProcesses.map((p, idx) => (
            <ProcessNode key={p.pid} process={p} index={idx} total={activeProcesses.length} />
          ))}
          <ConnectionLines processes={activeProcesses} />
          
          {/* Floor Grid */}
          <gridHelper args={[50, 50, '#333', '#111']} position={[0, -5, 0]} />
        </group>

        <OrbitControls 
            enableDamping 
            dampingFactor={0.05} 
            rotateSpeed={0.5}
            maxDistance={50}
            minDistance={10}
        />
      </Canvas>
      
      <div className="absolute bottom-6 right-6 flex gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-[10px] text-white">
            <div className="w-2 h-2 rounded-full bg-success" /> Healthy Nodes
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-[10px] text-white">
            <div className="w-2 h-2 rounded-full bg-primary" /> High Load
        </div>
      </div>
    </div>
  );
}
