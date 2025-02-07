import React, { Suspense, useMemo } from 'react';
import './App.css';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import Experience from './components/Experience';
import Stats from './components/Stats';
import { CONTROLS } from './utility/controls';
import { KeyboardControls } from '@react-three/drei';

const debug = process.env.NODE_ENV === 'development';

function App() {
  const map = useMemo(
    () => [
      { name: CONTROLS.START, keys: ['KeyP'] },
      { name: CONTROLS.FORWARD, keys: ['ArrowUp', 'KeyW'] },
      { name: CONTROLS.BACK, keys: ['ArrowDown', 'KeyS'] },
      { name: CONTROLS.LEFT, keys: ['ArrowLeft', 'KeyA'] },
      { name: CONTROLS.RIGHT, keys: ['ArrowRight', 'KeyD'] },
      { name: CONTROLS.JUMP, keys: ['Space'] },
    ],
    []
  );

  return (
    <div>
      <main>
        <Stats />
        <KeyboardControls map={map}>
          <Canvas shadows camera={{ position: [15, 15, 15], fov: 30 }}>
            <color attach="background" args={['#ececec']} />
            <Suspense>
              <Physics debug={debug}>
                <Experience />
              </Physics>
            </Suspense>
          </Canvas>
        </KeyboardControls>
      </main>
    </div>
  );
}

export default App;

