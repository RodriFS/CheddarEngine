class Shapes {
  constructor(gameScene) {
    this.gameScene = gameScene;
    this.type = '';
    this.z = 0;
    this.centerx = 0;
    this.centery = 0;
    this.diameter = 0;
    this.thickness = 0;
    this.color = 'black';
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.isDirty = false;
  }

  donut(centerx, centery, diameter, thickness, color) {
    this.type = 'donut';
    this.centerx = centerx;
    this.centery = centery;
    this.diameter = diameter;
    this.thickness = thickness;
    this.color = color;
    this.isDirty = true;
    this.gameScene.queue.push(this);
    return this;
  }

  rectangle(x1, y1, x2, y2, thickness, color) {
    this.type = 'rectangle';
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.thickness = thickness;
    this.color = color;
    this.isDirty = true;
    this.gameScene.queue.push(this);
    return this;
  }

  zindex(z) {
    this.z = z;
    this.isDirty = true;
    return this;
  }
}

module.exports = Shapes;
