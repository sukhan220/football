

// 'use client';

// import React, { useState, useRef, useMemo, useEffect } from 'react';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { Physics, useSphere, usePlane, useBox } from '@react-three/cannon';
// import * as THREE from 'three';

// // ===========================================================================
// // ১. টেক্সচার জেনারেটরস (Ball, Pitch & Goal Net)
// // ===========================================================================
// function useGameTextures() {
//   return useMemo(() => {
//     // Football Texture
//     const ballCanvas = document.createElement('canvas');
//     ballCanvas.width = 1024;
//     ballCanvas.height = 512;
//     const bCtx = ballCanvas.getContext('2d')!;
//     bCtx.fillStyle = '#ffffff';
//     bCtx.fillRect(0, 0, 1024, 512);
//     bCtx.fillStyle = '#111111';
//     for (let x = 0; x < 1024; x += 128) {
//       for (let y = 0; y < 512; y += 128) {
//         if ((x / 128 + y / 128) % 2 === 0) {
//           bCtx.beginPath();
//           bCtx.arc(x + 64, y + 64, 28, 0, Math.PI * 2);
//           bCtx.fill();
//         }
//       }
//     }
//     const ballTexture = new THREE.CanvasTexture(ballCanvas);

//     // Pitch Texture
//     const pitchCanvas = document.createElement('canvas');
//     pitchCanvas.width = 1024;
//     pitchCanvas.height = 1024;
//     const pCtx = pitchCanvas.getContext('2d')!;
//     pCtx.fillStyle = '#1b5e20';
//     pCtx.fillRect(0, 0, 1024, 1024);
//     pCtx.fillStyle = '#2e7d32';
//     for (let i = 0; i < 1024; i += 64) {
//       pCtx.fillRect(0, i, 1024, 32);
//     }
//     pCtx.strokeStyle = '#ffffff';
//     pCtx.lineWidth = 12;
//     pCtx.strokeRect(128, 0, 768, 512);
//     pCtx.fillStyle = '#ffffff';
//     pCtx.beginPath();
//     pCtx.arc(512, 768, 10, 0, Math.PI * 2);
//     pCtx.fill();
//     const pitchTexture = new THREE.CanvasTexture(pitchCanvas);

//     // Net Texture
//     const netCanvas = document.createElement('canvas');
//     netCanvas.width = 64;
//     netCanvas.height = 64;
//     const nCtx = netCanvas.getContext('2d')!;
//     nCtx.clearRect(0, 0, 64, 64);
//     nCtx.strokeStyle = '#ffffff';
//     nCtx.lineWidth = 3;
//     nCtx.strokeRect(0, 0, 64, 64);

//     const netTexture = new THREE.CanvasTexture(netCanvas);
//     netTexture.wrapS = THREE.RepeatWrapping;
//     netTexture.wrapT = THREE.RepeatWrapping;
//     netTexture.repeat.set(16, 8);

//     return { ballTexture, pitchTexture, netTexture };
//   }, []);
// }

// // ===========================================================================
// // ২. মাঠ ও গোলপোস্ট কম্পোনেন্টস
// // ===========================================================================
// function Pitch() {
//   const { pitchTexture } = useGameTextures();
//   const [ref] = usePlane(() => ({
//     rotation: [-Math.PI / 2, 0, 0],
//     position: [0, 0, 0],
//     material: { friction: 0.3, restitution: 0.6 }
//   }));

//   return (
//     <mesh ref={ref as any} receiveShadow>
//       <planeGeometry args={[50, 50]} />
//       <meshStandardMaterial map={pitchTexture} roughness={0.8} />
//     </mesh>
//   );
// }

// function Post({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
//   const [ref] = useBox(() => ({
//     type: 'Static',
//     position,
//     args: size,
//     material: { friction: 0.3, restitution: 0.6 }
//   }));

//   return (
//     <mesh ref={ref as any} castShadow position={position}>
//       <boxGeometry args={size} />
//       <meshStandardMaterial color="#ffffff" roughness={0.2} />
//     </mesh>
//   );
// }

// function GoalStructure() {
//   const { netTexture } = useGameTextures();
//   const goalWidth = 7.32;
//   const goalHeight = 2.44;
//   const goalDepth = 1.5;
//   const goalZ = -14;

//   return (
//     <>
//       {/* Front Posts & Crossbar */}
//       <Post position={[-goalWidth / 2, goalHeight / 2, goalZ]} size={[0.12, goalHeight, 0.12]} />
//       <Post position={[goalWidth / 2, goalHeight / 2, goalZ]} size={[0.12, goalHeight, 0.12]} />
//       <Post position={[0, goalHeight, goalZ]} size={[goalWidth + 0.12, 0.12, 0.12]} />

//       {/* Physics Collider Behind Net (Invisible) */}
//       <Post position={[0, goalHeight / 2, goalZ - goalDepth]} size={[goalWidth, goalHeight, 0.1]} />

