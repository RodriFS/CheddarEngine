import Cheddar from '../cheddar';

export default class GameScene extends Cheddar.Scene {
  constructor(canvas, context) {
    super(canvas, context, { active: true });

    this.player;
    this.width;
    this.height;
    this.size;
    this.increment = 0;
    this.reel;
    this.scale;
  }

  loadAssets() {
    this.width = window.innerWidth / 2;
    this.height = window.innerHeight / 2;
    this.width > this.height
      ? (this.size = window.innerHeight / 2)
      : (this.size = window.innerWidth / 2);

    this.scale = this.size / 2800;
    this.load.spritesheet('slotElements', 4, 5, 250, 250, this.scale);
  }

  start() {
    this.reel = this.drawReelSymbols(5, 24, 'slotElements');

    this.map.backgroundColor('lightblue');

    this.drawReelBackground(this.size / 10, [
      '#AE37D9',
      '#F6E652',
      '#7AE0C3',
      '#EC5783',
      '#5690DD'
    ]);

    this.selectRandomSymbol(this.reel);
    this.drawPayLine(
      this.width - this.size + this.size / 20,
      this.height - (this.size * 3) / 20,
      this.size / 10,
      this.size / 10,
      2,
      'black',
      5,
      3
    );

    //-this.size / 2
    this.camera.position(0, 0, 1);
  }

  update() {
    this.moveReel(this.reel);
    this.increment -= 0.0;
  }

  drawPayLine(x1, y1, x2, y2, thickness, color, columns, rows) {
    Array(columns)
      .fill(0)
      .forEach((c, i) => {
        Array(rows)
          .fill(0)
          .forEach((r, j) => {
            this.shapes.draw.rectangle(
              x1 + x2 * i,
              y1 + y2 * j,
              x2,
              y2,
              thickness,
              color
            );
          });
      });
  }

  drawReelBackground(thickness, colors) {
    Array(colors.length)
      .fill(0)
      .forEach((n, i) => {
        this.shapes.draw.donut(
          this.width,
          this.height,
          this.size - thickness * (i + 1),
          thickness,
          colors[i]
        );
      });
  }

  drawReelSymbols(reelsNumber, symbolPerReel, spriteName) {
    let reelArray = [];
    let offset = 0;
    Array(reelsNumber)
      .fill(0)
      .forEach(reel => {
        offset += 6;
        let symbolArray = [];
        Array(symbolPerReel + offset)
          .fill(0)
          .forEach(symbol => {
            symbolArray.push(
              this.physics.add
                .sprite(spriteName)
                .origin(250, 250)
                .zindex(5)
            );
          });
        reelArray.push(symbolArray);
      });
    return reelArray;
  }

  selectRandomSymbol(reelsArray) {
    reelsArray.forEach(reel => {
      reel.forEach(symbol => {
        symbol.anims.create({
          AnimKey: 'reel',
          frames: [
            { sprite: 'slotElements', frame: Math.floor(Math.random() * 20) }
          ], // 0 indexed
          framerate: 10,
          repeat: true
        });
        symbol.anims.play('reel');
      });
    });
  }

  moveReel(reelsArray) {
    let offset = 0;
    reelsArray.forEach((reel, i) => {
      let ring = 10 / (i + 5);
      reel.forEach(symbol => {
        // offset +=  //change this number for aligning in payline
        offset += (Math.PI * 2) / reel.length;
        let x =
          this.width + (Math.cos(this.increment + offset) * this.size) / ring;
        let y =
          this.height + (Math.sin(this.increment + offset) * this.size) / ring;
        symbol.translate(x, y);
      });
    });
  }
}
