import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei/core/ContactShadows.js";
import { Edges } from "@react-three/drei/core/Edges.js";
import { Float } from "@react-three/drei/core/Float.js";
import { Line } from "@react-three/drei/core/Line.js";
import { OrbitControls } from "@react-three/drei/core/OrbitControls.js";
import { Stars } from "@react-three/drei/core/Stars.js";
import { Html } from "@react-three/drei/web/Html.js";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { challenges } from "../data/challenges";
import { getShapeById } from "../data/shapes";
import { useAppStore } from "../store/useAppStore";
import type { MaterialMode, PartTarget, ShapeId, Vec3 } from "../types";

interface GeometrySceneProps {
  showcase?: boolean;
}

const modeLabels: Record<MaterialMode, string> = {
  solid: "sólido",
  translucent: "translúcido",
  edges: "solo aristas",
  labels: "educativo",
};

export function GeometryScene({ showcase = false }: GeometrySceneProps) {
  const animationsPaused = useAppStore((state) => state.animationsPaused);

  return (
    <div className={showcase ? "scene-wrap scene-wrap-home" : "scene-wrap"} aria-label="Escena 3D interactiva">
      <Canvas
        shadows={!showcase}
        camera={{ position: showcase ? [0, 1.1, 7.4] : [3.3, 2.5, 4], fov: showcase ? 42 : 44 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.55 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onPointerDown={() => useAppStore.getState().markSceneInteraction()}
      >
        <color attach="background" args={["#050817"]} />
        <fog attach="fog" args={["#050817", 7.5, 16.5]} />
        <StudioEnvironment />
        <SceneLights showcase={showcase} />
        <Suspense fallback={<Html center className="scene-loading">Cargando escena 3D...</Html>}>
          <SceneAtmosphere showcase={showcase} />
          {showcase ? <ShowcaseBodies /> : <InteractiveBody />}
          {!showcase && (
            <ContactShadows
              position={[0, -1.36, 0]}
              opacity={0.56}
              scale={7.4}
              blur={3}
              far={4.2}
              color="#0a173f"
            />
          )}
          <Stars radius={28} depth={18} count={showcase ? 300 : 190} factor={1.55} saturation={0} fade speed={animationsPaused ? 0 : 0.22} />
        </Suspense>
        {!showcase && <SceneControls />}
      </Canvas>
      {!showcase && <SceneBadge />}
    </div>
  );
}

function StudioEnvironment() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const room = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(gl);
    const map = generator.fromScene(room).texture;
    scene.environment = map;
    room.dispose();
    generator.dispose();

    return () => {
      if (scene.environment === map) scene.environment = null;
      map.dispose();
    };
  }, [gl, scene]);

  return null;
}

function SceneLights({ showcase }: { showcase: boolean }) {
  return (
    <>
      <ambientLight intensity={showcase ? 0.22 : 0.28} />
      <hemisphereLight args={["#c6f4ff", "#231033", showcase ? 0.38 : 0.48]} />
      <directionalLight
        castShadow={!showcase}
        position={[4.2, 5.4, 3.8]}
        intensity={showcase ? 1.15 : 1.45}
        color="#e9f8ff"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3.4, 2.6, 2.7]} color="#8e7dff" intensity={showcase ? 7 : 9} distance={10} />
      <pointLight position={[2.5, -0.35, -3.3]} color="#50e9ff" intensity={showcase ? 5 : 6.6} distance={8} />
      <pointLight position={[0.2, 2.1, 1.8]} color="#ffd889" intensity={showcase ? 3.8 : 4.8} distance={6.6} />
    </>
  );
}

function SceneAtmosphere({ showcase }: { showcase: boolean }) {
  return (
    <>
      <SparkField count={showcase ? 180 : 130} spread={showcase ? 7.2 : 6.4} />
      <GeometryDais showcase={showcase} />
    </>
  );
}

