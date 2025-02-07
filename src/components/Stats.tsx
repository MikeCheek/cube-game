import React from 'react';
import { BASIC_BOUNCINESS, useGameStore } from '../utility/store';

const Stats = () => {
  const { health, bounciness, flying, coins, score } = useGameStore();
  return (
    <div className="flex absolute top-2 left-2 z-10 items-start flex-col text-3xl text-white">
      <p>Health: {[...Array(health)].map(() => '❤️')}</p>
      <p>
        Score: <span className="text-orange-500">{score.toFixed(0)}</span>
      </p>
      <p>
        Coins: <span className="text-yellow-500">{coins}</span>
      </p>
      {bounciness !== BASIC_BOUNCINESS ? <p className="text-red-700">- BOUNCINESS</p> : <></>}
      {flying ? <p className="text-green-700">+ FLYING</p> : <></>}
    </div>
  );
};

export default Stats;
