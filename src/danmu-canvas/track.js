export default class Track {
  constructor({ id, top }) {
    this.id = id;
    this.top = top;
    this.children = [];
  }

  canAddChild() {
    if (this.children && this.children.length <= 0) {
      return true;
    }

    const minOffsetFromX = Math.min.apply(
      this,
      this.children.map(child => child.offsetFromX())
    );
    if (minOffsetFromX > 5) {
      return true;
    }

    return false;
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
}
