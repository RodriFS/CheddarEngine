class Map {
  constructor(game) {
    this.backgroundColor = this.backgroundColor.bind(game);
  }

  backgroundColor(color) {
    this.queue.push({
      type: 'backgroundColor',
      z: -10,
      color
    });
  }
}

module.exports = Map;
