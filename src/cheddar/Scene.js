const Map = require('./Map');
const Shapes = require('./Shapes');
const Load = require('./Load');
const Physics = require('./Physics');

class Scene {
  constructor(canvas, context, options) {
    this.active = options.active;
    this.canvas = canvas;
    this.context = context;
    this.map = new Map(this);
    this.draw = new Shapes(this);
    this.load = new Load(this);
    this.physics = new Physics(this);
    this.queue = [];
    this.dt = 0;
    this.initializeloadAssets();
    this.initializeStarter();
    this.initializeUpdate();
  }

  initializeloadAssets() {
    this.loadAssets();
  }

  initializeStarter() {
    // this.context.globalCompositeOperation = 'destination-over';
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

  renderDonut(el) {
    this.context.save();
    this.context.beginPath();
    this.context.arc(el.centerx, el.centery, el.diameter, 0, 2 * Math.PI);
    this.context.lineWidth = el.thickness;
    this.context.strokeStyle = el.color;
    this.context.closePath();
    this.context.stroke();
  }

  renderSprite(el) {
    this.context.save();
    let position = el.getPosition();
    el.z = position.center.z;
    if (position.angle) {
      this.renderRotation(position);
    }
    this.renderTranslation(position, el);

    let spriteImages = this.getSpriteFrames(el);
    this.context.drawImage(
      el.image,
      spriteImages.sx,
      spriteImages.sy,
      spriteImages.width,
      spriteImages.height,
      position.x,
      position.y,
      el.width * el.scale,
      el.height * el.scale
    );
    el.image.src = el.src;

    this.context.restore();
  }

  getSpriteFrames(el) {
    let currentFrame = this.getCurrentFrame(el.sprite);

    return {
      sx: el.sx,
      sy: el.sy,
      width: el.width,
      height: el.height
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
      position.offset.x + position.x,
      position.offset.y + position.y
    );
    this.context.rotate((position.angle * Math.PI) / 180);
    this.context.translate(
      -position.offset.x - position.x,
      -position.offset.y - position.y
    );
  }

  renderTranslation(position, el) {
    this.context.translate(
      position.center.x * el.scale,
      position.center.y * el.scale
    );
  }
}

module.exports = Scene;
