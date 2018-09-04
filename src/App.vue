<template>
  <div id="app">
    <div class="action" style="display:flex">
      <div class="add" @click="addMessageMultiple(15)">发送弹幕</div>
      <div class="add" @click="cleanDanmu">清除弹幕</div>
    </div>
  <!-- DOM -->
    <div class="wrap" :style="{width: windowWidth+'px'}">
      <div>DOM</div>
      <div class="track" v-for="item in danmuData" :key="item.id">
        <transition-group name="left">
          <div
            class="text"
            v-for="message in item.children"
            :key="message.id"
            :style="{
              'animation-duration': message.duration/1000 + 's',
              fontSize: message.fontSize + 'px',
            }"
          >
            {{message.content}}
          </div>
        </transition-group>
      </div>
    </div>

  <!-- Canvas -->
    <div class="wrap" style="margin-top: 30px">
      <div>Canvas</div>
      <canvas id="danmu-canvas" :width="windowWidth" height="300px"></canvas>
    </div>
  </div>
</template>

<script>
import Manager from './danmu-dom/manager';
import CanvasManager from './danmu-canvas/manager.js';

const manager = new Manager();

export default {
  data() {
    return {
      message: '',
      windowWidth: 750,
      randomDanmu: [
        '噢',
        '你好',
        '我很好',
        '所以你呢',
        '我也非常好',
        '那我知道了哦',
        '可是我还不知道',
        '那你怎么才能知道',
        '这是一个字数递增的',
        '这是一个字数递增的句子',
        '这是一个字数递增的句子啊',
        '这是一个字数递增的句子你好',
        '这是一个字数递增的句子我很好',
        '这是一个字数递增的句子你还好吗',
        '这是一个字数递增的句子我也非常好',
        '这是一个字数递增的句子我也非常好好',
        '这是一个字数递增的句子我也非常好好好',
        '这是一个字数递增的句子我也非常好好好好',
        '这是一个字数递增的句子我也非常好好好好好',
        '这是一个字数递增的句子我也非常好好好好好好',
        '这是一个字数递增的句子这是一个字数递增的句子'
      ],
      danmuData: [],
      context: null,
      canvasManager: null
    };
  },

  methods: {
    addMessage() {
      const { length } = this.randomDanmu;
      const content = this.randomDanmu[Math.floor(Math.random() * length + 0)];
      console.log('push-->');
      manager.add(content);
      this.canvasManager.add(content);
    },

    addMessageMultiple(count) {
      for (let i = 0; i < count; ++i) {
        this.addMessage();
      }
    },

    cleanDanmu() {
      manager.cleanAll();
      this.canvasManager.cleanAll();
    },

    updateDanmu() {
      this.danmuData = manager.getData();
    }
  },

  mounted() {
    this.updateDanmu();
    manager.on('update', this.updateDanmu);

    const canvas = document.getElementById('danmu-canvas');
    this.context = canvas.getContext('2d');
    this.canvasManager = new CanvasManager({
      context: this.context,
      ratio: devicePixelRatio
    });
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.add {
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-bottom: 50px;
  margin-left: 50px;
  background: transparent;
  border: 2px solid #2c3e50;
  border-radius: 5px;
}

.add:hover {
  cursor: pointer;
}

.wrap {
  width: 750px;
  height: 300px;
  background: #555555;
  position: relative;
  overflow: hidden;
}

.wrap .track {
  position: relative;
  width: 100%;
  height: 30px;
  margin-bottom: 20px;
  color: #ffffff;
}

.text {
  position: absolute;
  text-align: left;
  top: 50%;
  left: 100%;
  white-space: nowrap;
  transform: translateX(0);
  font-size: 18px;
  background: rgba(255, 255, 255, 8);
  padding: 5px 15px;
  border-radius: 50px;
  color: #555555;
  /* animation-fill-mode: forwards; */
}
.left-enter-active {
  animation: moveLeft 5s linear;
}

@keyframes moveLeft {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-1800px);
  }
}
</style>
