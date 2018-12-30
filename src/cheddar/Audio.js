// this class controls the audio
class Audio {
  constructor(gameScene) {
    this.audios = gameScene.load.audios;
  }

  //plays audio file
  play(name) {
    this.audios[name].audio.play();
  }

  //pauses audio file
  pause(name) {
    this.audios[name].audio.pause();
  }
}

module.exports = Audio;
