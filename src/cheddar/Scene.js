const Map = require('./Map');
const Shapes = require('./Shapes');
const Load = require('./Load');
const GameObject = require('./GameObject');
const Camera = require('./Camera');
const Input = require('./Input');
const Audio = require('./Audio');
const Text = require('./Text');

// this class renders the whole scene
class Scene {
  constructor(canvas, context, events, options) {
    this.active = options.active;
    this.canvas = canvas;
    this.context = context;
    this.events = events;
    this.map = new Map(this);
    this.load = new Load();
    this.audio = new Audio(this);
    this.camera = new Camera(this);
    this.input = new Input(this);
    this.physics = this.physics();
    this.shapes = this.shapes();
    this.text = this.text();
    this.queue = [];
    this.dt = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseCoordinatesEvent();
    this.initializeloadAssets();
    this.initializeStarter();
    this.initializeUpdate();
  }

  // gets a new instance of GameObject
  physics() {
    let self = this;
    return {
      get add() {
        return new GameObject(self);
      }
    };
  }

  // gets a new instance of a Shape
  shapes() {
    let self = this;
    return {
      get draw() {
        return new Shapes(self);
      }
    };
  }

  // gets a new instance of a Text
  text() {
    let self = this;
    return {
      get write() {
        return new Text(self);
      }
    };
  }

  // listens to every mouse movement
  mouseCoordinatesEvent() {
    let canvasPos = this.canvas.getBoundingClientRect();
    this.canvas.addEventListener(
      'mousemove',
      event => {
        this.mouseX = event.clientX - canvasPos.left;
        this.mouseY = event.clientY - canvasPos.top;
      },
      false
    );
  }

  // initializes the loadAssets method. the order of the next
  // three functions prevents that the user calls the methods
  // in a different order in his gameScenes
  initializeloadAssets() {
    this.loadAssets();
  }

  //this is for creating assets after loading them in memory in the
  // previous function
  initializeStarter() {
    this.start();
  }

  // controls frame speed and calls render method
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

  // renders every object in rendering queue
  render() {
    this.context.save();

    this.queue
      .sort((a, b) => a.z - b.z)
      .filter(el => !el.hidden)
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
          case 'text':
            this.renderText(el);
            break;
          default:
            break;
        }
      });
    this.context.restore();
  }

  // renders background color
  renderbackgroundColor(el) {
    this.context.fillStyle = el.color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // renders a canvas rectangle
  renderRectangle(el) {
    if (el.thickness === false) {
      this.context.fillStyle = el.color;
      this.context.fillRect(
        (el.x1 - this.camera.x) * this.camera.zoom,
        (el.y1 - this.camera.y) * this.camera.zoom,
        el.x2 * this.camera.zoom,
        el.y2 * this.camera.zoom
      );
    } else {
      this.context.strokeStyle = el.color;
      this.context.lineWidth = el.thickness * this.camera.zoom;
      this.context.strokeRect(
        (el.x1 - this.camera.x) * this.camera.zoom,
        (el.y1 - this.camera.y) * this.camera.zoom,
        el.x2 * this.camera.zoom,
        el.y2 * this.camera.zoom
      );
    }
  }

  // renders a canvas donuts
  renderDonut(el) {
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

  // renders a canvas image
  renderSprite(el) {
    this.context.save();
    let position = el.getPosition();

    el.z = position.center.z;
    if (position.angle) {
      this.renderRotation(position);
    }
    // this.renderTranslation(position, el);

    let spriteImages = this.getSpriteFrames(el);
    this.context.drawImage(
      el.image,
      spriteImages.sx,
      spriteImages.sy,
      el.width,
      el.height,
      position.x,
      position.y,
      position.width,
      position.height
    );
    el.image.src = el.src;

    if (el.border) {
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 1;
      this.context.strokeRect(
        position.x,
        position.y,
        position.width,
        position.height
      );
    }
  }

  // render a canvas text
  renderText(el) {
    this.context.font = el.font;
    this.context.fillStyle = el.color;
    this.context.textBaseline = el.textBaseline;
    this.context.direction = el.direction;
    this.context.textAlign = el.textAlign;
    this.context.fillText(el.text, el.x, el.y, el.maxWidth);
  }

  // gets the position of current image that has to render in the current frame
  // if there is no current sprite, it renders the first sprite
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

  // gets the current frame and pushes the last frame to the end of the frame queue
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

  // renders rotation of sprites
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

  // renders movement of sprites
  renderTranslation(position, el) {
    this.context.translate(
      position.center.x * el.scale * this.camera.zoom,
      position.center.y * el.scale * this.camera.zoom
    );
  }
}

module.exports = Scene;