//       {/* Transparent Net Mesh */}
//       <group position={[0, goalHeight / 2, goalZ - goalDepth / 2]}>
//         <mesh position={[0, 0, -goalDepth / 2]}>
//           <planeGeometry args={[goalWidth, goalHeight]} />
//           <meshBasicMaterial map={netTexture} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
//         </mesh>
//         <mesh position={[0, goalHeight / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
//           <planeGeometry args={[goalWidth, goalDepth]} />
//           <meshBasicMaterial map={netTexture} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
//         </mesh>
//         <mesh position={[-goalWidth / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
//           <planeGeometry args={[goalDepth, goalHeight]} />
//           <meshBasicMaterial map={netTexture} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
//         </mesh>
//         <mesh position={[goalWidth / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
//           <planeGeometry args={[goalDepth, goalHeight]} />
//           <meshBasicMaterial map={netTexture} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
//         </mesh>
//       </group>
//     </>
//   );
// }

// // ===========================================================================
// // ৩. ধূমকেতু ট্রেইল (Comet Trail Effect)
// // ===========================================================================
// function BallCometTrail({
//   ballPosRef,
//   isKicked,
//   isReplaying
// }: {
//   ballPosRef: React.MutableRefObject<THREE.Vector3>;
//   isKicked: boolean;
//   isReplaying: boolean;
// }) {
//   const trailCount = 15;
//   const meshRefs = useRef<THREE.Mesh[]>([]);
//   const historyRef = useRef<THREE.Vector3[]>([]);

//   useFrame(() => {
//     if (isKicked || isReplaying) {
//       const currentPos = ballPosRef.current.clone();
//       historyRef.current.unshift(currentPos);

//       if (historyRef.current.length > trailCount) {
//         historyRef.current.pop();
//       }

//       meshRefs.current.forEach((mesh, index) => {
//         if (mesh && historyRef.current[index]) {
//           const pos = historyRef.current[index];
//           mesh.position.copy(pos);
//           const scale = (1 - index / trailCount) * 0.35;
//           mesh.scale.set(scale, scale, scale);
//           (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - index / trailCount) * 0.6;
//         }
//       });
//     } else {
//       historyRef.current = [];
//       meshRefs.current.forEach((mesh) => {
//         if (mesh) mesh.scale.set(0, 0, 0);
//       });
//     }
//   });

//   return (
//     <group>
//       {Array.from({ length: trailCount }).map((_, i) => (
//         <mesh
//           key={i}
//           ref={(el) => {
//             if (el) meshRefs.current[i] = el;
//           }}
//         >
//           <sphereGeometry args={[0.35, 16, 16]} />
//           <meshBasicMaterial color="#00e5ff" transparent opacity={0} />
//         </mesh>
//       ))}
//     </group>
//   );
// }

// // ===========================================================================
// // ৪. ফুটবল ও গোলকিপার কম্পোনেন্টস
// // ===========================================================================
// interface BallProps {
//   isKicked: boolean;
//   isReplaying: boolean;
//   ballPosRef: React.MutableRefObject<THREE.Vector3>;
//   ballApiRef: React.MutableRefObject<any>;
// }

// function Ball({ isKicked, isReplaying, ballPosRef, ballApiRef }: BallProps) {
//   const { ballTexture } = useGameTextures();
//   const ballRadius = 0.35;
//   const meshRef = useRef<THREE.Mesh>(null);

//   const [ref, api] = useSphere(() => ({
//     mass: 0.45,
//     position: [0, ballRadius, 0],
//     args: [ballRadius],
//     material: { friction: 0.3, restitution: 0.6 }
//   }));

//   ballApiRef.current = api;

//   useEffect(() => {
//     const unsubscribe = api.position.subscribe((p) => {
//       if (!isReplaying) {
//         ballPosRef.current.set(p[0], p[1], p[2]);
//       }
//     });
//     return unsubscribe;
//   }, [api, isReplaying]);

//   useFrame(() => {
//     if (meshRef.current) {
//       meshRef.current.position.copy(ballPosRef.current);
//     }
//   });

//   return (
//     <group>
//       <mesh ref={meshRef} castShadow>
//         <sphereGeometry args={[ballRadius, 32, 32]} />
//         <meshStandardMaterial map={ballTexture} roughness={0.4} metalness={0.1} />
//       </mesh>
//       <BallCometTrail ballPosRef={ballPosRef} isKicked={isKicked} isReplaying={isReplaying} />
//     </group>
//   );
// }

// function Goalkeeper({ keeperApiRef }: { keeperApiRef: React.MutableRefObject<any> }) {
//   const goalZ = -14;
//   const [ref, api] = useBox(() => ({
//     mass: 0,
//     position: [0, 0.9, goalZ + 0.2],
//     args: [1, 1.8, 0.4],
//     material: { friction: 0.3, restitution: 0.6 }
//   }));

//   keeperApiRef.current = api;

//   return (
//     <group ref={ref as any}>
//       <mesh position={[0, 0, 0]} castShadow>
//         <boxGeometry args={[0.7, 1.0, 0.3]} />
//         <meshStandardMaterial color="#e65100" />
//       </mesh>
//       <mesh position={[0, 0.7, 0]} castShadow>
//         <sphereGeometry args={[0.2, 16, 16]} />
//         <meshStandardMaterial color="#ffcc80" />
//       </mesh>
//     </group>
//   );
// }

// // ===========================================================================
// // ৫. ক্যামেরা লুপ (Live Fixed & Replay Dynamic Follow with Reset)
// // ===========================================================================
// function CameraController({
//   isReplaying,
//   ballPosRef
// }: {
//   isReplaying: boolean;
//   ballPosRef: React.MutableRefObject<THREE.Vector3>;
// }) {
//   const { camera } = useThree();
//   const goalZ = -14;

