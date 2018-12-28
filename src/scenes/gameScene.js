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
    this.slow;
    this.odds;
    this.rng;
    this.randomNumber;
    this.symbolsLineup;
    this.currentPayline;
  }

  loadAssets() {
    this.width = window.innerWidth / 2;
    this.height = window.innerHeight / 2;
    this.width > this.height
      ? (this.size = window.innerHeight / 2)
      : (this.size = window.innerWidth / 2);

    this.scale = this.size / 4500;
    this.load.spritesheet('slotElements', 4, 10, 250, 250, this.scale);
  }

  start() {
    this.increment = [0, 0, 0, 0, 0];
    this.speed = [0, 0, 0, 0, 0];
    this.slow = [0, 0, 0, 0, 0];
    this.winner = [];
    this.odds = {
      0: { name: 'diamond', odds: 1 },
      1: { name: 'orange', odds: 8 },
      2: { name: 'seven', odds: 2 },
      3: { name: 'horseshoe', odds: 7 },
      4: { name: 'plum', odds: 9 },
      5: { name: 'watermelon', odds: 9 },
      6: { name: 'dollar-sack', odds: 4 },
      7: { name: 'dollar-pack', odds: 5 },
      8: { name: 'clover', odds: 6 },
      9: { name: 'gold-bars', odds: 3 },
      10: { name: 'cherries', odds: 9 },
      11: { name: 'apple', odds: 9 },
      12: { name: 'bananas', odds: 9 },
      13: { name: 'strawberry', odds: 9 },
      14: { name: 'lemon', odds: 9 },
      15: { name: 'bell', odds: 7 },
      16: { name: 'grapes', odds: 8 },
      17: { name: 'coin', odds: 8 },
      18: { name: 'bar', odds: 1 },
      19: { name: 'heart', odds: 5 }
    };

    this.cameraPosition = this.camera.position(-this.size / 1.25, 0, 4);

    this.reel = this.drawReelSymbols(5, 'slotElements');

    this.map.backgroundColor('lightblue');

    this.drawReelBackground(this.size / 15, [
      '#AE37D9',
      '#F6E652',
      '#7AE0C3',
      '#EC5783',
      '#5690DD'
    ]);

    this.selectSymbol(this.reel);

    this.getsymbolsLineup();

    this.createButton();

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
        this.stopMotion();
      },
      this.button
    );
  }

  update() {
    this.getCurrentPayline();

    this.moveReel(this.reel);

    this.increment.forEach((inc, i) => {
      // acceleration of the wheel
      if (!this.slow[i] && this.speed[i] < 0.1) this.speed[i] *= 1.05;

      // selection of the payline
      if (this.speed[i] < 0.01) {
        let snap = (Math.PI * 2) / this.reel[i].length;

        if (
          -this.increment[i] % snap < 0.002 &&
          this.currentPayline[i] === this.winner[i]
        ) {
          this.speed[i] = 0;
          this.increment[i] += 0;
        }
      }
      // deacceleration of the wheel
      if (this.slow[i] && this.speed[i] > 0.001) this.speed[i] *= 0.95;

      //continuous movement
      if (this.speed[i]) this.increment[i] -= this.speed[i];

      // random number generator
      this.rng();
    });
  }

  getCurrentPayline() {
    let payline = {
      x1: this.width,
      y1: this.height - (this.size * 3) / 30 + this.size / 15,
      y2: this.height - (this.size * 3) / 30 + (this.size / 15) * 2
    };
    this.currentPayline = this.reel
      .flat()
      .filter(el => el.y > payline.y1 && el.y < payline.y2 && el.x < this.width)
      .map(el => el.sprite.reel.frames[0]);
  }

  rng() {
    this.randomNumber = Math.floor(Math.random() * 100000000);
  }

  selectWinner() {
    let random = this.randomNumber;
    return this.symbolsLineup[random % 128];
  }

  stopMotion() {
    this.speed = [0.005, 0.005, 0.005, 0.005, 0.005];
    this.cameraPosition.position(0, 0, 1);
    this.reel.forEach((reel, i) => {
      this.slow[i] = false;
      setTimeout(() => {
        this.cameraPosition.position(-this.size / 1.25, 0, 4);
      }, 3000);
      setTimeout(() => {
        this.winner[i] = this.selectWinner();
        this.slow[i] = true;
      }, 5000 + Math.random() * 1000 + i * 1000);
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

  drawReelSymbols(reelsNumber, spriteName) {
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

  getsymbolsLineup() {
    this.symbolsLineup = Object.values(this.odds)
      .map((el, i) => Array(el.odds).fill(i))
      .flat();
  }

  selectSymbol(reelsArray) {
    reelsArray.forEach(reel => {
      reel.forEach((symbol, i) => {
        symbol.anims.create({
          AnimKey: 'reel',
          frames: [
            {
              sprite: 'slotElements',
              frame: i % 20
            }
          ], // 0 indexed
          framerate: 1,
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

  createButton() {
    this.button = this.physics.add
      .sprite('slotElements')
      .translate(this.camera.x, this.camera.y);

    this.button.anims.create({
      AnimKey: 'Button',
      frames: [{ sprite: 'slotElements', frame: 0 }], // 0 indexed
      framerate: 1,
      repeat: true
    });

    this.button.anims.play('Button');
  }
}
