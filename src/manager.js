import Message from './message';
import Track from './track';
import EventEmitter from 'eventemitter3';

const MAX_TRACKS = 3;
const BASE_TOP = 80;

export default class Manager extends EventEmitter {
  constructor() {
    super();

    this.pending = [];
    this.tracks = [];
    this.init();
    this.currentID = 0;
  }

  getIdleTrack() {
    return this.tracks.find(track => track.canAddChild())
  }

  addMessage(message) {
    const track = this.getIdleTrack();
    if (track) {
      track.addChild(message);
      if(track === this.tracks[0])
      console.log(track.children.map((a, i) => [a.id, a.startTime - (track.children[i - 1] ? track.children[i - 1].startTime : 0)]));
      this.emit('update');
      return true;
    } 
    
    return false;
  }

  nextID() {
    const cur = this.currentID + 1;

    this.currentID = cur;

    return cur;
  }

  add({ content, fontSize, duration, windowWidth }) {
    const message = new Message({ 
      id: this.nextID(),
      content, 
      fontSize, 
      duration, 
      windowWidth 
    });
    
    if (!this.addMessage(message)) {
      this.pending.push(message);
    }
  }

  consumePending() {
    const pending = [];
    this.pending.forEach(message => {
      if (!this.addMessage(message)) {
        pending.push(message);
      }
    });
    this.pending = pending;
  }

  getData() {
    return this.tracks;
  }

  garbageCollect() {
    this.tracks.forEach(track => {
      track.garbageCollect();
    });
  }

  tick() {
    this.garbageCollect();

    this.consumePending();
  }

  init() {
    for (let i = 0; i < MAX_TRACKS; i++) {
      this.tracks[i] = new Track({
        top: BASE_TOP * (i + 1),
        id: i
      });
    }
  }

}