//   useFrame(() => {
//     if (isReplaying) {
//       const pos = ballPosRef.current;
//       camera.position.x = THREE.MathUtils.lerp(camera.position.x, pos.x * 0.6 + 2, 0.08);
//       camera.position.y = THREE.MathUtils.lerp(camera.position.y, pos.y + 1.5, 0.08);
//       camera.position.z = THREE.MathUtils.lerp(camera.position.z, pos.z + 5.0, 0.08);
//       camera.lookAt(pos.x, pos.y, pos.z);
//     } else {
//       // Smoothly and strictly return camera to live fixed position
//       camera.position.lerp(new THREE.Vector3(0, 1.8, 4.5), 0.15);
//       camera.lookAt(0, 1, goalZ);
//     }
//   });

//   return null;
// }

// // ===========================================================================
// // ৬. মেইন গেম কম্পোনেন্ট (UI + Game Handlers)
// // ===========================================================================
// export default function PenaltyGame() {
//   const [score, setScore] = useState(0);
//   const [shotsLeft, setShotsLeft] = useState(5);
//   const [statusText, setStatusText] = useState('READY TO SHOOT');
//   const [statusColor, setStatusColor] = useState('#d4af37');
//   const [isKicked, setIsKicked] = useState(false);
//   const [isGameOver, setIsGameOver] = useState(false);
//   const [showReplayBtn, setShowReplayBtn] = useState(false);
//   const [isReplaying, setIsReplaying] = useState(false);

//   const ballPosRef = useRef(new THREE.Vector3(0, 0.35, 0));
//   const ballApiRef = useRef<any>(null);
//   const keeperApiRef = useRef<any>(null);

//   const trajectoryHistory = useRef<THREE.Vector3[]>([]);

//   const startPos = useRef({ x: 0, y: 0 });
//   const startTime = useRef(0);
//   const isDragging = useRef(false);

//   // Shoot Mechanics
//   const handleStart = (clientX: number, clientY: number) => {
//     if (isKicked || shotsLeft <= 0 || isGameOver || isReplaying) return;
//     isDragging.current = true;
//     startPos.current = { x: clientX, y: clientY };
//     startTime.current = performance.now();
//   };

//   const handleEnd = (clientX: number, clientY: number) => {
//     if (!isDragging.current || isKicked || isGameOver || isReplaying) return;
//     isDragging.current = false;

//     const deltaX = clientX - startPos.current.x;
//     const deltaY = clientY - startPos.current.y;
//     const duration = Math.max((performance.now() - startTime.current) / 1000, 0.05);

//     if (deltaY > -20) return;

//     const absDeltaY = Math.abs(deltaY);
//     const speed = Math.min(absDeltaY / duration, 1500);

//     const forceZ = -Math.min(speed * 0.025, 28);
//     const forceY = Math.min(absDeltaY * 0.035, 12);
//     const forceX = deltaX * 0.035;

//     trajectoryHistory.current = [];

//     if (ballApiRef.current) {
//       ballApiRef.current.applyImpulse([forceX, forceY, forceZ], [0, 0, 0]);
//       ballApiRef.current.angularVelocity.set(0, -deltaX * 0.05, deltaX * 0.02);
//     }

//     setIsKicked(true);
//     const remainingShots = shotsLeft - 1;
//     setShotsLeft(remainingShots);

//     const tracker = setInterval(() => {
//       trajectoryHistory.current.push(ballPosRef.current.clone());
//     }, 30);

//     setTimeout(() => {
//       if (keeperApiRef.current) {
//         keeperApiRef.current.mass.set(3);
//         keeperApiRef.current.velocity.set(forceX * 2.1, Math.max(0.5, forceY * 0.4), 0);
//       }
//     }, 120);

//     setTimeout(() => {
//       clearInterval(tracker);
//       checkResult(remainingShots);
//     }, 1400);
//   };

//   const checkResult = (remainingShots: number) => {
//     const goalWidth = 7.32;
//     const goalHeight = 2.44;
//     const goalZ = -14;
//     const pos = ballPosRef.current;

//     const isInsideX = pos.x > -goalWidth / 2 && pos.x < goalWidth / 2;
//     const isInsideY = pos.y > 0 && pos.y < goalHeight;
//     const isPastGoalLine = pos.z < goalZ + 0.5;

//     if (isInsideX && isInsideY && isPastGoalLine) {
//       setScore((prev) => prev + 10);
//       setStatusText('⚽ GOAAAL!');
//       setStatusColor('#2ecc71');
//     } else {
//       setStatusText('❌ SAVED / MISSED!');
//       setStatusColor('#e74c3c');
//     }

//     setTimeout(() => {
//       setShowReplayBtn(true);
//     }, 500);
//   };

//   const triggerReplay = () => {
//     if (trajectoryHistory.current.length === 0) return;

//     setShowReplayBtn(false);
//     setIsReplaying(true);
//     setStatusText('🎬 REPLAY');
//     setStatusColor('#3498db');

//     let idx = 0;
//     const totalFrames = trajectoryHistory.current.length;

