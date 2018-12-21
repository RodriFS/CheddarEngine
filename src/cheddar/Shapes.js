class Shapes {
  constructor(game) {
    this.donut = this.donut.bind(game);
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
}

module.exports = Shapes;
