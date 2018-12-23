const utils = require('./utils');

class Anims {
  constructor(game) {
    this.game = game;
    this.spriteQueue = [];
  }

  create(sprite) {
    sprite.frames.forEach(frames => {
      console.log(this.game.queue);

      let el = this.game.queue.find(
        spr => spr.name === frames.sprite // && !this.spriteQueue.includes(spr)
      );

      if (el) {
        let totalFrames = utils.range(frames.frame, sprite.framerate);
        let framesbyFramerate = utils.multiplyByFramerate(
          totalFrames,
          sprite.framerate
        );

        // if (el.sprite[sprite.AnimKey]) {
        //   el.sprite[sprite.AnimKey] = {
        //     frames: [...el.sprite[sprite.AnimKey].frames, ...framesbyFramerate],
        //     framerate: sprite.framerate,
        //     repeat: sprite.repeat,
        //     static: true
        //   };
        // } else {
        console.log(this);

        el.sprite[sprite.AnimKey] = {
          frames: [...framesbyFramerate],
          framerate: sprite.framerate,
          repeat: sprite.repeat,
          static: true
          // };
        };

        this.spriteQueue.push(el);
      }
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
