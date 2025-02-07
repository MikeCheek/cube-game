import { RapierRigidBody } from '@react-three/rapier';

export const CONTROLS = {
  FORWARD: 'forward',
  BACK: 'back',
  LEFT: 'left',
  RIGHT: 'right',
  JUMP: 'jump',
  START: 'start',
};

export const jump = (obj: RapierRigidBody, small = false) => {
  obj.applyImpulse({ x: 0, y: small ? 1 : 5, z: 0 }, true);
};

export const JUMP_FORCE = 0.5;
export const MOVEMENT_SPEED = 0.4;
export const MAX_VEL = 3;

export const FLOOR_WIDTH = 20;

export const SPAWN_OBJECT_Z = -25;
