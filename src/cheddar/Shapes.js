class Shapes {
  constructor(game) {
    this.donut = this.donut.bind(game);
  }

  donut(centerx, centery, diameter, thickness, color) {
    this.context.beginPath();
    this.context.arc(centerx, centery, diameter, thickness, 2 * Math.PI);
    this.context.lineWidth = 20;
    this.context.strokeStyle = color;
    this.context.closePath();
    this.context.stroke();
  }
}

module.exports = Shapes;
