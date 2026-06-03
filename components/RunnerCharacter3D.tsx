'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Stato = 'corsa' | 'salto' | 'inciampo';

function Limb({ position, rotation, size, color }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} rotation={rotation ?? [0, 0, 0]}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
    </mesh>
  );
}

function CharacterMesh({ stato, colore }: { stato: Stato; colore: string }) {
  const root = useRef<THREE.Group>(null!);
  const torso = useRef<THREE.Group>(null!);
  const leftThigh = useRef<THREE.Group>(null!);
  const rightThigh = useRef<THREE.Group>(null!);
  const leftShin = useRef<THREE.Group>(null!);
  const rightShin = useRef<THREE.Group>(null!);
  const leftArm = useRef<THREE.Group>(null!);
  const rightArm = useRef<THREE.Group>(null!);

  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;

    if (stato === 'corsa') {
      const speed = 8;
      const phase = t.current * speed;

      // Body bob
      root.current.position.y = Math.abs(Math.sin(phase)) * 0.04 - 0.02;
      torso.current.rotation.x = -0.18; // forward lean

      // Legs
      const legSwing = 0.9;
      leftThigh.current.rotation.x = Math.sin(phase) * legSwing;
      rightThigh.current.rotation.x = Math.sin(phase + Math.PI) * legSwing;
      // Knee bend (shin follows thigh but with extra bend when behind)
      leftShin.current.rotation.x = Math.max(0, -Math.sin(phase)) * 1.0;
      rightShin.current.rotation.x = Math.max(0, -Math.sin(phase + Math.PI)) * 1.0;

      // Arms (opposite to legs)
      leftArm.current.rotation.x = Math.sin(phase + Math.PI) * 0.6;
      rightArm.current.rotation.x = Math.sin(phase) * 0.6;

    } else if (stato === 'salto') {
      root.current.position.y = 0;
      torso.current.rotation.x = 0;
      // Tuck legs up
      leftThigh.current.rotation.x = -0.9;
      rightThigh.current.rotation.x = -0.9;
      leftShin.current.rotation.x = 1.4;
      rightShin.current.rotation.x = 1.4;
      leftArm.current.rotation.x = -1.0;
      rightArm.current.rotation.x = -1.0;

    } else if (stato === 'inciampo') {
      const shake = t.current * 12;
      root.current.position.y = 0;
      torso.current.rotation.x = 0.3;
      torso.current.rotation.z = Math.sin(shake) * 0.3;
      leftThigh.current.rotation.x = 0.4;
      rightThigh.current.rotation.x = -0.2;
      leftShin.current.rotation.x = 0.6;
      rightShin.current.rotation.x = 0.2;
      leftArm.current.rotation.x = -0.5;
      rightArm.current.rotation.x = 0.8;
    }
  });

  const skinColor = '#f5c5a3';
  const shoeColor = '#1e293b';
  const hairColor = '#3b2a1a';
  const pantsColor = '#1e3a5f';

  return (
    <group ref={root} position={[0, 0, 0]}>
      {/* Torso group (pivot at hips) */}
      <group ref={torso} position={[0, 0.55, 0]}>
        {/* Torso */}
        <Limb position={[0, 0.3, 0]} size={[0.34, 0.5, 0.2]} color={colore} />
        {/* Neck */}
        <Limb position={[0, 0.6, 0]} size={[0.1, 0.1, 0.1]} color={skinColor} />
        {/* Head */}
        <mesh position={[0, 0.82, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.7} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.94, 0]}>
          <sphereGeometry args={[0.185, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>

        {/* Left arm (pivot at shoulder) */}
        <group ref={leftArm} position={[-0.23, 0.52, 0]}>
          <Limb position={[0, -0.15, 0]} size={[0.1, 0.3, 0.1]} color={skinColor} />
        </group>
        {/* Right arm */}
        <group ref={rightArm} position={[0.23, 0.52, 0]}>
          <Limb position={[0, -0.15, 0]} size={[0.1, 0.3, 0.1]} color={skinColor} />
        </group>
      </group>

      {/* Hips */}
      <Limb position={[0, 0.52, 0]} size={[0.32, 0.14, 0.18]} color={pantsColor} />

      {/* Left leg (pivot at hip) */}
      <group ref={leftThigh} position={[-0.1, 0.5, 0]}>
        <Limb position={[0, -0.18, 0]} size={[0.13, 0.36, 0.13]} color={pantsColor} />
        {/* Shin (pivot at knee) */}
        <group ref={leftShin} position={[0, -0.36, 0]}>
          <Limb position={[0, -0.17, 0]} size={[0.11, 0.34, 0.11]} color={skinColor} />
          {/* Shoe */}
          <Limb position={[0, -0.36, 0.04]} size={[0.13, 0.09, 0.2]} color={shoeColor} />
        </group>
      </group>

      {/* Right leg */}
      <group ref={rightThigh} position={[0.1, 0.5, 0]}>
        <Limb position={[0, -0.18, 0]} size={[0.13, 0.36, 0.13]} color={pantsColor} />
        <group ref={rightShin} position={[0, -0.36, 0]}>
          <Limb position={[0, -0.17, 0]} size={[0.11, 0.34, 0.11]} color={skinColor} />
          <Limb position={[0, -0.36, 0.04]} size={[0.13, 0.09, 0.2]} color={shoeColor} />
        </group>
      </group>
    </group>
  );
}

export default function RunnerCharacter3D({
  stato,
  colore,
  glow,
}: {
  stato: Stato;
  colore: string;
  glow?: 'correct' | 'wrong' | null;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.1, 2.8], fov: 42 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 4, 3]} intensity={1.2} castShadow />
      <directionalLight position={[-1, 2, -1]} intensity={0.3} color="#8ab4f8" />
      {glow === 'correct' && <pointLight position={[0, 1, 1]} intensity={2} color={colore} distance={3} />}
      {glow === 'wrong' && <pointLight position={[0, 1, 1]} intensity={2} color="#ef4444" distance={3} />}
      <CharacterMesh stato={stato} colore={colore} />
    </Canvas>
  );
}
