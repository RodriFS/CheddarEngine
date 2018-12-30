// this class controls the background map
class Map {
  constructor(gameScene) {
    this.gameScene = gameScene;
    this.type = 'backgroundColor';
    this.z = -10;
    this.color;
    this.isDirty = false;
    this.hidden;
  }

  // sets a background color
  backgroundColor(color) {
    this.color = color;
    this.isDirty = true;
    this.hidden = false;
    this.gameScene.queue.push(this);
  }

  // prevents background rendering
  hide() {
    this.hidden = true;
  }

  // allows background rendering
  show() {
    this.hidden = false;
  }
}

module.exports = Map;
