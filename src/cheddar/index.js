class GameConfig {
  constructor(config) {
    this.width = config.width || 1000;
    this.height = config.height || 1000;
    this.scenes = [...config.scenes];
  }
}

class Load {
  constructor() {
    this.sprites = {};
  }

  spritesheet(name, column, row, width, height, scale) {
    this.sprites[name] = {};
    this.sprites[name].src = require('../../assets/' + name + '.png');
    this.sprites[name].column = column;
    this.sprites[name].row = row;
    this.sprites[name].width = width;
    this.sprites[name].height = height;
    this.sprites[name].scale = scale;
  }
}

class Scene {
  constructor(game) {
    this.loadScenes = this.loadScenes.bind(game);
    this.lastTime;
    this.main = this.main.bind(this);
    this.requestAnimFrame = this.requestAnimFrame.bind(this);
  }

  loadScenes() {
    this.config.scenes.forEach(scene => {
      const instance = new scene();
      instance.loadAssets.call(this);
      instance.start.call(this);
      this.scene.main.call(this, instance);
    });
  }

  requestAnimFrame() {
    console.log('request');

    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      (function(callback) {
        window.setTimeout(callback, 1000 / 60);
      })()
    );
  }

  main() {
    var self = this;
    var now = Date.now();
    var dt = (now - this.lastTime) / 1000.0;

    this.lastTime = now;
    this.requestAnimFrame(() => this.main());
  }
}

class GameObject {
  constructor(game) {
    this.gameObject = {
      x: 0,
      y: 0
    };
    this.sprite = this.sprite.bind(game, this.gameObject);
  }

  sprite() {
    const gameObject = arguments[0];
    const name = arguments[1];

    const { width, height, src, scale } = this.load.sprites[name];
    const image = new Image();

    gameObject.sprite = {
      image,
      sx: 0,
      sy: 0,
      width,
      height,
      x: gameObject.x,
      y: gameObject.y,
      scale: 100 * scale
    };

    image.onload = () => {
      this.context.drawImage(...Object.values(gameObject.sprite), 100 * scale);
    };
    image.src = src;
    return gameObject;
  }
}

class Physics {
  constructor(game) {
    this.add = new GameObject(game);
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
    this.load = new Load(this);
    this.physics = new Physics(this);
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
