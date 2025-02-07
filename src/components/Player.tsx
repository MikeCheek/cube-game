import React, { useRef, useState } from 'react';
import { Box, useKeyboardControls } from '@react-three/drei';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { CONTROLS, JUMP_FORCE, MAX_VEL, MOVEMENT_SPEED, jump } from '../utility/controls';
import { RootState, useFrame } from '@react-three/fiber';
import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Object3DEventMap, Vector3 } from 'three';
import { useGameStore } from '../utility/store';
import { lerp } from 'three/src/math/MathUtils';

const Player = () => {
  const [isOnFloor, setIsOnFloor] = useState<boolean>(true);
  const [opacity, setOpacity] = useState<number>(1);

  const cube = useRef<RapierRigidBody>(null);
  const refCube = useRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>(null);

  const jumpPressed = useKeyboardControls((state) => state[CONTROLS.JUMP]);
  const leftPressed = useKeyboardControls((state) => state[CONTROLS.LEFT]);
  const rightPressed = useKeyboardControls((state) => state[CONTROLS.RIGHT]);
  const backPressed = useKeyboardControls((state) => state[CONTROLS.BACK]);
  const forwardPressed = useKeyboardControls((state) => state[CONTROLS.FORWARD]);

  const { collided, bounciness, malusBounciness, fallDown, health, flying, bonusFlying } = useGameStore();

  const handleMovement = (state: RootState) => {
    const impulse = { x: 0, y: 0, z: 0 };
    const obj = cube.current;

    if (!obj || !refCube.current) return;

    const linvel = obj.linvel();
    const transl = obj.translation();

    if (flying && transl.y < 4) impulse.y += JUMP_FORCE;

    if (jumpPressed && isOnFloor) {
      impulse.y += JUMP_FORCE;
      setIsOnFloor(false);
    }

    if (rightPressed && linvel.x < MAX_VEL) {
      impulse.x += MOVEMENT_SPEED;
    }
    if (leftPressed && linvel.x > -MAX_VEL) {
      impulse.x -= MOVEMENT_SPEED;
    }
    if (backPressed && linvel.z < MAX_VEL) {
      impulse.z += MOVEMENT_SPEED;
    }
    if (forwardPressed && linvel.z > -MAX_VEL) {
      impulse.z -= MOVEMENT_SPEED;
    }

    obj.applyImpulse(impulse, true);

    const posInWorld = refCube.current.getWorldPosition(new Vector3());

    if (posInWorld.z > 10) obj.setTranslation({ x: posInWorld.x, y: posInWorld.y, z: 9.9 }, true);
    else if (posInWorld.z < -15) obj.setTranslation({ x: posInWorld.x, y: posInWorld.y, z: -14.9 }, true);

    const targetLookAt = new Vector3(0, posInWorld.y, posInWorld.z);
    state.camera.lookAt(targetLookAt);
  };

  const resetPosition = () => {
    cube.current?.setTranslation({ x: -2.5, y: 1, z: 0 }, true);
    cube.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
    cube.current?.resetForces(true);
  };

  const handleCollision = () => {
    const interval = setInterval(() => setOpacity((v) => (v === 1 ? 0.5 : 1)), 200);
    setTimeout(() => {
      clearInterval(interval);
      setOpacity(1);
    }, 2000);
    collided();
  };

  useFrame((state, _delta) => {
    if (jumpPressed && isOnFloor && cube.current) {
      jump(cube.current);
      setIsOnFloor(false);
    }
    handleMovement(state);
  });

  return (
    <RigidBody
      position={[-2.5, 1, 0]}
      restitution={bounciness}
      ref={cube}
      name="player"
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === 'floor') setIsOnFloor(true);
        if (other.rigidBodyObject?.name === 'ball') handleCollision();
        if (other.rigidBodyObject?.name === 'bonus') bonusFlying();
        if (other.rigidBodyObject?.name === 'malus') malusBounciness();
      }}
      onCollisionExit={({ other }) => {
        if (other.rigidBodyObject?.name === 'floor') setIsOnFloor(false);
      }}
      onIntersectionEnter={({ other }) => {
        if (other.colliderObject?.name === 'void') {
          fallDown();
          resetPosition();
        }
      }}
    >
      <Box ref={refCube} castShadow>
        <meshToonMaterial
          color={health === 3 ? 'royalblue' : health === 2 ? 'hotpink' : 'red'}
          opacity={opacity}
          transparent
        />
      </Box>
    </RigidBody>
  );
};

export default Player;
