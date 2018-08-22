import Track from './track';
import Message from './message';

const vm = new Vue({
  el: '#app',
  data() {
    return {
      message: '发送弹幕',
      randomDanmu: [
        '哦',
        '你好',
        '我很好',
        '所以你呢',
        '我也非常好',
        '哦那我知道了',
        '可是我还不知道',
        '那你怎么才能知道',
        '这是一个字数递增的',
        '这是一个字数递增的句子',
      ],
      queue: [],
      list: [],
      tracks: [null, null, null],

    }
  },
  methods: {
    addMessage() {
      const {
        length
      } = this.randomDanmu;
      const message = this.randomDanmu[Math.floor(Math.random() * length + 0)];
      console.log('push-->', message);
    },

    calcTrackLength(track) {
      if (track.children && track.children.length > 0) {
        return track.children.map(child => child.length).reduce((a, c) => a + c)
      } else {
        return 0;
      }
    },

    calcIdleTrack() {
      const lengthMap = this.tracks.map(track => {
        const len = this.calcTrackLength(track);
        return len;
      });
      console.log('lengthMap', lengthMap);
      const item = Math.min.apply(this, lengthMap);
      return lengthMap.indexOf(item);
    },

    sendMessage(text) {
      const message = new Message({
        content: text
      });
      if (this.track.state === 'busy') {
        return;
      } else {
        this.queue.shift();
        this.track.addChild(message);
        const update = () => {
          this.track.update();
          setTimeout(update, 16);
        };
      }
      setTimeout(update, 16);

    }
  },

  mounted() {
    console.log('mounted....');
    this.list = this.randomDanmu;

    this.tracks.forEach((item, index) => {
      this.tracks[index] = new Track({
        top: 80 * (index + 1)
      });
    });

    console.log('tracks-->', this.list);


    this.list.forEach(item => {
      const message = new Message({
        content: item,
      });
      const idleIndex = this.calcIdleTrack();
      console.log(idleIndex);
      this.tracks.forEach((item, index) => {
        if (idleIndex === index) {
          this.tracks[index].addChild(message);
          this.tracks[index].update();
        }
      });
    });

    console.log(this.tracks);

  },
});
