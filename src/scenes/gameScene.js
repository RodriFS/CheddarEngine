import Cheddar from '../cheddar';

export default class gameScene extends Cheddar.Scene {
  loadAssets() {
    this.load.spritesheet('slotElements', 4, 5, 250, 250, 1);
  }

  start() {
    const player = this.physics.add.sprite('slotElements');

    this.map.backgroundColor('lightblue');
    this.draw.donut(300, 300, 180, 0, '#AE37D9');
    this.draw.donut(300, 300, 160, 0, '#F6E652');
    this.draw.donut(300, 300, 140, 0, '#7AE0C3');
    this.draw.donut(300, 300, 120, 0, '#EC5783');
    this.draw.donut(300, 300, 100, 0, '#5690DD');
  }

  update() {
    console.log('60fps!');
  }
}
