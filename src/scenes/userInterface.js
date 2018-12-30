import Cheddar from '../cheddar';

export default class userInterface extends Cheddar.Scene {
  constructor(canvas, context, events) {
    super(canvas, context, events, { active: true });
    this.gameEndRectangle;
    this.gameEndText;
  }

  loadAssets() {
    // gets center of canvas
    this.width = window.innerWidth / 2;
    this.height = window.innerHeight / 2;

    // margin of gameEndRectangle
    this.margin = this.width / 4;
  }

  start() {
    // creates a end game sign
    this.gameEndRectangle = this.shapes.draw
      .rectangle(
        this.margin,
        this.margin,
        this.width * 2 - this.margin * 2,
        this.height * 2 - this.margin * 2,
        false,
        'pink'
      )
      .zindex(0);

    // creates the end game sign text
    this.gameEndText = this.text.write
      .add(
        'Game Finished!',
        this.width,
        this.height,
        '50px Arial',
        'black',
        'center',
        'middle'
      )
      .zindex(10);

    // hides the sign at the very begginning of the game until is showed
    this.gameEndRectangle.hide();
    this.gameEndText.hide();

    // if event is triggered, shows the sign and points
    this.events.on('finishedGame', () => {
      this.gameEndRectangle.show();
      this.gameEndText.show();

      let points = this.events.data('finishedGame');
      if (points > 0) {
        this.gameEndText.edit('You won ' + points + ' points!');
      } else {
        this.gameEndText.edit('You lost :(');
      }
    });
  }

  update() {
    // hides the sign when game restarts
    if (!this.events.emitted('finishedGame')) {
      this.gameEndRectangle.hide();
      this.gameEndText.hide();
    }
  }
}
