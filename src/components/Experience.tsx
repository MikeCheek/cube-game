import { ContactShadows, Environment, OrbitControls, Text, useKeyboardControls } from '@react-three/drei';
import Ball from './Ball';
import Player from './Player';
import React, { useState } from 'react';
import { CONTROLS } from '../utility/controls';
import { useFrame } from '@react-three/fiber';
import Floor from './Floor';
import { GAME_MODE, GAME_STATES, useGameStore } from '../utility/store';
import BonusMalus from './BonusMalus';
import Coin from './Coin';

const debug = process.env.NODE_ENV === 'development';

const Experience = () => {
  const [coins, setCoins] = useState<number>(0);

  const startPressed = useKeyboardControls((state) => state[CONTROLS.START]);

  const { gameState, startGame, incrementScore } = useGameStore();
  const gameStarted = gameState === GAME_STATES.GAME;
  const gameOver = gameState === GAME_STATES.GAME_OVER;

  useFrame((_state, _delta) => {
    if (startPressed && !gameStarted) startGame({ mode: GAME_MODE.EASY });
    if (gameStarted) incrementScore(0.1);
    if (gameStarted && coins === 0) {
      setCoins(5);
    }
    if (gameOver && coins !== 0) {
      setCoins(0);
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, -10]} intensity={0.5} castShadow />
      <color attach="background" args={['#124322']} />

      {debug ? <OrbitControls /> : <></>}

      {!gameStarted ? (
        <Text position={[0, 0.1, 6]} rotation={[-Math.PI / 2 + Math.PI / 50, 0, 0]}>
          Press 'P' to start
        </Text>
      ) : (
        <></>
      )}

      <ContactShadows
        frames={1}
        position={[0, -0.88, 0]}
        scale={80}
        opacity={0.42}
        far={50}
        blur={0.8}
        color="#000000"
      />

      <Player />

      {[...Array(coins)].map((_, key) => (
        <Coin key={key} />
      ))}

      {[...Array(Math.round(coins / 2))].map((_, key) => (
        <Ball key={key} />
      ))}

      {coins ? (
        <>
          <BonusMalus type="bonus" changing />
        </>
      ) : (
        <></>
      )}

      <Floor />
    </>
  );
};

export default Experience;
