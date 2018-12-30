// this class contorls every texts instance
class Text {
  constructor(gameScene) {
    this.gameScene = gameScene;
    this.type = 'text';
    this.text;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.font;
    this.color;
    this.textAlign;
    this.textBaseline;
    this.direction;
    this.maxWidth;
    this.hidden;
    this.isDirty = false;
  }

  // adds a text to the rendering queue
  add(text, x, y, font, color, textAlign, textBaseline, direction, maxWidth) {
    this.type = 'text';
    this.text = text;
    this.x = x;
    this.y = y;
    this.font = font;
    this.color = color;
    this.textAlign = textAlign;
    this.textBaseline = textBaseline;
    this.direction = direction;
    this.maxWidth = maxWidth;
    this.isDirty = true;
    this.hidden = false;
    this.gameScene.queue.push(this);
    return this;
  }

  // prevents rendering of text
  hide() {
    this.hidden = true;
  }

  // allows rendering of text
  show() {
    this.hidden = false;
  }

  // edits the text string
  edit(text) {
    this.text = text;
  }

  // changes the z-indez of the object so it can be render
  // in the front or behind others
  zindex(z) {
    this.z = z;
    this.isDirty = true;
    return this;
  }
}

module.exports = Text;
