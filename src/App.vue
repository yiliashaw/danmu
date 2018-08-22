<template>
  <div id="app">
    <button class="add" @click="addMessage">{{message}}</button>
      <div class="wrap">
          <div class="track" >
              <div  v-if="track && track.children" class="text"v-for="(message, index) in track.children" :style="{
                left: message.left + '%',
                animationDelay: message.delay / 10 + 's',
              }"> {{message.content}}
              </div>
          </div>
          <!-- <div class="track" v-for="(item, index) in tracks">
              <div class="text" v-for="(message, index) in item.children" :style="{
                left: message.left + '%',
                transform: 'translateX(' + message.left + '%)',
                animationDelay: message.delay / 10 + 's',
              }"> {{message.content}}
              </div>
          </div> -->
      </div>
  </div>
</template>

<script>
import Track from './track';
import Message from './message';
export default {
  data() {
    return {
      message: '发送弹幕',
      randomDanmu: [
        '哦',
        '你好',
        '我很好',
        '所以你呢',
        '我也非常好',
        '那我知道了哦',
        '可是我还不知道',
        '那你怎么才能知道',
        '这是一个字数递增的',
        '这是一个字数递增的句子'
      ],
      list: [],
      tracks: [{}, {}, {}],
      track: {},
    };
  },
  methods: {
    addMessage() {
      const { length } = this.randomDanmu;
      const message = this.randomDanmu[Math.floor(Math.random() * length + 0)];
      console.log('push-->', message);

      this.track.addChild(new Message({content: message}));
      const update = () => {
        this.track.update();
        setTimeout(update, 16);
      };
      setTimeout(update, 16);
    },

    calcTrackLength(track) {
      if (track.children && track.children.length > 0) {
        return track.children
          .map(child => child.length)
          .reduce((a, c) => a + c);
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

    update() {}
  },

  created() {
    // console.log('mounted....');
    this.track = new Track({
      top: 80
    });

    const message = new Message({
      content: '我爱北京天安门'
    });

    const message1 = new Message({
      content: '天安门上太阳升'
    });



    // this.track.addChild(message);
    // this.track.addChild(message1);

    // 多track
    this.list = this.randomDanmu;

    this.tracks.forEach((item, index) => {
      this.tracks[index] = new Track({
        top: 80 * (index + 1)
      });
    });

    // console.log('tracks-->', this.list);

    this.list.forEach(item => {
      const message = new Message({
        content: item
      });

      this.track.addChild(message);

      // const idleIndex = this.calcIdleTrack();
      // console.log(idleIndex);
      // this.tracks.forEach((item, index) => {
      //   if (idleIndex === index) {
      //     this.tracks[index].addChild(message);
      //     const update = () => {
      //       // stage.update();
      //       this.tracks[index].update();
      //       setTimeout(update, 16);
      //     };
      //     // setTimeout(update, 16);
      //   }
      // });
    });

    console.log(this.tracks);
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.wrap {
  width: 500px;
  height: 400px;
  background: darkseagreen;
  position: relative;
  margin-left: 50px;
}

.wrap .track {
  position: relative;
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
  background-color: cadetblue;
}

.wrap .track .text {
  position: absolute;
  /* width: 100%; */
  /* padding-left: 50px; */
  /* background: pink; */
  text-align: left;
  top: 50%;
  left: 100%;
  white-space: nowrap;
  /* font-size: 24px; */
  /* transform: translateX(-200%); */
  /* animation: moveLeft 8s linear; */
}

@keyframes moveLeft {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-200%);
  }
}
</style>
