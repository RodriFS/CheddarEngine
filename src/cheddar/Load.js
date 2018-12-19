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

module.exports = Load;
