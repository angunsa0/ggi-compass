import { useRef, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Edges } from '@react-three/drei';
import { PlacedFurniture, RoomDimensions } from '@/types/planner';
import * as THREE from 'three';

interface PlannerCanvas3DProps {
  roomDimensions: RoomDimensions;
  placedFurniture: PlacedFurniture[];
  selectedId: string | null;
  scale: number;
  onSelect: (id: string | null) => void;
}

// SketchUp-style palette
const WALL_COLOR = '#f0ede6';
const FLOOR_COLOR = '#e2dfd6';
const EDGE_COLOR = '#2a2a2a';
const SELECTED_EDGE = '#0066cc';

function TexturedBox({ item, isSelected, onSelect }: {
  item: PlacedFurniture;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const w = item.furniture.width / 1000;
  const d = item.furniture.height / 1000;
  const h = (item.furniture.depth || 750) / 1000;

  const roomScale = 0.1;
  const posX = (item.x / roomScale) / 1000 + w / 2;
  const posZ = (item.y / roomScale) / 1000 + d / 2;

  const baseColor = item.furniture.color || '#c8b89a';

  // Load texture from thumbnail if available
  const texture = useMemo(() => {
    if (!item.furniture.thumbnail) return null;
    try {
      const loader = new THREE.TextureLoader();
      const tex = loader.load(item.furniture.thumbnail);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    } catch {
      return null;
    }
  }, [item.furniture.thumbnail]);

  // Create materials array: [+x, -x, +y, -y, +z, -z]
  // Front (+z) and top (+y) get texture, rest get base color
  const materials = useMemo(() => {
    const baseMat = new THREE.MeshLambertMaterial({ color: baseColor });
    
    if (texture) {
      const texMat = new THREE.MeshLambertMaterial({ map: texture });
      const topMat = new THREE.MeshLambertMaterial({ color: baseColor, transparent: true, opacity: 0.95 });
      return [
        baseMat,     // right
        baseMat,     // left
        topMat,      // top
        baseMat,     // bottom
        texMat,      // front (facing camera)
        texMat,      // back
      ];
    }
    return [baseMat, baseMat, baseMat, baseMat, baseMat, baseMat];
  }, [texture, baseColor]);

  return (
    <group
      position={[posX, h / 2, posZ]}
      rotation={[0, -(item.rotation * Math.PI) / 180, 0]}
    >
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item.id);
        }}
        castShadow
        receiveShadow
        material={materials}
      >
        <boxGeometry args={[w, h, d]} />
        <Edges
          threshold={15}
          color={isSelected ? SELECTED_EDGE : EDGE_COLOR}
          lineWidth={isSelected ? 3 : 1.5}
        />
      </mesh>
      {/* Label on top */}
      <Text
        position={[0, h / 2 + 0.06, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.11}
        color="#222"
        anchorX="center"
        anchorY="middle"
        maxWidth={w * 0.9}
        font={undefined}
      >
        {item.furniture.name}
      </Text>
      {/* Dimension label below name */}
      <Text
        position={[0, h / 2 + 0.03, 0.12]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.07}
        color="#777"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {item.furniture.width}×{item.furniture.height}×{item.furniture.depth || 750}
      </Text>
    </group>
  );
}

function Room({ dimensions }: { dimensions: RoomDimensions }) {
  const w = dimensions.width / 1000;
  const d = dimensions.height / 1000;
  const wallH = 2.8;
  const wallThickness = 0.06;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[w / 2, 0, d / 2]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshLambertMaterial color={FLOOR_COLOR} />
      </mesh>

      {/* Back wall */}
      <mesh position={[w / 2, wallH / 2, 0]} castShadow>
        <boxGeometry args={[w, wallH, wallThickness]} />
        <meshLambertMaterial color={WALL_COLOR} />
        <Edges threshold={15} color={EDGE_COLOR} lineWidth={1.5} />
      </mesh>

      {/* Left wall */}
      <mesh position={[0, wallH / 2, d / 2]} castShadow>
        <boxGeometry args={[wallThickness, wallH, d]} />
        <meshLambertMaterial color={WALL_COLOR} />
        <Edges threshold={15} color={EDGE_COLOR} lineWidth={1.5} />
      </mesh>

      {/* Right wall (ghost) */}
      <mesh position={[w, wallH / 2, d / 2]}>
        <boxGeometry args={[wallThickness, wallH, d]} />
        <meshLambertMaterial color={WALL_COLOR} transparent opacity={0.12} />
        <Edges threshold={15} color={EDGE_COLOR} lineWidth={0.8} />
      </mesh>

      {/* Front wall (ghost) */}
      <mesh position={[w / 2, wallH / 2, d]}>
        <boxGeometry args={[w, wallH, wallThickness]} />
        <meshLambertMaterial color={WALL_COLOR} transparent opacity={0.12} />
        <Edges threshold={15} color={EDGE_COLOR} lineWidth={0.8} />
      </mesh>

      {/* Grid */}
      <Grid
        position={[w / 2, 0.001, d / 2]}
        args={[w, d]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#bbb"
        sectionSize={1}
        sectionThickness={1.2}
        sectionColor="#888"
        fadeDistance={25}
        infiniteGrid={false}
      />

      {/* Dimension labels */}
      <Text
        position={[w / 2, 0.02, d + 0.3]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.18}
        color="#555"
        anchorX="center"
      >
        {w.toFixed(1)}m
      </Text>
      <Text
        position={[-0.3, 0.02, d / 2]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        fontSize={0.18}
        color="#555"
        anchorX="center"
      >
        {d.toFixed(1)}m
      </Text>
    </group>
  );
}

function Scene({ roomDimensions, placedFurniture, selectedId, onSelect }: Omit<PlannerCanvas3DProps, 'scale'>) {
  const w = roomDimensions.width / 1000;
  const d = roomDimensions.height / 1000;

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight
        position={[w + 2, 8, d + 2]}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 5, -3]} intensity={0.2} />
      <color attach="background" args={['#f5f3ee']} />

      <Room dimensions={roomDimensions} />

      {placedFurniture.map(item => (
        <TexturedBox
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          onSelect={onSelect}
        />
      ))}

      <OrbitControls
        target={[w / 2, 0.5, d / 2]}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={2}
        maxDistance={20}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

export const PlannerCanvas3D = ({
  roomDimensions,
  placedFurniture,
  selectedId,
  onSelect,
}: PlannerCanvas3DProps) => {
  return (
    <div className="flex-1 bg-muted/30" onClick={() => onSelect(null)}>
      <Canvas
        shadows
        camera={{ position: [8, 6, 8], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true }}
        onClick={(e) => e.stopPropagation()}
      >
        <Scene
          roomDimensions={roomDimensions}
          placedFurniture={placedFurniture}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </Canvas>
    </div>
  );
};
