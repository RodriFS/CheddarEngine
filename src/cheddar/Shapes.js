class Shapes {
  constructor(game) {
    this.donut = this.donut.bind(game);
    this.rectangle = this.rectangle.bind(game);
  }

  donut(centerx, centery, diameter, thickness, color) {
    this.queue.push({
      name,
      type: 'donut',
      z: 0,
      centerx,
      centery,
      diameter,
      thickness,
      color
    });
  }

  rectangle(x1, y1, x2, y2, thickness, color) {
    this.queue.push({
      name,
      type: 'rectangle',
      z: 0,
      x1,
      y1,
      x2,
      y2,
      thickness,
      color
    });
  }
}

module.exports = Shapes;
