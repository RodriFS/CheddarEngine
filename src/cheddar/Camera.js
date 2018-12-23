class Camera {
  constructor(gameScene) {
    this.gameScene = gameScene;
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
  }

  position(x, y, zoom) {
    console.log(this.gameScene);
    let width = this.gameScene.canvas.width / 2;
    let height = this.gameScene.canvas.height / 2;
    this.x = x + (width - width / zoom);
    this.y = y + (height - height / zoom);
    this.zoom = zoom;
  }
}
module.exports = Camera;
