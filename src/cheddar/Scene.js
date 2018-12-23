const Map = require('./Map');
const Shapes = require('./Shapes');
const Load = require('./Load');
const GameObject = require('./GameObject');
const Camera = require('./Camera');

class Scene {
  constructor(canvas, context, options) {
    this.active = options.active;
    this.canvas = canvas;
    this.context = context;
    this.map = new Map(this);
    this.load = new Load();
    this.camera = new Camera(this);
    this.physics = this.physics();
    this.shapes = this.shapes();
    this.queue = [];
    this.dt = 0;
    this.initializeloadAssets();
    this.initializeStarter();
    this.initializeUpdate();
  }

  physics() {
    let self = this;
    return {
      get add() {
        return new GameObject(self);
      }
    };
  }
  shapes() {
    let self = this;
    return {
      get draw() {
        return new Shapes(self);
      }
    };
  }

  initializeloadAssets() {
    this.loadAssets();
  }

  initializeStarter() {
    this.start();
  }

  initializeUpdate() {
    const requestAnimFrame = (function() {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();

    let lastTime;
    let main = () => {
      let now = Date.now();
      let dt = (now - lastTime) / 1000.0;

      if (this.active) {
        this.update(dt);
        this.render(dt);
        this.dt = dt;
      }

      lastTime = now;
      requestAnimFrame(main);
    };
    main();
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.queue
      .sort((a, b) => a.z - b.z)
      .forEach(el => {
        switch (el.type) {
          case 'backgroundColor':
            this.renderbackgroundColor(el);
            break;
          case 'donut':
            this.renderDonut(el);
            break;
          case 'rectangle':
            this.renderRectangle(el);
            break;
          case 'sprite':
            this.renderSprite(el);
            break;
          default:
            break;
        }
      });
  }

  renderbackgroundColor(el) {
    this.context.save();
    this.context.fillStyle = el.color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderRectangle(el) {
    this.context.save();
    this.context.strokeStyle = el.color;
    this.context.lineWidth = el.thickness * this.camera.zoom;
    this.context.strokeRect(
      (el.x1 - this.camera.x) * this.camera.zoom,
      (el.y1 - this.camera.y) * this.camera.zoom,
      el.x2 * this.camera.zoom,
      el.y2 * this.camera.zoom
    );
    this.context.restore();
  }

  renderDonut(el) {
    this.context.save();
    this.context.beginPath();
    this.context.arc(
      (el.centerx - this.camera.x) * this.camera.zoom,
      (el.centery - this.camera.y) * this.camera.zoom,
      el.diameter * this.camera.zoom,
      0,
      2 * Math.PI
    );
    this.context.lineWidth = el.thickness * this.camera.zoom;
    this.context.strokeStyle = el.color;
    this.context.closePath();
    this.context.stroke();
  }

  renderSprite(el) {
    this.context.save();
    let position = el.getPosition();

    el.z = position.center.z * this.camera.zoom;
    if (position.angle) {
      this.renderRotation(position);
    }
    this.renderTranslation(position, el);

    let spriteImages = this.getSpriteFrames(el);
    this.context.drawImage(
      el.image,
      spriteImages.sx,
      spriteImages.sy,
      el.width,
      el.height,
      (position.x - this.camera.x) * this.camera.zoom,
      (position.y - this.camera.y) * this.camera.zoom,
      el.width * el.scale * this.camera.zoom,
      el.height * el.scale * this.camera.zoom
    );
    el.image.src = el.src;

    this.context.restore();
  }

  getSpriteFrames(el) {
    let currentFrame = el.currentSprite.length
      ? this.getCurrentFrame(el.sprite[el.currentSprite])
      : 0;
    let row = Math.trunc((currentFrame + 1) / el.column - 0.01);
    let column = currentFrame % el.column;
    return {
      sx: el.sx + column * el.width,
      sy: el.sy + row * el.height
    };
  }

  getCurrentFrame(sprite) {
    let lastFrame = sprite.frames.length - 1;
    let currentFrame = sprite.frames.shift();

    if (sprite.repeat) {
      sprite.frames.push(currentFrame);
    } else {
      sprite.frames.push(lastFrame);
    }
    return sprite.frames[0];
  }

  renderRotation(position) {
    this.context.translate(
      position.offset.x * this.camera.zoom + position.x * this.camera.zoom,
      position.offset.y * this.camera.zoom + position.y * this.camera.zoom
    );
    this.context.rotate((position.angle * Math.PI) / 180);
    this.context.translate(
      -position.offset.x * this.camera.zoom - position.x * this.camera.zoom,
      -position.offset.y * this.camera.zoom - position.y * this.camera.zoom
    );
  }

  renderTranslation(position, el) {
    this.context.translate(
      position.center.x * el.scale * this.camera.zoom,
      position.center.y * el.scale * this.camera.zoom
    );
  }
}

module.exports = Scene;
