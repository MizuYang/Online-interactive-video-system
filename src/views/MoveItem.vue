<template>
  <div class="w-75 por" @click="goVideoMarkerPosition" ref="questionWrap">
    <!-- //* 影片播放器 -->
    <vue-plyr :options="options" ref="plyr">
      <video
        controls
        crossorigin
        playsinline
        data-poster="poster.jpg"
      >
        <source
          size="720"
          src="../assets/video/有聲影片測試.mp4"
          type="video/mp4"
        />
        <source
          size="1080"
          src="../assets/video/有聲影片測試.mp4"
          type="video/mp4"
        />
        <track
          default
          kind="captions"
          label="English captions"
          src="../assets/video/有聲影片測試.mp4"
          srclang="en"
        />
      </video>
    </vue-plyr>
    <!-- //* 被拖曳的物件 -->
    <!-- <template v-for="(question, index) in questionsList" :key="`question${index}`"> -->
      <div class="move move-style w30 bg-info text-center px-3 py-3" @mousedown="dragStart" @mouseup="dragEnd"
          ref="questionItem">
        <p class="text-start mb-0">標題</p><input type="text" class="move-style">
        <p class="text-start mb-0">內容</p><input type="text" class="move-style">
        <p class="text-start mb-0">答案</p><input type="text" class="move-style">
      </div>
    <!-- </template> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      startX: '',
      startY: '',
      x: '',
      y: '',
      questionWrap: '', //* 被拖動的題目外層
      questionItem: '' //* 要被拖動的題目視窗
    }
  },

  methods: {
    //* 滑鼠按下:拖動開始
    dragStart (e) {
      //* 視窗半透明
      this.$refs.questionItem.style.opacity = '0.7'
      //* 滑鼠變拖曳狀
      this.startX = e.clientX - this.questionItem.offsetLeft
      this.startY = e.clientY - this.questionItem.offsetTop
      document.addEventListener('mousemove', this.move)
      document.addEventListener('mouseup', this.stop)
    },
    //* 滑鼠放開:拖動結束
    dragEnd () {
      this.$refs.questionItem.style.opacity = '1'
    },
    //* 滑鼠移動:移動座標
    move (e) {
      // 計算出拖曳物件最左上角座標
      this.x = e.clientX - this.startX
      this.y = e.clientY - this.startY

      // 一開始先決定邊界範圍
      const area = {
        left: this.questionWrap.offsetLeft,
        right: this.questionWrap.offsetLeft + this.questionWrap.offsetWidth - this.questionItem.offsetWidth,
        top: this.questionWrap.offsetTop,
        bottom: this.questionWrap.offsetTop + this.questionWrap.offsetHeight - this.questionItem.offsetHeight
      }

      // 這個要加在move  設定left與top之前
      this.x = Math.max(Math.min(this.x, area.right), area.left)
      this.y = Math.max(Math.min(this.y, area.bottom), area.top)

      this.questionItem.style.left = this.x + 'px'
      this.questionItem.style.top = this.y + 'px'
    },
    stop () {
      //* 拖曳時滑鼠超出可拖曳範圍後放開，解除半透明
      this.$refs.questionItem.style.opacity = '1'
      document.removeEventListener('mousemove', this.move)
      document.removeEventListener('mouseup', this.stop)
    }
  },

  mounted () {
    this.questionWrap = this.$refs.questionWrap
    this.questionItem = this.$refs.questionItem
  }
}
</script>
<style lang='scss' scope>
.move {
  position: absolute;
  top: 20%;
  left: 20%;
  user-select: none;
}
.move-style {
  cursor: move;
}
</style>
