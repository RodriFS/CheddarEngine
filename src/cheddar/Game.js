const GameConfig = require('./GameConfig');

class Game {
  constructor(config) {
    this.config = new GameConfig(config);
    this.context = null;
    this.canvas = null;
    this.createCanvas();
    this.scenes = this.loadScenes();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    document.body.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
  }

  loadScenes() {
    const instance = [];
    this.config.scenes.forEach(scene => {
      instance.push(new scene(this.canvas, this.context));
    });
    return instance;
  }
}

module.exports = Game;
