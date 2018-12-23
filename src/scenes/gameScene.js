import Cheddar from '../cheddar';

export default class GameScene extends Cheddar.Scene {
  constructor(canvas, context) {
    super(canvas, context, { active: true });

    this.player;
    this.width;
    this.height;
    this.size;
    this.increment = 0;
  }

  loadAssets() {
    this.width = window.innerWidth / 2;
    this.height = window.innerHeight / 2;
    window.innerWidth > window.innerHeight
      ? (this.size = window.innerHeight / 2)
      : (this.size = window.innerWidth / 2);
    this.load.spritesheet('slotElements', 4, 5, 250, 250, this.size / 2000);
  }

  start() {
    this.player = this.physics.add.sprite('slotElements');
    this.player2 = this.physics.add.sprite('slotElements');

    let thickness = this.size / 10;

    this.map.backgroundColor('lightblue');
    this.draw.donut(
      this.width,
      this.height,
      this.size - thickness,
      thickness,
      '#AE37D9'
    );
    this.draw.donut(
      this.width,
      this.height,
      this.size - thickness * 2,
      thickness,
      '#F6E652'
    );
    this.draw.donut(
      this.width,
      this.height,
      this.size - thickness * 3,
      thickness,
      '#7AE0C3'
    );
    this.draw.donut(
      this.width,
      this.height,
      this.size - thickness * 4,
      thickness,
      '#EC5783'
    );
    this.draw.donut(
      this.width,
      this.height,
      this.size - thickness * 5,
      thickness,
      '#5690DD'
    );

    this.player.anims.create({
      AnimKey: 'left',
      frames: [{ sprite: 'slotElements', frame: 1 }], // 0 indexed
      framerate: 10,
      repeat: true
    });

    this.player2.anims.create({
      AnimKey: 'left',
      frames: [{ sprite: 'slotElements', frame: 2 }], // 0 indexed
      framerate: 10,
      repeat: true
    });

    console.log(this.player === this.player2);
  }

  update() {
    this.player.anims.play('left');
    this.player.origin(250, 250).zindex(5);
    this.player.translate(
      this.width + (Math.cos(this.increment) * this.size) / 2,
      this.height + (Math.sin(this.increment) * this.size) / 2
    );

    this.player2.anims.play('left');
    this.player2.origin(250, 250).zindex(5);
    this.player2.translate(
      this.width + (Math.cos(this.increment) * this.size) / 3,
      this.height + (Math.sin(this.increment) * this.size) / 3
    );

    this.increment -= 0.01;
  }
}
