import ObjectContainer from './objectContainer';

export default class Track extends ObjectContainer {
  constructor({top}) {
    super();
    this.top = top;
    
  }

  addChild(child) {
    super.addChild(child);
    child.top = this.top;
  }

  


  
}