const utils = require('./utils');

//this class creates animation of the gameObjects
class Anims {
  constructor(gameObject) {
    this.gameObject = gameObject;
    this.spriteQueue = [];
  }

  //creates one or more queues of sprites that are rendered each frame,
  create(sprite) {
    sprite.frames.forEach(frames => {
      let totalFrames = utils.range(frames.frame);
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

  //plays the queue indicated, for example: "left" queue
  play(name) {
    this.spriteQueue.forEach(frames => {
      frames.currentSprite = name;
    });
  }

  //stops the animation
  stop() {
    this.spriteQueue.forEach(frames => {
      frames.currentSprite = '';
    });
  }
}

module.exports = Anims;
