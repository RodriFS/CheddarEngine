import Cheddar from '../cheddar';

export default class GameScene extends Cheddar.Scene {
  constructor(canvas, context) {
    super(canvas, context, { active: true });

    this.player;
  }

  loadAssets() {
    this.load.spritesheet('slotElements', 4, 5, 250, 250, 0.5);
  }

  start() {
    this.player = this.physics.add.sprite('slotElements');
    console.log(this.player);

    this.map.backgroundColor('lightblue');
    this.draw.donut(300, 300, 180, 20, '#AE37D9');
    this.draw.donut(300, 300, 160, 20, '#F6E652');
    this.draw.donut(300, 300, 140, 20, '#7AE0C3');
    this.draw.donut(300, 300, 120, 20, '#EC5783');
    this.draw.donut(300, 300, 100, 20, '#5690DD');

    this.player.anims.create({
      AnimKey: 'left',
      frames: [{ sprite: 'slotElements', frame: [0, 19] }], // 0 indexed
      framerate: 2,
      repeat: true
    });
  }

  update() {
    // this.player.anims.play();
    this.player.origin(250, 250).zindex(5);
    this.player.translate(300, 300);
    this.player.rotate(140, 0, this.player.angle + 1);
  }
}