function SparkField({ count, spread }: { count: number; spread: number }) {
  const points = useRef<THREE.Points>(null);
  const animationsPaused = useAppStore((state) => state.animationsPaused);
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r1 = seeded(i + 1);
      const r2 = seeded(i + 21);
      const r3 = seeded(i + 41);
      data[i * 3] = (r1 - 0.5) * spread;
      data[i * 3 + 1] = (r2 - 0.5) * 3.6 + 0.8;
      data[i * 3 + 2] = (r3 - 0.5) * spread;
    }
    return data;
  }, [count, spread]);

  useFrame(({ clock }) => {
    if (!points.current || animationsPaused) return;
    points.current.rotation.y = clock.elapsedTime * 0.018;
    points.current.rotation.x = Math.sin(clock.elapsedTime * 0.18) * 0.025;
  });

  return (
    <points ref={points} raycast={() => null}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffe2a4"
        size={0.022}
        transparent
        opacity={0.58}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GeometryDais({ showcase }: { showcase: boolean }) {
  const group = useRef<THREE.Group>(null);
  const animationsPaused = useAppStore((state) => state.animationsPaused);
  const size = useThree((state) => state.size);
  const placement = showcase ? getShowcasePlacement(size.width, size.height) : { x: 0, y: 0, scale: 1 };
  const tickPositions = useMemo(() => {
    const positions = new Float32Array(48 * 6);
    for (let index = 0; index < 48; index += 1) {
      const angle = (index / 48) * Math.PI * 2;
      const inner = index % 6 === 0 ? 2.13 : 2.2;
      const offset = index * 6;
      positions[offset] = Math.cos(angle) * inner;
      positions[offset + 1] = 0.014;
      positions[offset + 2] = Math.sin(angle) * inner;
      positions[offset + 3] = Math.cos(angle) * 2.32;
      positions[offset + 4] = 0.014;
      positions[offset + 5] = Math.sin(angle) * 2.32;
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (!group.current || animationsPaused) return;
    group.current.rotation.y = clock.elapsedTime * (showcase ? 0.045 : 0.028);
  });

  return (
    <group ref={group} position={[placement.x, -1.34 + placement.y, 0]} scale={placement.scale} raycast={() => null}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.55, 96]} />
        <meshBasicMaterial color="#88edff" transparent opacity={0.075} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {[1.18, 1.7, 2.25].map((radius, index) => (
        <mesh key={radius} rotation={[Math.PI / 2, 0, index * 0.42]}>
          <torusGeometry args={[radius, index === 1 ? 0.006 : 0.0045, 8, 128]} />
          <meshBasicMaterial
            color={index === 1 ? "#ffd98b" : "#7df2ff"}
            transparent
            opacity={index === 1 ? 0.36 : 0.24}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      <lineSegments raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[tickPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffd889" transparent opacity={0.34} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

function SceneControls() {
  const controls = useRef<any>(null);
  const camera = useThree((state) => state.camera);
  const selectedShapeId = useAppStore((state) => state.selectedShapeId);
  const autoRotate = useAppStore((state) => state.autoRotate);
  const guidedView = useAppStore((state) => state.guidedView);
  const animationsPaused = useAppStore((state) => state.animationsPaused);
  const viewResetNonce = useAppStore((state) => state.viewResetNonce);

  useEffect(() => {
    camera.position.set(3.3, 2.5, 4);
    controls.current?.target.set(0, 0, 0);
    controls.current?.update();
  }, [camera, selectedShapeId, viewResetNonce]);

  useFrame(() => {
    if (!guidedView || animationsPaused) return;
    camera.position.lerp(new THREE.Vector3(3.2, 2.35, 4.1), 0.025);
    controls.current?.target.lerp(new THREE.Vector3(0, 0.02, 0), 0.03);
    controls.current?.update();
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      enableZoom
      zoomSpeed={0.55}
      rotateSpeed={0.72}
      minDistance={2.6}
      maxDistance={7.2}
      autoRotate={autoRotate && !animationsPaused}
      autoRotateSpeed={0.8}
      minPolarAngle={guidedView ? Math.PI / 5 : 0}
      maxPolarAngle={guidedView ? Math.PI / 1.55 : Math.PI}
    />
  );
}

function InteractiveBody() {
  const selectedShapeId = useAppStore((state) => state.selectedShapeId);
  const materialMode = useAppStore((state) => state.materialMode);
  const showFaces = useAppStore((state) => state.showFaces);
  const showEdges = useAppStore((state) => state.showEdges);
  const showVertices = useAppStore((state) => state.showVertices);
  const animationsPaused = useAppStore((state) => state.animationsPaused);
  const screen = useAppStore((state) => state.screen);
  const challengeIndex = useAppStore((state) => state.challengeIndex);
  const submitPartSelection = useAppStore((state) => state.submitPartSelection);
  const markSceneInteraction = useAppStore((state) => state.markSceneInteraction);
  const shape = getShapeById(selectedShapeId);
  const activeChallenge = screen === "challenge" ? challenges[challengeIndex] : undefined;
  const targetPart = activeChallenge?.shapeId === selectedShapeId ? activeChallenge.targetPart : undefined;
  const rotation = getShapeRotation(selectedShapeId);

  const handlePart = (part: PartTarget, point?: Vec3) => (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    markSceneInteraction();
    const localPoint = point ?? getLocalHitPoint(event);
    submitPartSelection(part, localPoint);
  };

  return (
    <Float speed={animationsPaused ? 0 : 1.2} rotationIntensity={animationsPaused ? 0 : 0.08} floatIntensity={0.14}>
      <group rotation={rotation}>
        <ShapeArrival key={selectedShapeId} shapeId={selectedShapeId} animationsPaused={animationsPaused} />
        <ShapeBody
          shapeId={selectedShapeId}
          materialMode={materialMode}
          showFaces={showFaces}
          showEdges={showEdges}
          animationsPaused={animationsPaused}
          onBodySelect={handlePart(selectedShapeId === "sphere" ? "surface" : "face")}
        />
        <CurvedSurfaceGuides shapeId={selectedShapeId} visible={showEdges || materialMode === "labels"} />
        {(materialMode === "labels" || targetPart === "edge") && (
          <HotspotCloud key={`${selectedShapeId}-edges`} points={shape.edgePoints} part="edge" onSelect={handlePart} color="#78efff" />
        )}
        {(showVertices || materialMode === "labels" || targetPart === "vertex") && (
          <HotspotCloud key={`${selectedShapeId}-vertices`} points={shape.vertexPoints} part="vertex" onSelect={handlePart} color="#ffe58a" />
        )}
        {(targetPart === "base" || materialMode === "labels") && (
          <BaseHotspots points={shape.basePoints} onSelect={handlePart} />
        )}
        <SelectionAura shapeId={selectedShapeId} />
        {materialMode === "labels" && <EducationalLabels />}
      </group>
    </Float>
  );
}

function ShapeArrival({ shapeId, animationsPaused }: { shapeId: ShapeId; animationsPaused: boolean }) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const elapsed = useRef(0);
  const positions = useMemo(() => {
    const data = new Float32Array(42 * 3);
    for (let index = 0; index < 42; index += 1) {
      const angle = seeded(index + 15) * Math.PI * 2;
      const height = (seeded(index + 57) - 0.5) * 2.4;
      const radius = 1.1 + seeded(index + 89) * 0.55;
      data[index * 3] = Math.cos(angle) * radius;
      data[index * 3 + 1] = height;
      data[index * 3 + 2] = Math.sin(angle) * radius;
    }
    return data;
  }, [shapeId]);

  useFrame((_, delta) => {
    if (!points.current || !material.current) return;
    elapsed.current += animationsPaused ? 2 : delta;
    const progress = Math.min(1, elapsed.current / 1.25);
    points.current.visible = progress < 1;
    points.current.scale.setScalar(0.7 + progress * 0.45);
    material.current.opacity = (1 - progress) * 0.68;
  });

  return (
    <points ref={points} raycast={() => null}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        color={getShapePalette(shapeId).edge}
        size={0.042}
        transparent
        opacity={0.68}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ShapeBody({
  shapeId,
  materialMode,
  showFaces,
  showEdges,
  animationsPaused,
  onBodySelect,
}: {
  shapeId: ShapeId;
  materialMode: MaterialMode;
  showFaces: boolean;
  showEdges: boolean;
  animationsPaused: boolean;
  onBodySelect?: (event: ThreeEvent<PointerEvent>) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshPhysicalMaterial>(null);
  const materialize = useRef(1);
  const shouldShowEdges = showEdges || materialMode === "edges" || materialMode === "labels";
  const opacity = getOpacity(materialMode, showFaces);
  const color = getBodyColor(shapeId);
  const palette = getShapePalette(shapeId);

  useEffect(() => {
    materialize.current = 0;
    mesh.current?.scale.setScalar(0.82);
  }, [shapeId]);

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    const pulse = animationsPaused ? 0 : Math.sin(clock.elapsedTime * 1.45) * 0.018;
    const speed = animationsPaused ? 1 : Math.min(1, delta * 2.4);
    materialize.current = Math.min(1, materialize.current + speed);
    const reveal = THREE.MathUtils.smoothstep(materialize.current, 0, 1);
    const targetScale = (0.86 + reveal * 0.14) * (1 + pulse);
    mesh.current.scale.setScalar(THREE.MathUtils.lerp(mesh.current.scale.x, targetScale, 0.1));

    if (material.current) {
      material.current.opacity = opacity * reveal;
      material.current.emissiveIntensity = getEmissiveIntensity(materialMode) + (1 - reveal) * 0.44;
      material.current.roughness = materialMode === "solid" ? 0.25 : 0.18;
    }
  });

  return (
    <>
      <mesh ref={mesh} castShadow receiveShadow onPointerDown={onBodySelect}>
        <PrimitiveGeometry shapeId={shapeId} />
        <meshPhysicalMaterial
          ref={material}
          color={color}
          roughness={0.2}
          metalness={0.04}
          clearcoat={0.9}
          clearcoatRoughness={0.14}
          envMapIntensity={0.28}
          iridescence={0.12}
          iridescenceIOR={1.25}
          transparent
          opacity={opacity}
          depthWrite={opacity > 0.45}
          side={THREE.DoubleSide}
          emissive={new THREE.Color(palette.emissive)}
          emissiveIntensity={getEmissiveIntensity(materialMode)}
        />
      </mesh>
      <FaceSheen shapeId={shapeId} visible={showFaces && materialMode !== "edges"} color={palette.highlight} />
      <AnimatedEdges shapeId={shapeId} visible={shouldShowEdges} color={palette.edge} animationsPaused={animationsPaused} />
    </>
  );
}

function FaceSheen({ shapeId, visible, color }: { shapeId: ShapeId; visible: boolean; color: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const animationsPaused = useAppStore((state) => state.animationsPaused);

  useFrame(({ clock }) => {
    if (!mesh.current || !material.current) return;
    const glow = visible ? 0.06 + (animationsPaused ? 0 : Math.sin(clock.elapsedTime * 1.7) * 0.014) : 0;
    material.current.opacity = THREE.MathUtils.lerp(material.current.opacity, Math.max(0, glow), 0.08);
    mesh.current.scale.setScalar(1.012 + (animationsPaused ? 0 : Math.sin(clock.elapsedTime * 1.25) * 0.004));
  });

  return (
    <mesh ref={mesh} raycast={() => null} renderOrder={2}>
      <PrimitiveGeometry shapeId={shapeId} />
      <meshBasicMaterial
        ref={material}
        color={color}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function AnimatedEdges({
  shapeId,
  visible,
  color,
  animationsPaused,
}: {
  shapeId: ShapeId;
  visible: boolean;
  color: string;
  animationsPaused: boolean;
}) {
  const material = useRef<THREE.LineBasicMaterial>(null);
  const line = useRef<THREE.LineSegments>(null);
  const reveal = useRef(visible ? 1 : 0);
  const geometry = useMemo(() => {
    const base = createShapeGeometry(shapeId);
    const edges = new THREE.EdgesGeometry(base, 12);
    base.dispose();
    return edges;
  }, [shapeId]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => {
    if (visible && !animationsPaused) reveal.current = 0;
  }, [animationsPaused, shapeId, visible]);

  useFrame(({ clock }, delta) => {
    if (!material.current || !line.current) return;
    const speed = animationsPaused ? 1 : Math.min(1, delta * 2.7);
    const target = visible ? 1 : 0;
    reveal.current = THREE.MathUtils.lerp(reveal.current, target, speed);
    material.current.opacity = reveal.current * (0.86 + (animationsPaused ? 0 : Math.sin(clock.elapsedTime * 2.1) * 0.08));
    line.current.scale.setScalar(1.006 + reveal.current * 0.012);
    const count = geometry.getAttribute("position").count;
    line.current.geometry.setDrawRange(0, Math.floor((count * reveal.current) / 2) * 2);
  });

  return (
    <lineSegments ref={line} geometry={geometry} raycast={() => null} renderOrder={4}>
      <lineBasicMaterial
        ref={material}
        color={color}
        transparent
        opacity={visible ? 0.9 : 0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

function PrimitiveGeometry({ shapeId }: { shapeId: ShapeId }) {
  const geometry = useMemo(() => createShapeGeometry(shapeId), [shapeId]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <primitive object={geometry} attach="geometry" />;
}

function createShapeGeometry(shapeId: ShapeId) {
  switch (shapeId) {
    case "cube":
      return new THREE.BoxGeometry(1.8, 1.8, 1.8);
    case "rectangular-prism":
      return new THREE.BoxGeometry(2.36, 1.36, 1.12);
    case "triangular-prism":
      return new THREE.CylinderGeometry(1.03, 1.03, 1.84, 3, 1, false);
    case "square-pyramid":
      return new THREE.ConeGeometry(1.35, 1.92, 4, 1, false);
    case "triangular-pyramid":
      return new THREE.TetrahedronGeometry(1.42, 0);
    case "cylinder":
      return new THREE.CylinderGeometry(0.92, 0.92, 1.92, 48, 1, false);
    case "cone":
      return new THREE.ConeGeometry(1.05, 1.95, 56, 1, false);
    case "sphere":
      return new THREE.SphereGeometry(1.12, 48, 24);
    default:
      return new THREE.BoxGeometry(1.8, 1.8, 1.8);
  }
}

function CurvedSurfaceGuides({ shapeId, visible }: { shapeId: ShapeId; visible: boolean }) {
  if (!visible) return null;

  if (shapeId === "sphere") {
    return null;
  }

  if (shapeId === "cylinder") {
    return (
      <group>
        {[-0.96, 0.96].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
            <torusGeometry args={[0.92, 0.012, 8, 96]} />
            <meshBasicMaterial color="#dffcff" transparent opacity={0.86} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
    );
  }

  if (shapeId === "cone") {
    return (
      <mesh position={[0, -0.97, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <torusGeometry args={[1.05, 0.012, 8, 96]} />
        <meshBasicMaterial color="#ffe0a1" transparent opacity={0.88} blending={THREE.AdditiveBlending} />
      </mesh>
    );
  }

  return null;
}

function getShapeRotation(shapeId: ShapeId): Vec3 {
  if (shapeId === "square-pyramid") return [0, Math.PI / 4, 0];
  if (shapeId === "triangular-prism") return [0, Math.PI / 6, 0];
  if (shapeId === "triangular-pyramid") return [0.1, Math.PI / 4, 0];
  return [0, 0, 0];
}

function getOpacity(mode: MaterialMode, showFaces: boolean) {
  if (!showFaces) return 0.06;
  if (mode === "solid") return 0.92;
  if (mode === "translucent") return 0.53;
  if (mode === "edges") return 0.08;
  return 0.36;
}

function getEmissiveIntensity(mode: MaterialMode) {
  if (mode === "edges") return 0.18;
  if (mode === "labels") return 0.2;
  return 0.12;
}

function getBodyColor(shapeId: ShapeId) {
  const colors: Record<ShapeId, string> = {
    cube: "#178cae",
    "rectangular-prism": "#6152b7",
    "triangular-prism": "#148f70",
    "square-pyramid": "#945bb8",
    "triangular-pyramid": "#258da4",
    cylinder: "#188fa4",
    cone: "#b98332",
    sphere: "#834fb3",
  };
  return colors[shapeId];
}

function getShapePalette(shapeId: ShapeId) {
  const palettes: Record<ShapeId, { edge: string; highlight: string; emissive: string }> = {
    cube: { edge: "#baf7ff", highlight: "#7ceaff", emissive: "#3bbfea" },
    "rectangular-prism": { edge: "#d2c9ff", highlight: "#a99bff", emissive: "#746cff" },
    "triangular-prism": { edge: "#b6ffe1", highlight: "#60f0bf", emissive: "#27cfa4" },
    "square-pyramid": { edge: "#f1cbff", highlight: "#dda0ff", emissive: "#a66ce6" },
    "triangular-pyramid": { edge: "#c8fbff", highlight: "#87f0ff", emissive: "#2ed2eb" },
    cylinder: { edge: "#d9fcff", highlight: "#6eeeff", emissive: "#2fd3ee" },
    cone: { edge: "#ffe6a8", highlight: "#ffd06f", emissive: "#e3a23f" },
    sphere: { edge: "#efd2ff", highlight: "#e2a8ff", emissive: "#ba77e9" },
  };
  return palettes[shapeId];
}

function HotspotCloud({
  points,
  part,
  color,
  onSelect,
}: {
  points: Vec3[];
  part: PartTarget;
  color: string;
  onSelect: (part: PartTarget, point?: Vec3) => (event: ThreeEvent<PointerEvent>) => void;
}) {
  return (
    <>
      {points.map((point, index) => (
        <AnimatedHotspot
          key={`${part}-${index}`}
          point={point}
          part={part}
          color={color}
          index={index}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

function AnimatedHotspot({
  point,
  part,
  color,
  index,
  onSelect,
}: {
  point: Vec3;
  part: PartTarget;
  color: string;
  index: number;
  onSelect: (part: PartTarget, point?: Vec3) => (event: ThreeEvent<PointerEvent>) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const radius = part === "vertex" ? 0.12 : 0.105;
  const animationsPaused = useAppStore((state) => state.animationsPaused);
  const startedAt = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (!mesh.current || !material.current) return;
    if (startedAt.current === null) startedAt.current = clock.elapsedTime;
    const delay = index * 0.11;
    const reveal = animationsPaused ? 1 : Math.min(1, Math.max(0, (clock.elapsedTime - startedAt.current) * 1.6 - delay));
    const sparkle = animationsPaused ? 1 : 0.9 + Math.sin(clock.elapsedTime * 2.8 + index) * 0.16;
    mesh.current.scale.setScalar(radius * reveal * sparkle);
    material.current.opacity = 0.68 + reveal * 0.3;
  });

  return (
    <group position={point} onPointerDown={onSelect(part, point)}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          ref={material}
          color={color}
          transparent
          opacity={0.92}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function BaseHotspots({
  points,
  onSelect,
}: {
  points: Vec3[];
  onSelect: (part: PartTarget, point?: Vec3) => (event: ThreeEvent<PointerEvent>) => void;
}) {
  return (
    <>
      {points.map((point, index) => (
        <AnimatedBaseHotspot key={`base-${index}`} point={point} index={index} onSelect={onSelect} />
      ))}
    </>
  );
}

function AnimatedBaseHotspot({
  point,
  index,
  onSelect,
}: {
  point: Vec3;
  index: number;
  onSelect: (part: PartTarget, point?: Vec3) => (event: ThreeEvent<PointerEvent>) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (!mesh.current || !material.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 2 + index) * 0.04;
    mesh.current.scale.setScalar(pulse);
    material.current.opacity = 0.36 + Math.sin(clock.elapsedTime * 1.6 + index) * 0.08;
  });

  return (
    <mesh position={point} rotation={[-Math.PI / 2, 0, 0]} onPointerDown={onSelect("base", point)} ref={mesh}>
      <circleGeometry args={[0.42, 48]} />
      <meshBasicMaterial
        ref={material}
        color="#a6ffcb"
        transparent
        opacity={0.42}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function SelectionAura({ shapeId }: { shapeId: ShapeId }) {
  const selection = useAppStore((state) => state.lastPartSelection);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const ringMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const reveal = useRef(0);
  const color = selection ? getPartColor(selection.part) : "#ffffff";
  const point = selection?.point ?? getFallbackSelectionPoint(shapeId, selection?.part);

  useEffect(() => {
    reveal.current = 1;
  }, [selection?.nonce]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    reveal.current = Math.max(0, reveal.current - delta * 0.62);
    const pulse = 1 + (1 - reveal.current) * 1.2;
    group.current.scale.setScalar(pulse);
    group.current.rotation.z = clock.elapsedTime * 0.75;
    if (material.current) material.current.opacity = reveal.current * 0.42;
    if (ringMaterial.current) ringMaterial.current.opacity = reveal.current * 0.78;
  });

  if (!selection || !point) return null;

  return (
    <group ref={group} position={point} raycast={() => null}>
      <mesh>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshBasicMaterial
          ref={material}
          color={color}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.009, 8, 64]} />
        <meshBasicMaterial
          ref={ringMaterial}
          color={color}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function EducationalLabels() {
  const selectedShapeId = useAppStore((state) => state.selectedShapeId);
  const shape = getShapeById(selectedShapeId);

  return (
    <>
      {shape.labels.map((label) => (
        <Html key={label.text} position={label.position} center className="scene-label">
          {label.text}
        </Html>
      ))}
      {selectedShapeId !== "sphere" && (
        <Line
          points={[
            [1.45, -1, 0],
            [1.45, 1, 0],
          ]}
          color="#ffffff"
          lineWidth={2}
          dashed
          dashScale={0.35}
        />
      )}
    </>
  );
}

function SceneBadge() {
  const selectedShapeId = useAppStore((state) => state.selectedShapeId);
  const materialMode = useAppStore((state) => state.materialMode);
  const showRealObject = useAppStore((state) => state.showRealObject);
  const shape = getShapeById(selectedShapeId);

  return (
    <div className="scene-badge" aria-live="polite">
      <span>{shape.name}</span>
      <small>Material {modeLabels[materialMode]}</small>
      {showRealObject && <strong>Objeto: {shape.everydayExamples[0]}</strong>}
    </div>
  );
}

function ShowcaseBodies() {
  const animationsPaused = useAppStore((state) => state.animationsPaused);
  const size = useThree((state) => state.size);
  const placement = getShowcasePlacement(size.width, size.height);
  const items: Array<{ id: ShapeId; position: Vec3; scale: number; rotation: Vec3 }> = [
    { id: "cube", position: [-1.9, 0.4, 0], scale: 0.64, rotation: [0.2, 0.5, 0.1] },
    { id: "sphere", position: [0, 0.1, 0.2], scale: 0.72, rotation: [0, 0, 0] },
    { id: "cylinder", position: [1.8, 0.35, -0.1], scale: 0.58, rotation: [0.3, 0.2, 0] },
    { id: "cone", position: [-0.9, -0.8, 0.15], scale: 0.52, rotation: [0.2, -0.6, 0.1] },
    { id: "square-pyramid", position: [1.08, -0.72, 0.1], scale: 0.5, rotation: [0, 0.6, 0] },
  ];

  return (
    <group position={[placement.x, placement.y, 0]} scale={placement.scale}>
      {items.map((item, index) => (
        <Float
          key={item.id}
          speed={animationsPaused ? 0 : 1 + index * 0.12}
          floatIntensity={animationsPaused ? 0 : 0.35}
          rotationIntensity={animationsPaused ? 0 : 0.18}
        >
          <mesh position={item.position} scale={item.scale} rotation={item.rotation} castShadow receiveShadow>
            <PrimitiveGeometry shapeId={item.id} />
            <meshPhysicalMaterial
              color={getBodyColor(item.id)}
              transparent
              opacity={0.82}
              roughness={0.22}
              metalness={0.08}
              clearcoat={0.75}
              clearcoatRoughness={0.12}
              envMapIntensity={0.28}
              iridescence={0.1}
              side={THREE.DoubleSide}
              emissive={new THREE.Color(getShapePalette(item.id).emissive)}
              emissiveIntensity={0.16}
            />
            <Edges color={getShapePalette(item.id).edge} threshold={12} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function getShowcasePlacement(width: number, height: number) {
  if (height < 700 && width < 1020) return { x: 1.05, y: -2.25, scale: 0.52 };
  if (width < 620) return { x: 0, y: -1.45, scale: 0.48 };
  if (width < 1020) return { x: 0, y: -1.36, scale: 0.72 };
  return { x: 1.65, y: 0.08, scale: Math.min(0.95, 703 / height) };
}

function getLocalHitPoint(event: ThreeEvent<PointerEvent>): Vec3 | undefined {
  if (!event.point || !(event.object instanceof THREE.Object3D)) return undefined;
  const local = event.object.worldToLocal(event.point.clone());
  return [local.x, local.y, local.z];
}

function getPartColor(part: PartTarget) {
  const colors: Record<PartTarget, string> = {
    face: "#aeefff",
    edge: "#78efff",
    vertex: "#ffe58a",
    base: "#a6ffcb",
    surface: "#e6b1ff",
    "real-object": "#ffd889",
  };
  return colors[part];
}

function getFallbackSelectionPoint(shapeId: ShapeId, part?: PartTarget): Vec3 | undefined {
  if (!part) return undefined;
  if (part === "vertex") return getShapeById(shapeId).vertexPoints[0];
  if (part === "edge") return getShapeById(shapeId).edgePoints[0];
  if (part === "base") return getShapeById(shapeId).basePoints[0];
  if (part === "surface") return [1.05, 0.1, 0];
  return [0, 0, 1.02];
}

function seeded(seed: number) {
  const value = Math.sin(seed * 98.233) * 43758.5453;
  return value - Math.floor(value);
}
