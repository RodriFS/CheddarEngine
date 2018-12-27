import Cheddar from './cheddar';
import userInterface from './scenes/userInterface';
import gameScene from './scenes/gameScene';

const GameConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
  scenes: [gameScene, userInterface]
};

export class Game extends Cheddar.Game {
  constructor(config) {
    super(config);
  }
}

export const loadGame = () => {
  return new Game(GameConfig);
};
