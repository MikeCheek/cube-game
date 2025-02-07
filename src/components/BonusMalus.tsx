import { Sphere } from '@react-three/drei';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import React, { useMemo, useRef, useState } from 'react';
import { getRandom, getRandomInt } from '../utility/random';
import { useFrame } from '@react-three/fiber';
import { FLOOR_WIDTH, SPAWN_OBJECT_Z, jump } from '../utility/controls';

const BonusMalus = ({ type, changing = false }: { type: 'bonus' | 'malus'; changing: boolean }) => {
  const [isOnFloor, setIsOnFloor] = useState<boolean>(false);
  const [t, setT] = useState<string>(type);
  const pos = useMemo(() => getRandomInt(-FLOOR_WIDTH / 2, FLOOR_WIDTH / 2), []);
  const mult = useMemo(() => getRandom(0.2, 0.5), []);
  const ref = useRef<RapierRigidBody>(null);

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
    if (changing) setT((v) => (v === 'bonus' ? 'malus' : 'bonus'));
    ref.current?.setTranslation({ x: getRandomInt(-FLOOR_WIDTH / 2, FLOOR_WIDTH / 2), y: 5, z: SPAWN_OBJECT_Z }, true);
    ref.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
    ref.current?.resetForces(true);
  };

  return (
    <RigidBody
      position={[pos, 5, SPAWN_OBJECT_Z]}
      colliders="ball"
      name={t}
      linearVelocity={[0, 0, 5]}
      ref={ref}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === 'floor') setIsOnFloor(true);
        if (other.rigidBodyObject?.name === 'player') resetPosition();
      }}
      onCollisionExit={({ other }) => {
        if (other.rigidBodyObject?.name === 'floor') setIsOnFloor(false);
      }}
      onIntersectionEnter={({ other, target }) => {
        if (other.colliderObject?.name === 'void') resetPosition();
      }}
    >
      <Sphere args={[0.4]} castShadow>
        <meshToonMaterial color={t === 'bonus' ? 'green' : 'red'} transparent opacity={0.5} />
      </Sphere>
    </RigidBody>
  );
};

export default BonusMalus;
