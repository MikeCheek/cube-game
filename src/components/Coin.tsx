import { Cylinder } from '@react-three/drei';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import React, { useMemo, useRef, useState } from 'react';
import { getRandom, getRandomInt } from '../utility/random';
import { useFrame } from '@react-three/fiber';
import { FLOOR_WIDTH, SPAWN_OBJECT_Z, jump } from '../utility/controls';
import { useGameStore } from '../utility/store';

const Coin = () => {
  const [isOnFloor, setIsOnFloor] = useState<boolean>(false);
  const pos = useMemo(() => getRandomInt(-FLOOR_WIDTH / 2, FLOOR_WIDTH / 2), []);
  const mult = useMemo(() => getRandom(0.1, 0.2), []);
  const ref = useRef<RapierRigidBody>(null);

  const { plusCoin } = useGameStore();

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.applyImpulse({ x: 0, y: 0, z: mult * delta }, true);
      if (isOnFloor) {
        const rand = getRandomInt(0, 100);
        if (rand === 5) {
          jump(ref.current, true);
          setIsOnFloor(false);
        }
      }
    }
  });

  const resetPosition = () => {
    ref.current?.setTranslation({ x: getRandomInt(-FLOOR_WIDTH / 2, FLOOR_WIDTH / 2), y: 5, z: SPAWN_OBJECT_Z }, true);
    ref.current?.setLinvel({ x: 0, y: 0, z: 5 }, true);
    ref.current?.resetForces(true);
    ref.current?.setRotation({ x: 0, y: 0, z: Math.PI / 2, w: 0 }, true);
  };

  return (
    <RigidBody
      position={[pos, 0, SPAWN_OBJECT_Z]}
      colliders="hull"
      name="coin"
      linearVelocity={[0, 0, 5]}
      ref={ref}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === 'floor') setIsOnFloor(true);
        if (other.rigidBodyObject?.name === 'player') {
          plusCoin();
          resetPosition();
        }
      }}
      onCollisionExit={({ other }) => {
        if (other.rigidBodyObject?.name === 'floor') setIsOnFloor(false);
      }}
      onIntersectionEnter={({ other, target }) => {
        if (other.colliderObject?.name === 'void') resetPosition();
      }}
    >
      <Cylinder args={[0.5, 0.5, 0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <meshToonMaterial color="yellow" />
      </Cylinder>
    </RigidBody>
  );
};

export default Coin;
