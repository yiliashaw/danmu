  import Message from './message';
  import Track from './track';
  import EventEmitter from 'eventemitter3';

  const MAX_TRACKS = 5;
  // const MAX_MESSAGE_COUNT = 20;
  const BASE_TOP = 50;

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
      console.log('options', options);

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

    drawSingleDanmu(text) {
      const context = this.context;
      const message = new Message({
        text,
        context,
        padding: PADDING
      });
      const {
        options
      } = message;

      console.log(message);
      // draw rect
      const radius = HEIGHT / 2;
      const beginX = message.x + HEIGHT + MARGIN;

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

      context.font = message.font;
      context.textBaseline = 'top';
      context.fillStyle = options.color;

      context.fillText(message.text, message.x + message.padding, message.y + 5);

      message.update();
    }



    getIdleTrack() {
      return this.tracks.find(track => track.canAddChild())
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
      // this.pending = [];
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
          top: BASE_TOP * i,
          id: i
        });
      }
    }

  }
