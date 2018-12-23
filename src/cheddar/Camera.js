class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
  }

  position(x, y, zoom) {
    this.x = x;
    this.y = y;
    this.zoom = zoom;
  }
}
module.exports = Camera;
