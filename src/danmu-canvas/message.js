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
    speed = 1,
    windowWidth = 0,
    options
  }) {

    this.id = id;
    this.context = context;
    this.text = text;
    this.x = x;
    this.y = y;
    this.padding = padding;
    this.speed = speed;
    this.windowWidth = windowWidth;
    this.options = Object.assign({}, {
      color: '#111',
      fontFamily: 'Microsoft Yahei',
      fontSize: 14,
      backgroundColor: 'rgba(255, 255, 255)',
      other: null
    }, options);

    this.textWidth = 0;
    this.danmuWidth = 0;



    // this.parent = null;
    this.init();
  }

  update() {
    if (this.state === START) {
      return;
    }

    this.x = this.x - this.speed
    // console.log('x-->', this.x);


    if (this.x < -this.danmuWidth) {
      this.parent.removeChild(this)
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
    return this.windowWidth - this.x - this.danmuWidth;
  }
}
