import { useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
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

// SketchUp-style colors
const WALL_COLOR = '#f5f5f0';
const FLOOR_COLOR = '#e8e8e0';
const EDGE_COLOR = '#333333';
const SELECTED_EDGE = '#0058a3';

function FurnitureBox({ item, isSelected, onSelect }: {
  item: PlacedFurniture;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const w = item.furniture.width / 1000; // m
  const d = item.furniture.height / 1000; // depth in m
  const h = (item.furniture as any).depth ? (item.furniture as any).depth / 1000 : 0.75; // height defaults to 0.75m

  // Convert 2D canvas position to 3D world position
  const roomScale = 0.1; // same scale as 2D
  const posX = (item.x / roomScale) / 1000 + w / 2;
  const posZ = (item.y / roomScale) / 1000 + d / 2;

  const color = item.furniture.color || '#c8b89a';

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
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.85}
        />
        <Edges
          threshold={15}
          color={isSelected ? SELECTED_EDGE : EDGE_COLOR}
          lineWidth={isSelected ? 2 : 1}
        />
      </mesh>
      {/* Label on top */}
      <Text
        position={[0, h / 2 + 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.12}
        color="#333"
        anchorX="center"
        anchorY="middle"
        maxWidth={w * 0.9}
      >
        {item.furniture.name}
      </Text>
    </group>
  );
}

function Room({ dimensions }: { dimensions: RoomDimensions }) {
  const w = dimensions.width / 1000;
  const d = dimensions.height / 1000;
  const wallH = 2.8; // 2.8m walls
  const wallThickness = 0.08;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[w / 2, 0, d / 2]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={FLOOR_COLOR} />
      </mesh>

      {/* Back wall */}
      <mesh position={[w / 2, wallH / 2, 0]} castShadow>
        <boxGeometry args={[w, wallH, wallThickness]} />
        <meshStandardMaterial color={WALL_COLOR} />
        <Edges threshold={15} color={EDGE_COLOR} />
      </mesh>

      {/* Left wall */}
      <mesh position={[0, wallH / 2, d / 2]} castShadow>
        <boxGeometry args={[wallThickness, wallH, d]} />
        <meshStandardMaterial color={WALL_COLOR} />
        <Edges threshold={15} color={EDGE_COLOR} />
      </mesh>

      {/* Right wall (transparent) */}
      <mesh position={[w, wallH / 2, d / 2]}>
        <boxGeometry args={[wallThickness, wallH, d]} />
        <meshStandardMaterial color={WALL_COLOR} transparent opacity={0.15} />
        <Edges threshold={15} color={EDGE_COLOR} />
      </mesh>

      {/* Grid on floor */}
      <Grid
        position={[w / 2, 0.001, d / 2]}
        args={[w, d]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#ccc"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#999"
        fadeDistance={20}
        infiniteGrid={false}
      />
    </group>
  );
}

function Scene({ roomDimensions, placedFurniture, selectedId, onSelect }: Omit<PlannerCanvas3DProps, 'scale'>) {
  const w = roomDimensions.width / 1000;
  const d = roomDimensions.height / 1000;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[w, 6, d]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-2, 4, -2]} intensity={0.3} />

      <Room dimensions={roomDimensions} />

      {placedFurniture.map(item => (
        <FurnitureBox
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
        maxDistance={15}
        enableDamping
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
