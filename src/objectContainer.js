export default class ObjectContainer {
  constructor() {
    this.children = [];
  }

  addChild(child) {
    console.log('add child');
    this.children.push(child);
    child.parent = this;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    this.children.splice(index, 1);
    child.parent = null;
  }

  update() {
    console.log('track update');
    this.children.forEach(child => child.update());

  }

}