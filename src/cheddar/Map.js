class Map {
  constructor(gameScene) {
    this.gameScene = gameScene;
    this.type = 'backgroundColor';
    this.z = -10;
    this.color;
    this.isDirty = false;
  }

  backgroundColor(color) {
    this.color = color;
    this.isDirty = true;
    this.gameScene.queue.push(this);
  }
}

module.exports = Map;
