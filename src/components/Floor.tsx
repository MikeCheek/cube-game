import { Box, useTexture } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import React from 'react';
import { FLOOR_WIDTH } from '../utility/controls';

const Floor = () => {
  const texture = useTexture('/textures/beige_wall_002_diff_4k.jpg');

  return (
    <>
      <RigidBody type="fixed" name="floor" friction={1}>
        <Box receiveShadow position={[0, 0, -5]} rotation={[Math.PI / 50, 0, 0]} args={[FLOOR_WIDTH, 0.1, 50]}>
          <meshToonMaterial
            // color="#664228"
            map={texture}
          />
        </Box>
      </RigidBody>

      <CuboidCollider position={[0, -5, -5]} args={[100, 1, 100]} name="void" sensor />
      <CuboidCollider position={[50, -5, -5]} args={[100, 1, 100]} rotation={[0, 0, Math.PI / 2]} name="void" sensor />
      <CuboidCollider position={[-50, -5, -5]} args={[100, 1, 100]} rotation={[0, 0, Math.PI / 2]} name="void" sensor />
      <CuboidCollider position={[0, -5, 50]} args={[100, 1, 100]} rotation={[Math.PI / 2, 0, 0]} name="void" sensor />
    </>
  );
};

export default Floor;
