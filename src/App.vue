<template>
  <div id="app">
    <button class="add" @click="addMessageMultiple(6)">{{message}}</button>
      <div class="wrap">
          <div class="track" v-for="item in danmuData" :key="item.id">
            <Message
              v-for="message in item.children" 
              :key="message.id"
              :duration="message.duration"
              :content="message.id + ':' + message.content"
            ></Message>
          </div>
      </div>
  </div>
</template>

<script>
import Message from './components/Message';
import Manager from "./manager";
const manager = new Manager();

export default {
  components: {
    Message,
  },
  data() {
    return {
      message: "发送弹幕",
      randomDanmu: [
        "哦",
        "你好",
        "我很好",
        "所以你呢",
        "我也非常好",
        "那我知道了哦",
        "可是我还不知道",
        "那你怎么才能知道",
        "这是一个字数递增的",
        "这是一个字数递增的句子"
      ],
      list: [],
      danmuData: [],
    };
  },
  methods: {
    addMessage() {
      const { length } = this.randomDanmu;
      const message = this.randomDanmu[Math.floor(Math.random() * length + 0)];
      console.log("push-->", message);
      manager.add({
        content: message
      });
    },
    addMessageMultiple(count) {
      for(let i=0; i<count; ++i){
        this.addMessage();
      }
    },
    updateDanmu() {
      this.danmuData = manager.getData();
    }
  },

  mounted() {
    this.updateDanmu();
    manager.on('update', this.updateDanmu);

    let to;
    const tickInterval = 200;

    const tick = () => {
      manager.tick();

      this.to = setTimeout(tick, tickInterval);
    }

    this.to = setTimeout(tick, tickInterval);

    // this.$on("add", (option) => manager.add(option));
    // this.tracks = manager.tracks;
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
  /* margin-left: 300px; */
}

.wrap .track {
  position: relative;
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
  background-color: cadetblue;
}
</style>
