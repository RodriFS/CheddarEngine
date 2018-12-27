import Cheddar from '../cheddar';
import { loadavg } from 'os';

export default class GameScene extends Cheddar.Scene {
  constructor(canvas, context) {
    super(canvas, context, { active: true });

    this.player;
    this.width;
    this.height;
    this.size;
    this.increment;
    this.reel;
    this.scale;
    this.button;
    this.cameraPosition;
    this.speed;

    // this.odds = {
    //   0: { name: 'diamond', odds: 16 },
    //   1: { name: 'orange', odds: 1 },
    //   2: { name: 'seven', odds: 7 },
    //   3: { name: 'horseshoe', odds: 1 },
    //   4: { name: 'plum', odds: 1 },
    //   5: { name: 'watermelon', odds: 1 },
    //   6: { name: 'dollar-sack', odds: 4 },
    //   7: { name: 'dollar-pack', odds: 8 },
    //   8: { name: 'clover', odds: 5 },
    //   9: { name: 'gold-bars', odds: 12 },
    //   10: { name: 'cherries', odds: 2 },
    //   11: { name: 'apple', odds: 1 },
    //   12: { name: 'bananas', odds: 1 },
    //   13: { name: 'strawberry', odds: 1 },
    //   14: { name: 'lemon', odds: 1 },
    //   15: { name: 'bell', odds: 15 },
    //   16: { name: 'grapes', odds: 1 },
    //   17: { name: 'coin', odds: 1 },
    //   18: { name: 'bar', odds: 10 },
    //   19: { name: 'heart', odds: 8 }
    // };
  }

  loadAssets() {
    this.width = window.innerWidth / 2;
    this.height = window.innerHeight / 2;
    this.width > this.height
      ? (this.size = window.innerHeight / 2)
      : (this.size = window.innerWidth / 2);

    this.scale = this.size / 4500;
    this.load.spritesheet('slotElements', 4, 10, 250, 250, this.scale);
    this.increment = [0, 0, 0, 0, 0];
    this.speed = [0, 0, 0, 0, 0];
  }

  start() {
    // -this.size / 1.25
    this.cameraPosition = this.camera.position(-this.size / 1.25, 0, 4);

    this.reel = this.drawReelSymbols(5, 30, 'slotElements'); //60, 66

    this.map.backgroundColor('lightblue');

    this.drawReelBackground(this.size / 15, [
      '#AE37D9',
      '#F6E652',
      '#7AE0C3',
      '#EC5783',
      '#5690DD'
    ]);

    this.button = this.physics.add
      .sprite('slotElements')
      .translate(this.camera.x, this.camera.y);

    this.button.border = true;

    this.button.anims.create({
      AnimKey: 'Button',
      frames: [{ sprite: 'slotElements', frame: 0 }], // 0 indexed
      framerate: 10,
      repeat: true
    });
    this.button.anims.play('Button');

    this.selectRandomSymbol(this.reel);

    this.drawPayLine(
      this.width - this.size + this.size / 30,
      this.height - (this.size * 3) / 30,
      this.size / 15,
      this.size / 15,
      2,
      'black',
      5,
      3
    );

    this.input.on(
      'click',
      () => {
        this.speed = [0.05, 0.05, 0.05, 0.05, 0.05];
        this.reel.forEach((reel, i) => {
          setTimeout(() => {
            this.speed[i] = 0;
            let snap = (Math.PI * 2) / this.reel[i].length;
            this.increment[i] += (-this.increment[i] % snap) - snap;
          }, 2000 + Math.random() * 1000 + i * 1000);
        });
      },
      this.button
    );
  }

  update() {
    this.moveReel(this.reel);
    this.increment.forEach((inc, i) => {
      if (this.speed[i] === 0) {
        this.increment[i] += 0;
      } else {
        this.increment[i] -= this.speed[i];
      }
    });
  }

  drawPayLine(x1, y1, x2, y2, thickness, color, columns, rows) {
    Array(columns)
      .fill(0)
      .forEach((c, i) => {
        Array(rows)
          .fill(0)
          .forEach((r, j) => {
            this.shapes.draw
              .rectangle(x1 + x2 * i, y1 + y2 * j, x2, y2, thickness, color)
              .zindex(10);
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
    let thickness = this.size / 15;
    let reels = Array(reelsNumber)
      .fill(0)
      .map((n, i) => {
        let symbolPerDiameter =
          (2 * Math.PI * (this.size - thickness * (i + 1))) / this.scale / 290;
        return Math.floor(symbolPerDiameter);
      });
    let reelArray = [];

    //modify reels so it snaps to grid
    reels[3] += 1;
    reels[2] += 1;

    reels.reverse().forEach((reel, i) => {
      let symbolArray = [];
      Array(reel)
        .fill(0)
        .forEach(symbol => {
          symbolArray.push(
            this.physics.add
              .sprite(spriteName)
              .origin(125, 125)
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
            {
              sprite: 'slotElements',
              frame: Math.floor(Math.random() * 20)
            }
          ], // 0 indexed
          framerate: 10,
          repeat: true
        });
        symbol.anims.play('reel');
      });
    });
  }

  moveReel(reelsArray) {
    let snap = 0;

    reelsArray.forEach((reel, i) => {
      // ring displacement
      let ring = 15 / (i + 10);
      reel.forEach(symbol => {
        // inside ring spacing
        snap += (Math.PI * 2) / reel.length;
        let x =
          this.width + (Math.cos(this.increment[i] + snap) * this.size) / ring;
        let y =
          this.height + (Math.sin(this.increment[i] + snap) * this.size) / ring;
        symbol.translate(x, y);
      });
    });
  }
}
