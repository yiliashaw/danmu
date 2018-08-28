import Message from './message';
import Track from './track';
import EventEmitter from 'eventemitter3';

const MAX_TRACKS = 3;
const MAX_MESSAGE_COUNT = 80;
const BASE_TOP = 50;

export default class Manager extends EventEmitter {
  constructor(id) {
    super();

    // this.canvasContext = createCanvasContext(id);
    this.animationTimer = null;
    this.lastFrameTime = 0;

    this.pending = [];
    this.tracks = [];
    this.init();
    this.currentID = 0;
  }

  raf(callback) { // requestAnimationFrame
    const now = Date.now();
    const timeToCall = Math.max(0, 16 - (now - this.lastFrameTime));
    this.animationTimer = setTimeout(() => {
      callback(now + timeToCall);
    }, timeToCall);
    return this.animationTimer;

  }

  caf() { // cancelAnimationFrame
    clearTimeout(this.animationTimer);
  }

  getIdleTrack() {
    return this.tracks.find(track => track.canAddChild())
  }

  isWindowClear() {
    return this.tracks.every(track => {
      const lastChild = track.lastChild();
      if (lastChild) {
        return lastChild.isExpired()
      }
      return true;
    });
  }

  totalMessageCount() {
    return this.tracks.map(track => track.children.length).reduce((a, c) => a + c);
  }

  addMessage(message) {

    const track = this.getIdleTrack();
    if (track) {
      if (this.totalMessageCount() >= MAX_MESSAGE_COUNT && this.isWindowClear()) {
        this.garbageCollect();
        return false;
      } else if (this.totalMessageCount() >= MAX_MESSAGE_COUNT) {
        return false;
      }
      // console.log('add:', message.id);
      track.addChild(message);
      // if (track === this.tracks[0])
      // console.log(track.children.map((a, i) => [a.id, a.startTime - (track.children[i - 1] ? track.children[i - 1].startTime : 0)]));
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

  add({
    content,
    fontSize,
    duration,
    windowWidth,
    owner,
  }) {
    const id = this.nextID();
    const message = new Message({
      id,
      content: `${content}:${id}`,
      fontSize,
      duration,
      windowWidth,
      owner
    });

    if (!this.addMessage(message)) {
      // console.log('pending:', message.id);
      if (message.owner) {
        this.pending.unshift(message);
      } else {
        this.pending.push(message);
      }

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

  cleanAll() {
    this.pending = [];
    this.tracks.forEach(track => {
      track.removeAllChildren();
    });

    this.emit('update');
  }

  garbageCollect() {
    this.tracks.forEach(track => {
      track.garbageCollect();
      this.emit('update');
    });
  }

  tick() {
    // this.garbageCollect();
    // console.log('windowclear', this.isWindowClear());
    // console.log('totalMessageCount', this.totalMessageCount());
    if (this.totalMessageCount() < MAX_MESSAGE_COUNT) {
      this.consumePending();
    } else if (this.totalMessageCount() >= MAX_MESSAGE_COUNT && this.isWindowClear()) {
      this.garbageCollect();
    }
  }

  init() {
    for (let i = 0; i < MAX_TRACKS; i++) {
      this.tracks[i] = new Track({
        top: BASE_TOP * i,
        id: i
      });
    }
  }

}
