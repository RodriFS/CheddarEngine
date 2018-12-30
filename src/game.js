import Cheddar from './cheddar';
import userInterface from './scenes/userInterface';
import gameScene from './scenes/gameScene';

// game configuration object
const GameConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
  scenes: [gameScene, userInterface]
};

// inherits props from Cheddar
export class Game extends Cheddar.Game {
  constructor(config) {
    super(config);
  }
}

// creates new instance of Game
export const loadGame = () => {
  return new Game(GameConfig);
};
