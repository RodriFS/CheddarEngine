const Map = require('./Map');
const Shapes = require('./Shapes');
const Load = require('./Load');
const Physics = require('./Physics');
const Anims = require('./Anims');

class Scene {
  constructor(canvas, context, options) {
    this.active = options.active;
    this.canvas = canvas;
    this.context = context;
    this.map = new Map(this);
    this.draw = new Shapes(this);
    this.load = new Load(this);
    this.physics = new Physics(this);
    this.anims = new Anims(this);
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
            this.context.save();
            this.context.fillStyle = el.color;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            break;
          case 'donut':
            this.context.save();
            this.context.beginPath();
            this.context.arc(
              el.centerx,
              el.centery,
              el.diameter,
              0,
              2 * Math.PI
            );
            this.context.lineWidth = el.thickness;
            this.context.strokeStyle = el.color;
            this.context.closePath();
            this.context.stroke();
            break;
          case 'image':
            this.context.save();
            let position = el.getPosition();
            el.z = position.center.z;
            if (position.angle) {
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
            this.context.translate(
              position.center.x * el.scale,
              position.center.y * el.scale
            );

            this.context.drawImage(
              el.image,
              el.sx,
              el.sy,
              el.width,
              el.height,
              position.x,
              position.y,
              el.width * el.scale,
              el.height * el.scale
            );
            el.image.src = el.src;

            this.context.restore();
            break;
          default:
            break;
        }
      });
  }
}

module.exports = Scene;