//     const interval = setInterval(() => {
//       if (idx < totalFrames) {
//         ballPosRef.current.copy(trajectoryHistory.current[idx]);
//         idx++;
//       } else {
//         clearInterval(interval);
//         setTimeout(() => {
//           setIsReplaying(false);
//           resetRound(shotsLeft);
//         }, 600);
//       }
//     }, 30);
//   };

//   // Complete & Clean Reset Function
//   const resetRound = (remainingShots: number) => {
//     setShowReplayBtn(false);
//     setIsReplaying(false);

//     if (remainingShots <= 0) {
//       setIsGameOver(true);
//       setStatusText('GAME OVER!');
//       setStatusColor('#d4af37');
//       return;
//     }

//     // Reset Ball Position and Zero Physics Velocity Completely
//     ballPosRef.current.set(0, 0.35, 0);
//     if (ballApiRef.current) {
//       ballApiRef.current.position.set(0, 0.35, 0);
//       ballApiRef.current.velocity.set(0, 0, 0);
//       ballApiRef.current.angularVelocity.set(0, 0, 0);
//     }

//     // Reset Goalkeeper
//     if (keeperApiRef.current) {
//       keeperApiRef.current.mass.set(0);
//       keeperApiRef.current.position.set(0, 0.9, -13.8);
//       keeperApiRef.current.velocity.set(0, 0, 0);
//       keeperApiRef.current.angularVelocity.set(0, 0, 0);
//       keeperApiRef.current.rotation.set(0, 0, 0);
//     }

//     setIsKicked(false);
//     setStatusText('READY TO SHOOT');
//     setStatusColor('#d4af37');
//   };

//   const restartGame = () => {
//     setScore(0);
//     setShotsLeft(5);
//     setIsGameOver(false);
//     resetRound(5);
//   };

//   return (
//     <div
//       style={{
//         width: '100vw',
//         height: '100vh',
//         position: 'relative',
//         backgroundColor: '#0c1017',
//         touchAction: 'none',
//         userSelect: 'none'
//       }}
//       onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
//       onMouseUp={(e) => handleEnd(e.clientX, e.clientY)}
//       onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
//       onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
//     >
//       <Canvas
//         shadows
//         camera={{ position: [0, 1.8, 4.5], fov: 60 }}
//         gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
//       >
//         <color attach="background" args={['#0c1017']} />
//         <fog attach="fog" args={['#0c1017', 10, 50]} />

//         <ambientLight intensity={0.6} />
//         <spotLight position={[-15, 20, 10]} intensity={2.5} castShadow shadow-mapSize={[1024, 1024]} />
//         <spotLight position={[15, 20, 10]} intensity={1.5} />

//         <Physics gravity={[0, -9.82, 0]}>
//           <Pitch />
//           <GoalStructure />
//           <Ball
//             isKicked={isKicked}
//             isReplaying={isReplaying}
//             ballPosRef={ballPosRef}
//             ballApiRef={ballApiRef}
//           />
//           <Goalkeeper keeperApiRef={keeperApiRef} />
//         </Physics>

//         <CameraController isReplaying={isReplaying} ballPosRef={ballPosRef} />
//       </Canvas>

//       {/* UI Overlay */}
//       <div
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           pointerEvents: 'none',
//           padding: '16px',
//           paddingTop: 'calc(env(safe-area-inset-top, 10px) + 65px)',
//           boxSizing: 'border-box',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'space-between',
//           fontFamily: "'Segoe UI', Roboto, sans-serif"
//         }}
//       >
//         {/* Scorecard */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//           <div
//             style={{
//               background: 'rgba(15, 15, 15, 0.75)',
//               backdropFilter: 'blur(10px)',
//               border: '1px solid rgba(212, 175, 55, 0.4)',
//               borderRadius: '12px',
//               padding: '8px 16px',
//               color: '#fff'
//             }}
//           >
//             <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#d4af37', fontWeight: 700 }}>
//               Score
//             </div>
//             <div style={{ fontSize: '24px', fontWeight: 900 }}>{score < 10 ? `0${score}` : score}</div>
//           </div>

//           <div
//             style={{
//               background: 'rgba(15, 15, 15, 0.75)',
//               backdropFilter: 'blur(10px)',
//               border: '1px solid rgba(212, 175, 55, 0.4)',
//               borderRadius: '12px',
//               padding: '8px 16px',
//               color: '#fff',
//               textAlign: 'right'
//             }}
//           >
//             <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#d4af37', fontWeight: 700 }}>
//               Shots Left
//             </div>
//             <div style={{ fontSize: '24px', fontWeight: 900 }}>{shotsLeft < 10 ? `0${shotsLeft}` : shotsLeft}</div>
//           </div>
//         </div>

//         {/* Center UI */}
//         <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//           <div
//             style={{
//               fontSize: '22px',
//               fontWeight: 900,
//               textTransform: 'uppercase',
//               letterSpacing: '2px',
//               color: statusColor,
//               textShadow: '0 0 15px rgba(212, 175, 55, 0.6), 0 2px 4px #000'
//             }}
//           >
//             {statusText}
//           </div>

