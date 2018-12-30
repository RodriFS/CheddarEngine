// this class controls user input
class Input {
  constructor(gameScene) {
    this.gameScene = gameScene;
  }

  // checks if mouse is over gameObject
  mouseover(gameObject) {
    let { x, y, width, height } = gameObject.getPosition();
    let minX = x;
    let maxX = minX + width;
    let minY = y;
    let maxY = minY + height;

    if (
      this.gameScene.mouseX > minX &&
      this.gameScene.mouseX < maxX &&
      this.gameScene.mouseY > minY &&
      this.gameScene.mouseY < maxY
    ) {
      gameObject.mouseover = true;
      return true;
    } else {
      gameObject.mouseover = null;
    }
  }

  // adds an event listener and sets a callback. You can pass the
  // gameObject as the border of the action
  on(action, cb, gameObject) {
    let canvas = this.gameScene.canvas;
    switch (action) {
      case 'click':
        canvas.addEventListener(
          'click',
          () => {
            if (gameObject && this.mouseover(gameObject)) {
              cb();
            } else if (!gameObject) {
              cb();
            }
          },
          false
        );
        break;
    }
  }
}

module.exports = Input;
