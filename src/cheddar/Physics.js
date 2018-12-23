const GameObject = require('./GameObject');

class Physics {
  constructor(game) {
    this.add = {
      get add() {
        return new GameObject(game);
      }
    };
  }
}

module.exports = Physics;
