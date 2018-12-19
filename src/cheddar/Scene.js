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
    this.scale = 100;
    this.queue = [];
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
    var requestAnimFrame = (function() {
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

    var lastTime;
    let main = () => {
      var now = Date.now();
      var dt = (now - lastTime) / 1000.0;

      if (this.active) {
        this.update(dt);
        this.render(dt);
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
            this.context.fillStyle = el.color;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            break;
          case 'image':
            let position = el.getPosition();
            this.context.drawImage(
              el.image,
              el.sx,
              el.sy,
              el.width,
              el.height,
              position.x,
              position.y,
              el.scale * this.scale,
              el.scale * this.scale
            );
            el.image.src = el.src;
            break;
          default:
            break;
        }
      });
  }
}

module.exports = Scene;
