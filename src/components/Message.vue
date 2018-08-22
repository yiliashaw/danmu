<template>
  <div 
    class="text"
    :style="{
      // 'animation-duration': duration/1000 + 's',
      'transition-duration': duration/1000 + 's',
      transform: isAnimated ? 'translateX(-750px)' : 'translateX(0)'
    }"
  >
    {{content}}
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
    },
    duration: {
      type: Number,
    },
  },
  data() {
    return {
      isAnimated: false,
    };
  },
  mounted() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.isAnimated = true;
      });
    });
  },
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
  /* font-size: 24px; */
  /* animation: moveLeft 5s linear; */

}

@keyframes moveLeft {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-750px);
  }
}
</style>

