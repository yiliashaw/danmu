import ObjectContainer from './objectContainer';

export default class Track extends ObjectContainer {
  constructor({
    top
  }) {
    super();
    this.top = top;
    this.duration = 0;

  }

  addChild(child) {
    if (this.children.length > 0) {
      const lastChild = this.children[this.children.length - 1];
      child.delay = lastChild.delay + lastChild.length / lastChild.speed;
    }
    child.top = this.top;
    super.addChild(child);
  }

  update() {
    this.children.forEach(child => {
      if (child.state === 'move') {
        this.duration = this.duration + child.speed;
        console.log('duration', this.duration);
        child.update();

      } else {
        console.log('meg state -->', child.state);
        return;
      }
    });
  }

}
