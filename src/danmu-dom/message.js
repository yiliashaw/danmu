const INIT = 0;
const START = 1;
const ANIMATE = 2
const END = 3;


export default class Message {
  constructor({
    id = 0,
    content = '',
    fontSize = 36, // px
    duration = 5 * 1000, // 5s
    windowWidth = 750,
    owner = false,
  }) {
    this.id = id;
    this.content = content;
    this.fontSize = fontSize;
    this.duration = duration;
    this.windowWidth = windowWidth;
    this.startTime = null;
    this.endTime = null;
    this.speed = 0;
    this.width = 0;
    this.left = 100;
    this.state = INIT;
    this.parent = null;
    this.init();
  }

  init() {
    this.width = this.content.length * this.fontSize;
    this.speed = this.windowWidth / this.duration; // px/s
  }

  start() {
    this.state = START;
    this.startTime = Date.now();
    this.endTime = this.startTime + this.duration;
    // console.log('开始动--》', this.id, this.endTime - this.startTime, this.width, this.windowWidth);
  }

  isExpired() {
    return this.state === START &&
      Date.now() > this.endTime;
  }

  offsetFromX() {
    const now = Date.now();
    const passed = now - this.startTime;
    const moved = passed * this.speed;
    return moved - this.width;
  }
}
