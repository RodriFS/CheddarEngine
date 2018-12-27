const utils = require('./utils');

class Anims {
  constructor(gameObject) {
    this.gameObject = gameObject;
    this.spriteQueue = [];
  }

  create(sprite) {
    sprite.frames.forEach(frames => {
      let totalFrames = utils.range(frames.frame, sprite.framerate);
      let framesbyFramerate = utils.multiplyByFramerate(
        totalFrames,
        sprite.framerate
      );

      this.gameObject.sprite[sprite.AnimKey] = {
        frames: [...framesbyFramerate],
        framerate: sprite.framerate,
        repeat: sprite.repeat,
        static: true
      };
      this.gameObject.isDirty = true;
      this.spriteQueue.push(this.gameObject);
    });
  }

  play(name) {
    this.spriteQueue.forEach(frames => {
      frames.currentSprite = name;
    });
  }

  stop() {
    this.spriteQueue.forEach(frames => {
      frames.currentSprite = '';
    });
  }
}

module.exports = Anims;
