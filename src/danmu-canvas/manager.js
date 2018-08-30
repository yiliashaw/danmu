import Message from './message';
import Track from './track';
import EventEmitter from 'eventemitter3';

const MAX_TRACKS = 5;
const TRACK_HEIGHT = 50;

const WINDOW_WIDTH = 750;
const WINDOW_HEIGHT = 300;

const BACKGROUND_COLOR = '#ffffff';
const COLOR = '#111111';
const FONT_FAMILY = 'Microsoft Yahei';
const FONT_SIZE = 18;
const PADDING = 10;
const HEIGHT = FONT_SIZE + PADDING * 2;

const SPEED = 3;

export default class Manager extends EventEmitter {
  constructor({ context, ratio = 1 }) {
    super();

    this.context = context;
    this.ratio = ratio;

    this.animationTimer = null;
    this.lastFrameTime = 0;

    this.pending = [];
    this.tracks = [];
    this.currentID = 0;
    this.init();
  }

  raf(callback) {
    // requestAnimationFrame
    const now = Date.now();
    const timeToCall = Math.max(0, 16 - (now - this.lastFrameTime));
    this.animationTimer = setTimeout(() => {
      callback(now + timeToCall);
    }, timeToCall);
    return this.animationTimer;
  }

  caf() {
    // cancelAnimationFrame
    clearTimeout(this.animationTimer);
  }

  drawRect(options) {
    const { context, color, x, y, w, h, r } = options;

    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x, y);

    context.lineTo(x + w - r, y);
    context.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);

    context.lineTo(x + w, y + h - r);
    context.arc(x + w - r, y + h - r, r, 0, 0.5 * Math.PI);

    context.lineTo(x + r, y + h);
    context.arc(x + r, y + h - r, r, 0.5 * Math.PI, 1 * Math.PI);

    context.lineTo(x, y + r);
    context.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);

    context.fill();
    context.closePath();

    context.restore();
  }

  drawSingleDanmu(message) {
    const context = this.context;
    const { options } = message;

    this.drawRect({
      context,
      color: options.backgroundColor,
      x: message.x,
      y: message.y,
      w: message.danmuWidth,
      h: HEIGHT,
      r: HEIGHT / 2
    });

    context.save();
    context.font = `${message.options.fontSize}px ${
      message.options.fontFamily
    }`;
    context.textBaseline = 'top';
    context.fillStyle = options.color;
    context.fillText(message.text, message.x + message.padding, message.y + 6);
    context.restore();
  }

  getIdleTrack() {
    return this.tracks.find(track => track.canAddChild());
  }

  addMessage(message) {
    const track = this.getIdleTrack();
    if (track) {
      track.addChild(message);
      return true;
    }
    return false;
  }

  nextID() {
    const cur = this.currentID + 1;
    this.currentID = cur;
    return cur;
  }

  speed() {
    return Math.floor(Math.random() * 1 + 1);
  }

  add(text) {
    const id = this.nextID();
    const message = new Message({
      id,
      text,
      x: WINDOW_WIDTH,
      y: PADDING,
      context: this.context,
      padding: PADDING,
      // speed: this.speed(),
      speed: SPEED,
      windowWidth: WINDOW_WIDTH,
      options: {
        color: COLOR,
        fontFamily: FONT_FAMILY,
        fontSize: FONT_SIZE,
        backgroundColor: BACKGROUND_COLOR
      }
    });

    if (!this.addMessage(message)) {
      this.pending.push(message);
    }
  }

  update() {
    if (this.context) {
      this.context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    }

    this.tracks.forEach(track => {
      track.children.forEach(child => {
        this.drawSingleDanmu(child);
        child.update();
      });
    });

    this.consumePending();

    this.raf(this.update.bind(this));
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

  cleanAll() {
    this.pending = [];
    this.tracks.forEach(track => {
      track.removeAllChildren();
    });
  }

  init() {
    for (let i = 0; i < MAX_TRACKS; i++) {
      this.tracks[i] = new Track({
        top: TRACK_HEIGHT * i + 10,
        id: i
      });
    }
    this.raf(this.update.bind(this));
  }
}
