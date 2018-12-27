import Cheddar from '../cheddar';

export default class userInterface extends Cheddar.Scene {
  constructor(canvas, context) {
    super(canvas, context, { active: true });
  }

  loadAssets() {
    this.width = window.innerWidth / 2;
    this.height = window.innerHeight / 2;
    this.width > this.height
      ? (this.size = window.innerHeight / 2)
      : (this.size = window.innerWidth / 2);

    this.scale = this.size / 4500;
  }

  start() {
    // this.shapes.draw.rectangle(0, 0, 100, 100, 10, 'red').zindex(0);
  }

  update() {}
}