//           {showReplayBtn && !isGameOver && (
//             <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
//               <button
//                 onClick={triggerReplay}
//                 style={{
//                   pointerEvents: 'auto',
//                   padding: '10px 24px',
//                   fontSize: '14px',
//                   fontWeight: 800,
//                   textTransform: 'uppercase',
//                   letterSpacing: '1.5px',
//                   color: '#fff',
//                   background: 'linear-gradient(135deg, #2980b9, #3498db)',
//                   border: 'none',
//                   borderRadius: '30px',
//                   boxShadow: '0 0 15px rgba(52, 152, 219, 0.6)',
//                   cursor: 'pointer'
//                 }}
//               >
//                 🔄 REPLAY
//               </button>

//               <button
//                 onClick={() => resetRound(shotsLeft)}
//                 style={{
//                   pointerEvents: 'auto',
//                   padding: '10px 24px',
//                   fontSize: '14px',
//                   fontWeight: 800,
//                   textTransform: 'uppercase',
//                   letterSpacing: '1.5px',
//                   color: '#000',
//                   background: 'linear-gradient(135deg, #d4af37, #f9d976)',
//                   border: 'none',
//                   borderRadius: '30px',
//                   boxShadow: '0 0 15px rgba(212, 175, 55, 0.6)',
//                   cursor: 'pointer'
//                 }}
//               >
//                 NEXT SHOT ➔
//               </button>
//             </div>
//           )}

//           {isGameOver && (
//             <button
//               onClick={restartGame}
//               style={{
//                 pointerEvents: 'auto',
//                 marginTop: '20px',
//                 padding: '12px 32px',
//                 fontSize: '16px',
//                 fontWeight: 800,
//                 textTransform: 'uppercase',
//                 letterSpacing: '1.5px',
//                 color: '#000',
//                 background: 'linear-gradient(135deg, #d4af37, #f9d976)',
//                 border: 'none',
//                 borderRadius: '30px',
//                 boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)',
//                 cursor: 'pointer'
//               }}
//             >
//               PLAY AGAIN
//             </button>
//           )}
//         </div>

//         <div style={{ height: '20px' }} />
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, useSphere, usePlane, useBox } from '@react-three/cannon';
import * as THREE from 'three';

// ===========================================================================
// ১. সাউন্ড ইঞ্জিন (Web Audio API Synthesizer)
// External audio file ছাড়াই কোড দিয়ে সাউন্ড তৈরি
// ===========================================================================
class SoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // কিক সাউন্ড
  playKick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // গোল সাউন্ড (Crowd Cheer)
  playGoal() {
    this.init();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + 2);
  }

  // সেভ / মিস সাউন্ড
  playMiss() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }
}

const audioEngine = new SoundEngine();

// ===========================================================================
// ২. টেক্সচার জেনারেটরস Engine
// ===========================================================================
function useGameTextures() {
  return useMemo(() => {
    // Football Texture
    const ballCanvas = document.createElement('canvas');
    ballCanvas.width = 1024;
    ballCanvas.height = 512;
    const bCtx = ballCanvas.getContext('2d')!;
    bCtx.fillStyle = '#ffffff';
    bCtx.fillRect(0, 0, 1024, 512);
    bCtx.fillStyle = '#111111';
    for (let x = 0; x < 1024; x += 128) {
      for (let y = 0; y < 512; y += 128) {
        if ((x / 128 + y / 128) % 2 === 0) {
          bCtx.beginPath();
          bCtx.arc(x + 64, y + 64, 28, 0, Math.PI * 2);
          bCtx.fill();
        }
      }
    }
    const ballTexture = new THREE.CanvasTexture(ballCanvas);

    // Pitch Texture
    const pitchCanvas = document.createElement('canvas');
    pitchCanvas.width = 1024;
    pitchCanvas.height = 1024;
    const pCtx = pitchCanvas.getContext('2d')!;
    pCtx.fillStyle = '#1b5e20';
    pCtx.fillRect(0, 0, 1024, 1024);
    pCtx.fillStyle = '#2e7d32';
    for (let i = 0; i < 1024; i += 64) {
      pCtx.fillRect(0, i, 1024, 32);
    }
    pCtx.strokeStyle = '#ffffff';
    pCtx.lineWidth = 12;
    pCtx.strokeRect(128, 0, 768, 512);
    pCtx.fillStyle = '#ffffff';
    pCtx.beginPath();
    pCtx.arc(512, 768, 10, 0, Math.PI * 2);
    pCtx.fill();
    const pitchTexture = new THREE.CanvasTexture(pitchCanvas);

    // Net Texture
    const netCanvas = document.createElement('canvas');
    netCanvas.width = 64;
    netCanvas.height = 64;
    const nCtx = netCanvas.getContext('2d')!;
    nCtx.clearRect(0, 0, 64, 64);
    nCtx.strokeStyle = '#ffffff';
    nCtx.lineWidth = 3;
    nCtx.strokeRect(0, 0, 64, 64);

    const netTexture = new THREE.CanvasTexture(netCanvas);
    netTexture.wrapS = THREE.RepeatWrapping;
    netTexture.wrapT = THREE.RepeatWrapping;
    netTexture.repeat.set(16, 8);

    return { ballTexture, pitchTexture, netTexture };
  }, []);
}

