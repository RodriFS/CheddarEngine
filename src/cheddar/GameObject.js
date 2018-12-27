const Anims = require('./Anims');

class GameObject {
  constructor(gameScene) {
    this.gameScene = gameScene;
    this.x = 0;
    this.y = 0;
    this.z = 5;
    this.type = 'sprite';
    this.width = 0;
    this.height = 0;
    this.scale;
    this.angle = 0;
    this.center = { x: 0, y: 0, z: 0 };
    this.offset = { x: 0, y: 0 };
    this.getPosition = this.getPosition.bind(this);
    this.anims = new Anims(this);
    this.mouseover = null;
    this.border = false;
    this.isDirty = false;
  }

  sprite(name) {
    const {
      width,
      height,
      src,
      scale,
      row,
      column
    } = this.gameScene.load.sprites[name];
    this.image = new Image();
    this.row = row;
    this.column = column;
    this.sx = 0;
    this.sy = 0;
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.offsetx = 0;
    this.offsety = 0;
    this.scale = scale;
    this.src = src;
    this.angle = 0;
    this.sprite = {};
    this.currentSprite = '';
    this.border = false;
    this.isDirty = true;
    this.gameScene.queue.push(this);
    return this;
  }

  getPosition() {
    return {
      x:
        (this.x + this.center.x * this.scale - this.gameScene.camera.x) *
        this.gameScene.camera.zoom,
      y:
        (this.y + this.center.y * this.scale - this.gameScene.camera.y) *
        this.gameScene.camera.zoom,
      width: this.width * this.scale * this.gameScene.camera.zoom,
      height: this.height * this.scale * this.gameScene.camera.zoom,
      angle: this.angle,
      center: this.center,
      offset: this.offset
    };
  }

  translate(x, y) {
    this.x = x;
    this.y = y;
    this.isDirty = true;
    return this;
  }

  rotate(offsetx, offsety, angle) {
    this.center.x = this.center.x + offsetx / this.scale;
    this.center.y = this.center.y + offsety / this.scale;
    this.angle = angle;
    this.isDirty = true;
    return this;
  }

  origin(x, y) {
    this.center.x = -x;
    this.center.y = -y;
    this.isDirty = true;
    return this;
  }

  zindex(z) {
    this.center.z = z;
    this.isDirty = true;
    return this;
  }

  setScale(s) {
    this.scale = this.scale * s;
    this.isDirty = true;
    return this;
  }
}

module.exports = GameObject;
