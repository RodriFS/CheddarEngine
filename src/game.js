import Cheddar from './cheddar';
import gameScene from './scenes/gameScene';

const GameConfig = {
  width: window.innerWidth,
  height: window.innerHeight,
  scenes: [gameScene]
};

export class Game extends Cheddar.Game {
  constructor(config) {
    super(config);
  }
}

export const loadGame = () => {
  return new Game(GameConfig);
};
