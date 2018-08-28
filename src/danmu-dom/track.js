export default class Track {
  constructor({
    id,
    top
  }) {
    this.id = id;
    this.top = top;
    this.children = [];
  }

  canAddChild() {
    if (this.children && this.children.length <= 0) {
      return true;
    }

    const lastChild = this.children[this.children.length - 1];
    if (lastChild.offsetFromX() > 2) {
      return true;
    }

    return false;
  }

  addChild(child) {
    this.children.push(child);
    child.top = this.top;
    // child.parent = this;
    child.start();
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    this.children.splice(index, 1);
    // child.parent = null;
  }

  removeAllChildren() {
    this.children.splice(0, this.children.length);
  }

  garbageCollect() {
    this.children.forEach(child => {
      if (child.isExpired()) {
        // console.log('垃圾回收--》', child.id, child.startTime, Date.now());
        this.removeChild(child);
      }
    });
  }
}
