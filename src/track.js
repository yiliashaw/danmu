

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
    // console.log(lastChild.id, Date.now() - lastChild.startTime, lastChild.offsetFromX())
    if (lastChild.offsetFromX() > 20) {
      return true;
    }

    return false;
  }

  addChild(child) {
    this.children.push(child);
    child.top = this.top;
    child.parent = this;
    child.start();
  }

  garbageCollect() {
    for (let i = this.children.length - 1; i > -1; --i) {
      const child = this.children[i];
      if (child.isExpired()) {
        this.children.splice(i, 1);
        child.parent = null;
      }
    }
  }
}
