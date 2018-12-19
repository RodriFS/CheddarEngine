class GameObject {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.getPosition = this.getPosition.bind(this);
  }

  sprite(name) {
    const { width, height, src, scale } = this.game.load.sprites[name];
    this.game.queue.push({
      name,
      type: 'image',
      image: new Image(),
      sx: 0,
      sy: 0,
      width,
      height,
      x: 0,
      y: 0,
      z: 0,
      scale,
      src,
      getPosition: this.getPosition
    });

    return this;
  }

  getPosition() {
    // console.log(this.x, this.y);

    return { x: this.x, y: this.y };
  }

  translate(x, y) {
    // console.log(this.x, this.y);

    this.x = this.x + x;
    this.y = this.y + y;
  }
}

module.exports = GameObject;
