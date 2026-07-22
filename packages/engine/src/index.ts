// Core Engine Entry Point
export { GameEngine, type EngineCallback } from './GameEngine';

// Core Modules & Utilities
export { Vector3D, Vector3Utils } from './core/Vector3';
export { InputParser, type SwipeData, type ShotResult } from './core/InputParser';
export { EventSystem, type GameEventType, type EventCallback } from './core/EventSystem';
export { PhysicsEngine } from './core/Physics';
export { Ball } from './core/Ball';
export { Goalkeeper } from './core/Player';
export { MatchManager } from './core/Match';
export { ReplaySystem } from './core/Replay';
export * from './core/types';