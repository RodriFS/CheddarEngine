class GameConfig {
  constructor(config) {
    this.width = config.width || 1000;
    this.height = config.height || 1000;
    this.scenes = [...config.scenes];
  }
}

class Scene {
  constructor(game) {
    this.loadScenes = this.loadScenes.bind(game);
  }

  loadScenes() {
    this.config.scenes.forEach(scene => {
      const instance = new scene();
      instance.loadAssets.call(this);
      instance.start.call(this);
    });
  }
}

class Map {
  constructor(game) {
    this.backgroundColor = this.backgroundColor.bind(game);
  }

  backgroundColor(color) {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

class Shapes {
  constructor(game) {
    this.donut = this.donut.bind(game);
  }

  donut(centerx, centery, diameter, thickness, color) {
    this.context.beginPath();
    this.context.arc(centerx, centery, diameter, thickness, 2 * Math.PI);
    this.context.lineWidth = 20;
    this.context.strokeStyle = color;
    this.context.closePath();
    this.context.stroke();
  }
}

class Game {
  constructor(config) {
    this.config = new GameConfig(config);
    this.context = null;
    this.canvas = null;
    this.scene = new Scene(this);
    this.map = new Map(this);
    this.draw = new Shapes(this);
    this.createCanvas();
    this.scene.loadScenes();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');

    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    // canvas.style.width = window.innerWidth / 2 + 'px';
    // canvas.style.height = window.innerHeight / 2 + 'px';
    document.body.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
  }
}
module.exports = { GameConfig, Game, Scene };
