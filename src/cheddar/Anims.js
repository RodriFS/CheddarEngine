const utils = require('./utils');

class Anims {
  constructor(game) {
    this.game = game;
    this.spriteQueue = [];
  }

  create(sprite) {
    sprite.frames.forEach(frames => {
      let el = this.game.queue.find(
        spr => spr.name === frames.sprite && !this.spriteQueue.includes(spr)
      );
      if (el) {
        let totalFrames = utils.range(frames.frame, sprite.framerate);
        let framesbyFramerate = utils.multiplyByFramerate(
          totalFrames,
          sprite.framerate
        );

        el.sprite = {
          name: sprite.AnimKey,
          frames: [...el.sprite.frames, ...framesbyFramerate],
          framerate: sprite.framerate,
          repeat: sprite.repeat,
          static: true
        };
        this.spriteQueue.push(el);
      }
    });
  }

  play() {
    this.spriteQueue.forEach(frames => {
      frames.sprite.static = false;
    });
  }

  stop() {
    this.spriteQueue.forEach(frames => {
      frames.sprite.static = true;
    });
  }
}

module.exports = Anims;
