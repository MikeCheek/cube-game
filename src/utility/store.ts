import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const MALUS_TIME = 7000;
const BONUS_TIME = 5000;
const MALUS_BOUNCINESS = 3;
export const BASIC_BOUNCINESS = 1;
const STARTING_HEALTH = 3;
const SCORE_COIN = 20;

export enum GAME_STATES {
  MENU = 'MENU',
  GAME = 'GAME',
  GAME_OVER = 'GAME_OVER',
}

export enum GAME_MODE {
  EASY = 'EASY',
  DIFFICULT = 'DIFFICULT',
}

export const playAudio = (path: string, callback?: () => void) => {
  const audio = new Audio(`./sounds/${path}.mp3`);
  if (callback) audio.addEventListener('ended', callback);
  audio.play();
};

interface IGameStore {
  mode: string;
  gameState: keyof typeof GAME_STATES;
  score: number;
  coins: number;
  bounciness: number;
  flying: boolean;
  health: number;
  startGame: ({ mode }: { mode: keyof typeof GAME_MODE }) => void;
  goToMenu: () => void;
  collided: () => void;
  fallDown: () => void;
  incrementScore: (points: number) => void;
  malusBounciness: () => void;
  bonusFlying: () => void;
  plusCoin: () => void;
}

export const useGameStore = create(
  subscribeWithSelector<IGameStore>((set, get) => ({
    gameState: GAME_STATES.MENU,
    mode: GAME_MODE.EASY,
    score: 0,
    coins: 0,
    health: STARTING_HEALTH,
    bounciness: BASIC_BOUNCINESS,
    flying: false,
    startGame: ({ mode }) => {
      set({ gameState: GAME_STATES.GAME, mode, score: 0, coins: 0, health: STARTING_HEALTH });
    },
    goToMenu: () => {
      set({ gameState: GAME_STATES.MENU });
    },
    collided: () => {
      const health = get().health - 1;
      if (health === 0) set({ gameState: GAME_STATES.GAME_OVER, health: health });
      else set({ health: health });
    },
    fallDown: () => {
      set({ gameState: GAME_STATES.GAME_OVER });
    },
    incrementScore: (points = 1) => {
      set({ score: get().score + points });
    },
    malusBounciness: () => {
      set({ bounciness: MALUS_BOUNCINESS });
      setTimeout(() => set({ bounciness: BASIC_BOUNCINESS }), MALUS_TIME);
    },
    bonusFlying: () => {
      set({ flying: true });
      setTimeout(() => set({ flying: false }), BONUS_TIME);
    },
    plusCoin: () => {
      set({ coins: get().coins + 1, score: get().score + SCORE_COIN });
    },
  }))
);
