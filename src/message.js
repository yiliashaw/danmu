import DisplayObject from './displayObject';

export default class Message extends DisplayObject {
  constructor({ el, content, top, left, speed = 10, fontSize = 24 }) {
    super();
    this.el = el;
    this.content = content;
    this.top = top;
    this.left = left;
    this.speed = speed;
    this.fontSize = fontSize;
    this.state = 'stop';
    this.length = 0;
    this.init();
  }

  update() {
    if (this.left < 0 && Math.abs(this.left) > this.length + 10) {

    } else {
      this.left -= this.speed;
    }

  }

  stateManager() {
    const states = {
      move() {
        this.state = 'move';
      },
      stop() {
        this.state = 'stop';
      },
      destroy() {
        this.state = 'destory';
        this.parent.removeChild(this);
      }
    };

    return {
      changeState(state) {
        states[state]();
      }
    }

  }

  init() {
    this.length = this.content.length * this.fontSize;
  }


}