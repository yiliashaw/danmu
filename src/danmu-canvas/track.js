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

    const minOffsetFromX = Math.min.apply(this, this.children.map(child => child.offsetFromX()));

    // console.log('minOffsetFromX', minOffsetFromX, this.children.map(child => child.offsetFromX()));
    if (minOffsetFromX > 5) {
      return true;
    }

    return false;
  }

  maxOffsetFromX() {
    return Math.min.apply(this, this.children.map(child => child.offsetFromX()))
  }

  addChild(child) {
    this.children.push(child);
    child.y = this.top + child.y;
    child.parent = this;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    this.children.splice(index, 1);
    child.parent = null;
  }

  removeAllChildren() {
    this.children.splice(0, this.children.length);
  }

  update() {
    this.children.forEach(child => child.update());
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
