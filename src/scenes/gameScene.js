import Cheddar from '../cheddar';

export default class GameScene extends Cheddar.Scene {
  constructor(canvas, context, events) {
    super(canvas, context, events, { active: true });

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
    this.newPayline;
    this.clicked;
  }

  loadAssets() {
    // gets center of canvas
    this.width = window.innerWidth / 2;
    this.height = window.innerHeight / 2;

    // checks if web or mobile is rotated
    // for responsiveness
    this.width > this.height
      ? (this.size = window.innerHeight / 2)
      : (this.size = window.innerWidth / 2);

    // scale of sprites
    this.scale = this.size / 4500;

    // loads assets
    this.load.spritesheet('slotElements', 4, 10, 250, 250, this.scale);
    this.load.audio('win', 'mp3');
    this.load.audio('ping', 'wav');
  }

  start() {
    // sets global variables
    this.increment = [0, 0, 0, 0, 0];
    this.speed = [0, 0, 0, 0, 0];
    this.slow = [0, 0, 0, 0, 0];
    this.winner = [];
    this.clicked = false;
    this.currentPayline = [];
    this.newPayline = [];

    // here you can change the odds of one sprite
    // winning more than other,
    // in this case the sum of the odds is 128
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

    // position of the camera when game starts
    this.cameraPosition = this.camera.position(-this.size / 1.25, 0, 4);

    // function to create all symbols gameObjects
    // position and sprites are set in different function
    this.reel = this.drawReelSymbols(5, 'slotElements');
    // sets the sprite of each symbol
    this.selectSymbol(this.reel);

    // draws background color
    this.map.backgroundColor('lightblue');

    // draws the 5 rings
    this.drawReelBackground(this.size / 15, [
      '#AE37D9',
      '#F6E652',
      '#7AE0C3',
      '#EC5783',
      '#5690DD'
    ]);

    //gets an array with all symbols repeated by each odds
    this.getsymbolsLineup();

    // creates the play button
    if (!this.clicked) this.createButton();

    // draws the payline grid
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

    // creates an event listener on the user click
    this.input.on(
      'click',
      () => {
        this.clicked = true;
        this.events.reset('finishedGame');
        this.stopMotion();
      },
      this.button
    );
  }

  update() {
    // finds out which symbol is currently passing by the payline
    this.getCurrentPayline();

    // moves the symbols in a circle
    this.moveReel(this.reel);

    // toggles between rendering the button or not
    this.clicked ? this.button.hide() : this.button.show();

    // changes the speed of each ring independently
    this.increment.forEach((inc, i) => {
      // acceleration of the wheel
      if (!this.slow[i] && this.speed[i] < 0.1) this.speed[i] *= 1.05;

      // selection of the payline
      if (this.slow[i] && this.speed[i] < 0.01) {
        // snap of the symbols
        let snap = (Math.PI * 2) / this.reel[i].length;

        // stops the symbols in the payline if they're snapped
        // to the grid
        if (
          -this.increment[i] % snap < 0.0075 &&
          this.currentPayline[i] === this.winner[i]
        ) {
          this.speed[i] = 0;
          this.increment[i] += 0;
        } else {
        }
      }
      // deacceleration of the wheel
      if (this.slow[i] && this.speed[i] > 0.005) this.speed[i] *= 0.95;

      //continuous movement
      if (this.speed[i]) this.increment[i] -= this.speed[i];

      // random number generator, it generates
      // a number 5 times each frame.
      // aprox 300 numbers per second
      this.rng();

      // plays the sound of the wheel turning
      this.playBitSound(i);
    });

    // checks if all wheels are fully stopped
    if (this.speed.join('') === '00000') this.payUp();
  }

  playBitSound(reel) {
    // if wheel is still moving, play the sound every time
    // a new symbol passes through the payline
    if (
      this.currentPayline[reel] !== this.newPayline[reel] &&
      this.speed[reel]
    ) {
      this.audio.play('ping');
    }
    this.currentPayline[reel] = this.newPayline[reel];
  }

  payUp() {
    if (this.clicked) {
      this.clicked = false;

      let points;

      // if all elements are equal, sum and emit points
      if (this.winner.every(el => el === this.winner[0])) {
        points = this.winner.reduce((acc, el) => acc + el / this.odds[el].odds);
        this.audio.play('win');
      } else {
        points = 0;
      }
      this.events.emit('finishedGame', points.toFixed(2));

      // reset payline and winning numbers
      this.currentPayline = [];
      this.winner = [];
    }
  }

  getCurrentPayline() {
    // checks which symbol x is between the center grid.
    // can be expanded to the other lines
    let payline = {
      x1: this.width,
      y1: this.height - (this.size * 3) / 30 + this.size / 15,
      y2: this.height - (this.size * 3) / 30 + (this.size / 15) * 2
    };
    this.newPayline = this.reel
      .flat()
      .filter(el => el.y > payline.y1 && el.y < payline.y2 && el.x < this.width)
      .map(el => el.sprite.reel.frames[0]);
  }

  rng() {
    // random number generator, from 0 to 20 symbols the power of 5
    this.randomNumber = Math.floor(Math.random() * 20 ** 5);
  }

  selectWinner() {
    // from a random number, gets the winning symbol
    let random = this.randomNumber;
    return this.symbolsLineup[random % 128];
  }

  stopMotion() {
    // this number should be low for controlling the acceleration
    this.speed = [0.005, 0.005, 0.005, 0.005, 0.005];

    // changes the camera to a full wheel view

    this.cameraPosition.position(0, 0, 1);

    this.reel.forEach((reel, i) => {
      this.slow[i] = false;
      setTimeout(() => {
        // changes the camera to a closeup in 3 seconds
        this.cameraPosition.position(-this.size / 1.25, 0, 4);
      }, 3000);
      setTimeout(() => {
        // for each wheel selects a winning symbol
        this.winner[i] = this.selectWinner();
        this.slow[i] = true;
      }, 5000 + Math.random() * 1000 + i * 1000);
    });
  }

  drawPayLine(x1, y1, x2, y2, thickness, color, columns, rows) {
    // draws 15 squares
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
    // draws 5 rings
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
    // offsets position of the symbols in diameter
    let thickness = this.size / 15;
    let reels = Array(reelsNumber)
      .fill(0)
      .map((n, i) => {
        // calculates how many symbols in a ring each 290px
        let symbolPerDiameter =
          (2 * Math.PI * (this.size - thickness * (i + 1))) / this.scale / 290;
        return Math.floor(symbolPerDiameter);
      });
    let reelArray = [];

    //modify reels so it snaps to grid
    reels[3] += 1;
    reels[2] += 1;

    // creates a gameObject for each symbol
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
    // from the odds variable, it get's an array
    // that has a number repeated "odds" number of times
    this.symbolsLineup = Object.values(this.odds)
      .map((el, i) => Array(el.odds).fill(i))
      .flat();
  }

  selectSymbol(reelsArray) {
    // gets an array between 0 and 20 and shuffles it
    let symbolArray = [...Array(20).keys()].sort(() => Math.random() - 0.5);

    // creates an animation for each gameObject
    reelsArray.forEach(reel => {
      reel.forEach((symbol, i) => {
        symbol.anims.create({
          AnimKey: 'reel',
          frames: [
            {
              sprite: 'slotElements',
              // gets increasing numbers from 0 to 19
              frame: symbolArray[i % 20]
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

    // moves each symbol in a ring without rotating
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
    // creates the button and the animation
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
