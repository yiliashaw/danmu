const INIT = 0;
const START = 1;
const ANIMATE = 2
const END = 3;




export default class Message {
  constructor({
    id = 0,
    context,
    text = '',
    x = 0,
    y = 0,
    padding = 0,
    options = {
      speed: 1,
      color: '#111',
      fontFamily: 'Microsoft Yahei',
      fontSize: 14,
      backgroundColor: 'rgba(255, 255, 255, .6)',
      other: null
    }
  }) {

    this.id = id;
    this.context = context;
    this.text = text;
    // this.speed = speed;
    this.x = x;
    this.y = y;
    this.padding = padding;
    this.options = options;

    this.textWidth = 0;
    this.danmuWidth = 0;



    // this.parent = null;
    this.init();
  }

  update() {
    if (this.state === START) {
      return;
    }

    this.x = this.x - this.options.speed

    if (this.x <= -this.danmuWidth) {
      this.state = END;
    }
  }

  init() {
    this.state = INIT;
    this.context.font = `${this.options.fontSize}px ${this.options.fontFamily}`;
    this.textWidth = Math.round(this.context.measureText(this.text).width);

    this.danmuWidth = this.textWidth + this.padding * 2;
  }

  isExpired() {
    return this.state === END;
  }

  offsetFromX() {
    return this.x + this.danmuWidth
  }
}