// ===========================================================================
// ৩. ৩ডি স্টেডিয়াম ইঞ্জিন (3D Stadium & Floodlights)
// ===========================================================================
function StadiumEngine() {
  return (
    <group>
      {/* Stadium Walls / Stands */}
      <mesh position={[0, 8, -25]}>
        <boxGeometry args={[60, 16, 4]} />
        <meshStandardMaterial color="#1e272e" />
      </mesh>
      <mesh position={[-28, 8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[60, 16, 4]} />
        <meshStandardMaterial color="#1e272e" />
      </mesh>
      <mesh position={[28, 8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[60, 16, 4]} />
        <meshStandardMaterial color="#1e272e" />
      </mesh>

      {/* Light Towers */}
      {[-20, 20].map((x, i) => (
        <group key={i} position={[x, 15, -20]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.5, 18, 16]} />
            <meshStandardMaterial color="#718093" metalness={0.8} />
          </mesh>
          <mesh position={[0, 9, 0]}>
            <boxGeometry args={[4, 2, 0.5]} />
            <meshStandardMaterial color="#dcdde1" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ===========================================================================
// ৪. মাঠ ও গোলপোস্ট কম্পোনেন্টস
// ===========================================================================
function Pitch() {
  const { pitchTexture } = useGameTextures();
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: { friction: 0.3, restitution: 0.6 }
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial map={pitchTexture} roughness={0.8} />
    </mesh>
  );
}

function Post({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: size,
    material: { friction: 0.3, restitution: 0.6 }
  }));

  return (
    <mesh ref={ref as any} castShadow position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#ffffff" roughness={0.2} />
    </mesh>
  );
}

function GoalStructure() {
  const { netTexture } = useGameTextures();
  const goalWidth = 7.32;
  const goalHeight = 2.44;
  const goalDepth = 1.5;
  const goalZ = -14;

  return (
    <>
      <Post position={[-goalWidth / 2, goalHeight / 2, goalZ]} size={[0.12, goalHeight, 0.12]} />
      <Post position={[goalWidth / 2, goalHeight / 2, goalZ]} size={[0.12, goalHeight, 0.12]} />
      <Post position={[0, goalHeight, goalZ]} size={[goalWidth + 0.12, 0.12, 0.12]} />
      <Post position={[0, goalHeight / 2, goalZ - goalDepth]} size={[goalWidth, goalHeight, 0.1]} />

      <group position={[0, goalHeight / 2, goalZ - goalDepth / 2]}>
        <mesh position={[0, 0, -goalDepth / 2]}>
          <planeGeometry args={[goalWidth, goalHeight]} />
          <meshBasicMaterial map={netTexture} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh position={[0, goalHeight / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[goalWidth, goalDepth]} />
          <meshBasicMaterial map={netTexture} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh position={[-goalWidth / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[goalDepth, goalHeight]} />
          <meshBasicMaterial map={netTexture} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh position={[goalWidth / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[goalDepth, goalHeight]} />
          <meshBasicMaterial map={netTexture} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

// ===========================================================================
// ৫. ধূমকেতু ট্রেইল (Comet Trail Effect)
// ===========================================================================
function BallCometTrail({
  ballPosRef,
  isKicked,
  isReplaying
}: {
  ballPosRef: React.MutableRefObject<THREE.Vector3>;
  isKicked: boolean;
  isReplaying: boolean;
}) {
  const trailCount = 15;
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const historyRef = useRef<THREE.Vector3[]>([]);

  useFrame(() => {
    if (isKicked || isReplaying) {
      const currentPos = ballPosRef.current.clone();
      historyRef.current.unshift(currentPos);

      if (historyRef.current.length > trailCount) {
        historyRef.current.pop();
      }

      meshRefs.current.forEach((mesh, index) => {
        if (mesh && historyRef.current[index]) {
          const pos = historyRef.current[index];
          mesh.position.copy(pos);
          const scale = (1 - index / trailCount) * 0.35;
          mesh.scale.set(scale, scale, scale);
          (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - index / trailCount) * 0.6;
        }
      });
    } else {
      historyRef.current = [];
      meshRefs.current.forEach((mesh) => {
        if (mesh) mesh.scale.set(0, 0, 0);
      });
    }
  });

  return (
    <group>
      {Array.from({ length: trailCount }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

// ===========================================================================
// ৬. ফুটবল ও গোলকিপার
// ===========================================================================
interface BallProps {
  isKicked: boolean;
  isReplaying: boolean;
  ballPosRef: React.MutableRefObject<THREE.Vector3>;
  ballApiRef: React.MutableRefObject<any>;
}

function Ball({ isKicked, isReplaying, ballPosRef, ballApiRef }: BallProps) {
  const { ballTexture } = useGameTextures();
  const ballRadius = 0.35;
  const meshRef = useRef<THREE.Mesh>(null);

  const [ref, api] = useSphere(() => ({
    mass: 0.45,
    position: [0, ballRadius, 0],
    args: [ballRadius],
    material: { friction: 0.3, restitution: 0.6 }
  }));

  ballApiRef.current = api;

  useEffect(() => {
    const unsubscribe = api.position.subscribe((p) => {
      if (!isReplaying) {
        ballPosRef.current.set(p[0], p[1], p[2]);
      }
    });
    return unsubscribe;
  }, [api, isReplaying]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(ballPosRef.current);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[ballRadius, 32, 32]} />
        <meshStandardMaterial map={ballTexture} roughness={0.4} metalness={0.1} />
      </mesh>
      <BallCometTrail ballPosRef={ballPosRef} isKicked={isKicked} isReplaying={isReplaying} />
    </group>
  );
}

function Goalkeeper({ keeperApiRef }: { keeperApiRef: React.MutableRefObject<any> }) {
  const goalZ = -14;
  const [ref, api] = useBox(() => ({
    mass: 0,
    position: [0, 0.9, goalZ + 0.2],
    args: [1, 1.8, 0.4],
    material: { friction: 0.3, restitution: 0.6 }
  }));

  keeperApiRef.current = api;

  return (
    <group ref={ref as any}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 1.0, 0.3]} />
        <meshStandardMaterial color="#e65100" />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffcc80" />
      </mesh>
    </group>
  );
}

// ===========================================================================
// ৭. ক্যামেরা কন্ট্রোলার Engine
// ===========================================================================
function CameraController({
  isReplaying,
  ballPosRef
}: {
  isReplaying: boolean;
  ballPosRef: React.MutableRefObject<THREE.Vector3>;
}) {
  const { camera } = useThree();
  const goalZ = -14;

  useFrame(() => {
    if (isReplaying) {
      const pos = ballPosRef.current;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pos.x * 0.6 + 2, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, pos.y + 1.5, 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, pos.z + 5.0, 0.08);
      camera.lookAt(pos.x, pos.y, pos.z);
    } else {
      camera.position.lerp(new THREE.Vector3(0, 1.8, 4.5), 0.15);
      camera.lookAt(0, 1, goalZ);
    }
  });

  return null;
}

// ===========================================================================
// ৮. মেইন পেনাল্টি গেম ইঞ্জিন (Penalty Engine Layer)
// ===========================================================================
export default function PenaltyGameEngine() {
  const [score, setScore] = useState(0);
  const [shotsLeft, setShotsLeft] = useState(5);
  const [statusText, setStatusText] = useState('READY TO SHOOT');
  const [statusColor, setStatusColor] = useState('#d4af37');
  const [isKicked, setIsKicked] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showReplayBtn, setShowReplayBtn] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);

  const ballPosRef = useRef(new THREE.Vector3(0, 0.35, 0));
  const ballApiRef = useRef<any>(null);
  const keeperApiRef = useRef<any>(null);

  const trajectoryHistory = useRef<THREE.Vector3[]>([]);

  const startPos = useRef({ x: 0, y: 0 });
  const startTime = useRef(0);
  const isDragging = useRef(false);

  // Kick Logic & Sound Implementation
  const handleStart = (clientX: number, clientY: number) => {
    if (isKicked || shotsLeft <= 0 || isGameOver || isReplaying) return;
    isDragging.current = true;
    startPos.current = { x: clientX, y: clientY };
    startTime.current = performance.now();
  };

  const handleEnd = (clientX: number, clientY: number) => {
    if (!isDragging.current || isKicked || isGameOver || isReplaying) return;
    isDragging.current = false;

    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    const duration = Math.max((performance.now() - startTime.current) / 1000, 0.05);

    if (deltaY > -20) return;

    const absDeltaY = Math.abs(deltaY);
    const speed = Math.min(absDeltaY / duration, 1500);

    const forceZ = -Math.min(speed * 0.025, 28);
    const forceY = Math.min(absDeltaY * 0.035, 12);
    const forceX = deltaX * 0.035;

    trajectoryHistory.current = [];

    if (ballApiRef.current) {
      ballApiRef.current.applyImpulse([forceX, forceY, forceZ], [0, 0, 0]);
      ballApiRef.current.angularVelocity.set(0, -deltaX * 0.05, deltaX * 0.02);
    }

    // Play Kick Sound Sound Effect
    audioEngine.playKick();

    setIsKicked(true);
    const remainingShots = shotsLeft - 1;
    setShotsLeft(remainingShots);

    const tracker = setInterval(() => {
      trajectoryHistory.current.push(ballPosRef.current.clone());
    }, 30);

    setTimeout(() => {
      if (keeperApiRef.current) {
        keeperApiRef.current.mass.set(3);
        keeperApiRef.current.velocity.set(forceX * 2.1, Math.max(0.5, forceY * 0.4), 0);
      }
    }, 120);

    setTimeout(() => {
      clearInterval(tracker);
      checkResult(remainingShots);
    }, 1400);
  };

  const checkResult = (remainingShots: number) => {
    const goalWidth = 7.32;
    const goalHeight = 2.44;
    const goalZ = -14;
    const pos = ballPosRef.current;

    const isInsideX = pos.x > -goalWidth / 2 && pos.x < goalWidth / 2;
    const isInsideY = pos.y > 0 && pos.y < goalHeight;
    const isPastGoalLine = pos.z < goalZ + 0.5;

    if (isInsideX && isInsideY && isPastGoalLine) {
      setScore((prev) => prev + 10);
      setStatusText('⚽ GOAAAL!');
      setStatusColor('#2ecc71');
      audioEngine.playGoal(); // Goal Sound
    } else {
      setStatusText('❌ SAVED / MISSED!');
      setStatusColor('#e74c3c');
      audioEngine.playMiss(); // Miss Sound
    }

    setTimeout(() => {
      setShowReplayBtn(true);
    }, 500);
  };

  const triggerReplay = () => {
    if (trajectoryHistory.current.length === 0) return;

    setShowReplayBtn(false);
    setIsReplaying(true);
    setStatusText('🎬 REPLAY');
    setStatusColor('#3498db');

    let idx = 0;
    const totalFrames = trajectoryHistory.current.length;

    const interval = setInterval(() => {
      if (idx < totalFrames) {
        ballPosRef.current.copy(trajectoryHistory.current[idx]);
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsReplaying(false);
          resetRound(shotsLeft);
        }, 600);
      }
    }, 30);
  };

  const resetRound = (remainingShots: number) => {
    setShowReplayBtn(false);
    setIsReplaying(false);

    if (remainingShots <= 0) {
      setIsGameOver(true);
      setStatusText('GAME OVER!');
      setStatusColor('#d4af37');
      return;
    }

    ballPosRef.current.set(0, 0.35, 0);
    if (ballApiRef.current) {
      ballApiRef.current.position.set(0, 0.35, 0);
      ballApiRef.current.velocity.set(0, 0, 0);
      ballApiRef.current.angularVelocity.set(0, 0, 0);
    }

    if (keeperApiRef.current) {
      keeperApiRef.current.mass.set(0);
      keeperApiRef.current.position.set(0, 0.9, -13.8);
      keeperApiRef.current.velocity.set(0, 0, 0);
      keeperApiRef.current.angularVelocity.set(0, 0, 0);
      keeperApiRef.current.rotation.set(0, 0, 0);
    }

    setIsKicked(false);
    setStatusText('READY TO SHOOT');
    setStatusColor('#d4af37');
  };

  const restartGame = () => {
    setScore(0);
    setShotsLeft(5);
    setIsGameOver(false);
    resetRound(5);
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        backgroundColor: '#0c1017',
        touchAction: 'none',
        userSelect: 'none'
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseUp={(e) => handleEnd(e.clientX, e.clientY)}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
    >
      <Canvas
        shadows
        camera={{ position: [0, 1.8, 4.5], fov: 60 }}
        gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={['#050811']} />
        <fog attach="fog" args={['#050811', 15, 60]} />

        <ambientLight intensity={0.4} />
        <spotLight position={[-15, 20, 10]} intensity={2.5} castShadow shadow-mapSize={[1024, 1024]} />
        <spotLight position={[15, 20, 10]} intensity={1.5} />

        <Physics gravity={[0, -9.82, 0]}>
          <Pitch />
          <StadiumEngine />
          <GoalStructure />
          <Ball
            isKicked={isKicked}
            isReplaying={isReplaying}
            ballPosRef={ballPosRef}
            ballApiRef={ballApiRef}
          />
          <Goalkeeper keeperApiRef={keeperApiRef} />
        </Physics>

        <CameraController isReplaying={isReplaying} ballPosRef={ballPosRef} />
      </Canvas>

      {/* UI Overlay Engine Layer */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          padding: '16px',
          paddingTop: 'calc(env(safe-area-inset-top, 10px) + 20px)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: "'Segoe UI', Roboto, sans-serif"
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div
            style={{
              background: 'rgba(15, 15, 15, 0.75)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '12px',
              padding: '8px 16px',
              color: '#fff'
            }}
          >
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#d4af37', fontWeight: 700 }}>
              Score
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900 }}>{score < 10 ? `0${score}` : score}</div>
          </div>

          <div
            style={{
              background: 'rgba(15, 15, 15, 0.75)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '12px',
              padding: '8px 16px',
              color: '#fff',
              textAlign: 'right'
            }}
          >
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#d4af37', fontWeight: 700 }}>
              Shots Left
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900 }}>{shotsLeft < 10 ? `0${shotsLeft}` : shotsLeft}</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: statusColor,
              textShadow: '0 0 15px rgba(212, 175, 55, 0.6), 0 2px 4px #000'
            }}
          >
            {statusText}
          </div>

          {showReplayBtn && !isGameOver && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                onClick={triggerReplay}
                style={{
                  pointerEvents: 'auto',
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #2980b9, #3498db)',
                  border: 'none',
                  borderRadius: '30px',
                  boxShadow: '0 0 15px rgba(52, 152, 219, 0.6)',
                  cursor: 'pointer'
                }}
              >
                🔄 REPLAY
              </button>

              <button
                onClick={() => resetRound(shotsLeft)}
                style={{
                  pointerEvents: 'auto',
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: '#000',
                  background: 'linear-gradient(135deg, #d4af37, #f9d976)',
                  border: 'none',
                  borderRadius: '30px',
                  boxShadow: '0 0 15px rgba(212, 175, 55, 0.6)',
                  cursor: 'pointer'
                }}
              >
                NEXT SHOT ➔
              </button>
            </div>
          )}

          {isGameOver && (
            <button
              onClick={restartGame}
              style={{
                pointerEvents: 'auto',
                marginTop: '20px',
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: '#000',
                background: 'linear-gradient(135deg, #d4af37, #f9d976)',
                border: 'none',
                borderRadius: '30px',
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)',
                cursor: 'pointer'
              }}
            >
              PLAY AGAIN
            </button>
          )}
        </div>

        <div style={{ height: '20px' }} />
      </div>
    </div>
  );
}