// this class loads assets into memory
class Load {
  constructor() {
    this.sprites = {};
    this.audios = {};
  }

  // loads a spritesheet in the memory
  // this method should be called only inside the loadAssets method
  spritesheet(name, column, row, width, height, scale) {
    this.sprites[name] = {};
    this.sprites[name].src = require('../../assets/' + name + '.png');
    this.sprites[name].column = column;
    this.sprites[name].row = row;
    this.sprites[name].width = width;
    this.sprites[name].height = height;
    this.sprites[name].scale = scale;
  }

  // loads an audio in the memory
  // this method should be called only inside the loadAssets method
  audio(name, format) {
    this.audios[name] = {};
    switch (format) {
      case 'wav':
        this.audios[name].src = require('../../assets/' + name + '.wav');
        break;
      case 'mp3':
        this.audios[name].src = require('../../assets/' + name + '.mp3');
        break;
    }
    this.audios[name].audio = new Audio(this.audios[name].src);
  }
}

module.exports = Load;
