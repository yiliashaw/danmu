import Message from './message';
import Track from './track';
import EventEmitter from 'eventemitter3';

const MAX_TRACKS = 5;
// const MAX_MESSAGE_COUNT = 20;
const TRACK_HEIGHT = 50;

const WINDOW_WIDTH = 750;
const WINDOW_HEIGHT = 300;

const FONT_SIZE = 18;
const DURATION = 5000;

export default class Manager extends EventEmitter {
  constructor(id) {
    super();

    this.pending = [];
    this.tracks = [];
    this.init();
    this.currentID = 0;
  }

  getIdleTrack() {
    return this.tracks.find(track => track.canAddChild());
  }

  addMessage(message) {
    const track = this.getIdleTrack();
    if (track) {
      // console.log('add:', message.id);
      track.addChild(message);
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

  add(text, isOwner = false) {
    const id = this.nextID();
    const message = new Message({
      id,
      content: `${text}}:${id}`,
      fontSize: FONT_SIZE,
      duration: DURATION,
      windowWidth: WINDOW_WIDTH,
      owner: isOwner
    });

    if (!this.addMessage(message)) {
      // console.log('pending:', message.id);
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
    this.garbageCollect();
    this.consumePending();
  }

  init() {
    for (let i = 0; i < MAX_TRACKS; i++) {
      this.tracks[i] = new Track({
        top: TRACK_HEIGHT * i,
        id: i
      });
    }
    clearTimeout(this.animationTimer);
    this.animationTimer = setTimeout(this.update.bind(this), 16);
  }

  update() {
    this.tick();
    this.animationTimer = setTimeout(this.update.bind(this), 16);
  }
}
