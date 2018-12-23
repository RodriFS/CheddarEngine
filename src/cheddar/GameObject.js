const Anims = require('./Anims');

class GameObject {
  constructor(game) {
    this.game = game;
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
    this.anims = new Anims(game);
    this.render;
  }

  sprite(name) {
    const { width, height, src, scale, row, column } = this.game.load.sprites[
      name
    ];
    this.width = width;
    this.height = height;
    this.scale = scale;

    let properties = {
      name,
      type: 'sprite',
      image: new Image(),
      row,
      column,
      sx: 0,
      sy: 0,
      width,
      height,
      x: 0,
      y: 0,
      z: 0,
      offsetx: 0,
      offsety: 0,
      scale,
      src,
      angle: 0,
      sprite: {},
      currentSprite: '',
      getPosition: this.getPosition
    };
    this.game.queue.push(properties);
    return this;
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y,
      angle: this.angle,
      center: this.center,
      offset: this.offset
    };
  }

  translate(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  rotate(offsetx, offsety, angle) {
    this.center.x = this.center.x + offsetx / this.scale;
    this.center.y = this.center.y + offsety / this.scale;
    this.angle = angle;
    return this;
  }

  origin(x, y) {
    this.center.x = -x / 2;
    this.center.y = -y / 2;
    return this;
  }

  zindex(z) {
    this.center.z = z;
    return this;
  }
}

module.exports = GameObject;
