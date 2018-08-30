  import Message from './message';
  import Track from './track';
  import EventEmitter from 'eventemitter3';

  const MAX_TRACKS = 5;
  // const MAX_MESSAGE_COUNT = 20;
  const BASE_TOP = 50;

  const WINDOW_WIDTH = 750;
  const WINDOW_HEIGHT = 300;
  const MARGIN = 10;
  const PADDING = 10;
  const HEIGHT = 30;

  export default class Manager extends EventEmitter {
    constructor(context) {
      super();

      this.context = context;

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

    drawRect(options) {
      const {
        context,
        color,
        x,
        y,
        w,
        h,
        r
      } = options;

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
      const {
        options
      } = message;
      const radius = HEIGHT / 2;
      // draw rect

      context.save();

      this.drawRect({
        context,
        color: options.backgroundColor,
        x: message.x,
        y: message.y,
        w: message.danmuWidth,
        h: HEIGHT,
        r: radius
      });


      // draw text

      context.save();
      context.font = message.font;
      context.textBaseline = 'top';
      context.fillStyle = options.color;
      context.fillText(message.text, message.x + message.padding, message.y + 5);
      context.restore();

      context.restore();


    }



    getIdleTrack() {
      return this.tracks.find(track => track.canAddChild())
    }

    addMessage(message) {
      // this.calc();
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
        text,
        x: WINDOW_WIDTH,
        y: 10,
        context: this.context,
        padding: PADDING,
        // speed: this.speed(),
        speed: 1,
        windowWidth: WINDOW_WIDTH
      });

      if (!this.addMessage(message)) {
        // console.log('pending:', message.id);
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

    getData() {
      return this.tracks;
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
          top: BASE_TOP * i,
          id: i
        });
      }

      this.raf(this.update.bind(this));

    }

  }
