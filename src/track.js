import ObjectContainer from './objectContainer';

export default class Track extends ObjectContainer {
  constructor({
    top
  }) {
    super();
    this.top = top;
    this.duration = 0;
    this.state = 'idle'; // idle, busy

  }

  addChild(child) {
    if (this.state === 'idle') {
      child.top = this.top;
      super.addChild(child);
    }
  }

  update() {
    this.children.forEach(child => {
      if (child.state === 'move') {
        child.update();

      } else {
        console.log('meg state -->', child.state);
        return;
      }
    });

    const lastChild = this.children[this.children.length - 1];

    if (lastChild.left < lastChild.width) {
      this.state = 'busy';
    } else {
      this.state = 'idle';
    }
  }

}
