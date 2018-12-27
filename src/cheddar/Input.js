class Input {
  constructor(gameScene) {
    this.gameScene = gameScene;
  }

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
      // console.log('yes');

      gameObject.mouseover = true;
      return true;
    } else {
      gameObject.mouseover = null;
    }
  }

  on(action, cb, gameObject) {
    let canvas = this.gameScene.canvas;
    switch (action) {
      case 'click':
        canvas.addEventListener(
          'click',
          () => {
            if (this.mouseover(gameObject)) cb();
          },
          false
        );
        break;
    }
  }
}

module.exports = Input;
