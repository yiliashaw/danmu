<template>
  <div
    class="text"
    :style="{
      'animation-duration': duration/1000 + 's',
      fontSize: fontSize + 'px',
    }"
  >
    {{content}}
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String
    },
    duration: {
      type: Number
    },
    fontSize: {
      type: Number
    }
  },
  data() {
    return {};
  },
  mounted() {}
};
</script>

<style scoped>
.text {
  position: absolute;
  /* width: 100%; */
  /* padding-left: 50px; */
  /* background: pink; */
  text-align: left;
  top: 50%;
  left: 100%;
  white-space: nowrap;
  transform: translateX(0);
  /* transition: transform 1s linear; */
  font-size: 26px;
  animation: moveLeft 5s linear;
  background: rgba(255, 255, 255, 8);
  padding: 5px 15px;
  border-radius: 50px;
  color: #232323;
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

