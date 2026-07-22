import * as THREE from 'three';
import { GameEngine } from '@football/engine';

export class ThreeRenderer {
  private container: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private ballMesh!: THREE.Mesh;
  private keeperMesh!: THREE.Group;
  private animFrameId: number | null = null;
  private lastTime: number = performance.now();

  constructor(container: HTMLDivElement) {
    this.container = container;

    // 1. Scene & Skybox Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e17);
    this.scene.fog = new THREE.FogExp2(0x0a0e17, 0.015);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.8, 5);

    // WebGL Renderer with Shadow & Tone Mapping
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.appendChild(this.renderer.domElement);

    // 2. Lighting & Stadium Lights
    this.setupLighting();

    // 3. World Setup (Pitch, Goal, Ball, Keeper)
    this.createPitch();
    this.createGoal();
    this.createBall();
    this.createKeeper();

    window.addEventListener('resize', this.onResize);
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Flood Lights (Stadium Feel)
    const createSpotLight = (x: number, y: number, z: number) => {
      const spot = new THREE.SpotLight(0xffffff, 2.5);
      spot.position.set(x, y, z);
      spot.angle = Math.PI / 4;
      spot.penumbra = 0.5;
      spot.castShadow = true;
      spot.shadow.mapSize.width = 2048;
      spot.shadow.mapSize.height = 2048;
      this.scene.add(spot);
    };

    createSpotLight(15, 25, 10);
    createSpotLight(-15, 25, 10);
  }

  private createPitch(): void {
    // Pitch Geometry & Stripes Effect
    const pitchGeo = new THREE.PlaneGeometry(80, 80);
    const pitchMat = new THREE.MeshStandardMaterial({
      color: 0x1e8a37,
      roughness: 0.8,
      metalness: 0.1,
    });

    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    pitch.receiveShadow = true;
    this.scene.add(pitch);

    // Penalty Arc & Lines
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lineGeo = new THREE.PlaneGeometry(0.12, 16.5);

    const penaltyLine = new THREE.Mesh(lineGeo, lineMat);
    penaltyLine.rotation.x = -Math.PI / 2;
    penaltyLine.rotation.z = Math.PI / 2;
    penaltyLine.position.set(0, 0.01, -11);
    this.scene.add(penaltyLine);
  }

  private createGoal(): void {
    const goalGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      roughness: 0.2,
      metalness: 0.8,
    });

    // Posts & Crossbar
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.44, 16);
    const leftPost = new THREE.Mesh(postGeo, frameMat);
    leftPost.position.set(-3.66, 1.22, -14);
    leftPost.castShadow = true;

    const rightPost = new THREE.Mesh(postGeo, frameMat);
    rightPost.position.set(3.66, 1.22, -14);
    rightPost.castShadow = true;

    const barGeo = new THREE.CylinderGeometry(0.08, 0.08, 7.44, 16);
    const crossbar = new THREE.Mesh(barGeo, frameMat);
    crossbar.rotation.z = Math.PI / 2;
    crossbar.position.set(0, 2.44, -14);
    crossbar.castShadow = true;

    goalGroup.add(leftPost, rightPost, crossbar);

    // Goal Net Visual Mesh
    const netGeo = new THREE.BoxGeometry(7.32, 2.44, 1.5);
    const netMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const net = new THREE.Mesh(netGeo, netMat);
    net.position.set(0, 1.22, -14.75);
    goalGroup.add(net);

    this.scene.add(goalGroup);
  }

  private createBall(): void {
    const ballGeo = new THREE.SphereGeometry(0.35, 64, 64);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.1,
    });

    this.ballMesh = new THREE.Mesh(ballGeo, ballMat);
    this.ballMesh.castShadow = true;
    this.scene.add(this.ballMesh);
  }

  private createKeeper(): void {
    this.keeperMesh = new THREE.Group();

    // Body Body/Jersey
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.25, 1.4, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff3d00, roughness: 0.4 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;

    // Head
    const headGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.75;
    head.castShadow = true;

    this.keeperMesh.add(body, head);
    this.scene.add(this.keeperMesh);
  }

  public start(engine: GameEngine): void {
    const renderLoop = (currentTime: number) => {
      const dt = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;

      // 1. Core Engine Step Update
      engine.update(dt);

      // 2. Sync Math Vector Coordinates
      const bPos = engine.ball.position;
      const kPos = engine.keeper.position;

      this.ballMesh.position.set(bPos.x, bPos.y, bPos.z);
      this.keeperMesh.position.set(kPos.x, kPos.y, kPos.z);

      // Ball Rotation Simulation when moving
      if (engine.ball.velocity.z !== 0) {
        this.ballMesh.rotation.x += engine.ball.velocity.z * dt * 2;
        this.ballMesh.rotation.z -= engine.ball.velocity.x * dt * 2;
      }

      // Smooth Camera Smooth Tracking
      const targetCamX = THREE.MathUtils.clamp(bPos.x * 0.25, -2, 2);
      const targetCamY = THREE.MathUtils.clamp(1.8 + bPos.y * 0.1, 1.8, 3.5);
      
      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetCamX, 0.08);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetCamY, 0.08);
      this.camera.lookAt(bPos.x * 0.15, 1.2, -14);

      this.renderer.render(this.scene, this.camera);
      this.animFrameId = requestAnimationFrame(renderLoop);
    };

    this.animFrameId = requestAnimationFrame(renderLoop);
  }

  private onResize = (): void => {
    if (!this.container) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  };

  public destroy(): void {
    window.removeEventListener('resize', this.onResize);
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}