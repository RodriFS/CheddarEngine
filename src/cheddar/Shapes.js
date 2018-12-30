// works like gameObject but instead controls Shapes
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
    this.hidden;
  }

  // adds a donut to the rendering queue
  donut(centerx, centery, diameter, thickness, color) {
    this.type = 'donut';
    this.centerx = centerx;
    this.centery = centery;
    this.diameter = diameter;
    this.thickness = thickness;
    this.color = color;
    this.isDirty = true;
    this.hidden = false;
    this.gameScene.queue.push(this);
    return this;
  }

  // adds a rectangle to the rendering queue
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

  // changes the z-indez of the object so it can be render
  // in the front or behind others
  zindex(z) {
    this.z = z;
    this.isDirty = true;
    return this;
  }

  // prevents rendering of shape
  hide() {
    this.hidden = true;
  }

  // allows rendering of shape
  show() {
    this.hidden = false;
  }
}

module.exports = Shapes;
