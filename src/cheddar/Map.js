class Map {
  constructor(gameScene) {
    this.gameScene = gameScene;
    this.type = 'backgroundColor';
    this.z = -10;
    this.color;
  }

  backgroundColor(color) {
    this.color = color;
    this.gameScene.queue.push(this);
  }
}

module.exports = Map;
