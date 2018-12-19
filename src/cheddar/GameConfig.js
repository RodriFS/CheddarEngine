class GameConfig {
  constructor(config) {
    this.width = config.width || 1000;
    this.height = config.height || 1000;
    this.scenes = [...config.scenes];
  }
}

module.exports = GameConfig;
