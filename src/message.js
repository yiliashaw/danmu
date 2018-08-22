import DisplayObject from './displayObject';

export default class Message extends DisplayObject {
  constructor({
    el,
    content,
    top,
    speed = 1,
    fontSize = 16
  }) {
    super();
    this.el = el;
    this.content = content;
    this.top = top;
    this.speed = speed;
    this.fontSize = fontSize;
    this.left = 100;
    this.state = 'init';
    this.width = 0;
    this.delay = 0;
    this.init();
  }

  update() {
    if (this.left <= -this.width) {
      console.log('可以消失了');
      this.changeState('destroy');

    } else {
      this.left = this.left - this.speed;
    }
  }

  changeState(state) {
    switch (state) {
      case 'move':
        this.state = 'move';
        break;
      case 'stop':
        this.state = 'stop';
        break;
      case 'destroy':
        this.state = 'destroy';
        this.parent.removeChild(this);
        break;
    }
  }

  init() {
    this.width = this.content.length * this.fontSize;
    this.changeState('move');
  }


}
