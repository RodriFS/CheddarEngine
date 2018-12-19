const GameObject = require('./GameObject');

class Physics {
  constructor(game) {
    this.add = new GameObject(game);
  }
}

module.exports = Physics;
