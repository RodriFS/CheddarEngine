const Events = require('./Events');

// this class initializes the whole canvas
class Game {
  constructor(config) {
    this.config = config;
    this.events = new Events();
    this.context = null;
    this.canvas = null;
    this.createCanvasContext();
    this.scenes = this.loadScenes();
  }

  // creates a canvas and a 2D context
  createCanvasContext() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    document.body.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
  }

  // creates an instance for each scene in GameConfig object
  loadScenes() {
    const instance = [];
    this.config.scenes.forEach(scene => {
      instance.push(new scene(this.canvas, this.context, this.events));
    });
    return instance;
  }
}

module.exports = Game;
