<template>
  <div class="container my-5">
    <!-- //* 教師新增題目 -->
    <div class="my-4">
      <button type="button" @click="addQuestions">新增題目</button>
    </div>

    <div class="w-75 por" @click="goVideoMarkerPosition" ref="dropWrap">
      <!-- //* 影片播放器 -->
      <vue-plyr ref="plyr">
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
        <div class="drop drop-style w30 bg-info text-center px-3 py-3" @mousedown="dragStart($event,`dropItem${index}`)"
            :ref="`dropItem${index}`" v-for="(question, index) in questionsList" :key="`question${index}`">
          <p class="text-start mb-0">
            標題
            <button type="button" @click="loseIndex(index)" :disabled="!questionsList[index].zIndex||questionsList[index].zIndex<=0">－</button>
            <button type="button" @click="addIndex(index)">＋</button>
            權重：<span :ref="`zIndexNum${index}`">0</span>
          </p>
          <input type="text" class="drop-style">

          <p class="text-start mb-0">內容</p>
          <input type="text" class="drop-style">

          <p class="text-start mb-0">答案</p>
          <input type="text" class="drop-style">
        </div>
      <!-- </template> -->
    </div>
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
      dropWrap: '', //* 被拖動的題目外層
      currentDropItem: '', //* 當前被拖動的題目視窗
      questionsList: [] //* 老師要出的考題
    }
  },

  methods: {
    //* 滑鼠按下:拖動開始
    dragStart (e, dropItemRefName) {
      this.currentDropItem = this.$refs[dropItemRefName][0]
      //* 滑鼠變拖曳狀
      this.startX = e.clientX - this.currentDropItem.offsetLeft
      this.startY = e.clientY - this.currentDropItem.offsetTop

      //* 拖動時才開始監聽滑鼠移動、滑鼠放開
      document.addEventListener('mousemove', this.move)
      document.addEventListener('mouseup', this.stop)
    },
    //* 滑鼠移動:移動座標
    move (e) {
      //* 計算出拖曳物件最左上角座標
      this.x = e.clientX - this.startX
      this.y = e.clientY - this.startY

      //* 一開始先決定邊界範圍
      const area = {
        left: this.dropWrap.offsetLeft,
        right: this.dropWrap.offsetLeft + this.dropWrap.offsetWidth - this.currentDropItem.offsetWidth,
        top: this.dropWrap.offsetTop,
        bottom: this.dropWrap.offsetTop + this.dropWrap.offsetHeight - this.currentDropItem.offsetHeight
      }

      //* 這個要加在move  設定left與top之前
      this.x = Math.max(Math.min(this.x, area.right), area.left)
      this.y = Math.max(Math.min(this.y, area.bottom), area.top)

      //* 變更 wrap 拖曳位置
      this.currentDropItem.style.left = this.x + 'px'
      this.currentDropItem.style.top = this.y + 'px'
    },
    //* 滑鼠放開:拖動結束
    stop () {
      document.removeEventListener('mousemove', this.move)
      document.removeEventListener('mouseup', this.stop)
    },
    //* 新增考題
    addQuestions () {
      this.questionsList.push({})
    },
    //* 權重提高
    addIndex (index) {
      this.$refs[`dropItem${index}`][0].style.zIndex++
      this.$refs[`zIndexNum${index}`][0].textContent = this.$refs[`dropItem${index}`][0].style.zIndex
      this.questionsList[index].zIndex = this.$refs[`dropItem${index}`][0].style.zIndex
    },
    //* 權重降低
    loseIndex (index) {
      this.$refs[`dropItem${index}`][0].style.zIndex--
      this.$refs[`zIndexNum${index}`][0].textContent = this.$refs[`dropItem${index}`][0].style.zIndex
      this.questionsList[index].zIndex = this.$refs[`dropItem${index}`][0].style.zIndex
    }
  },

  mounted () {
    this.dropWrap = this.$refs.dropWrap
  }
}
</script>
<style lang='scss' scope>
.drop {
  position: absolute;
  top: 20%;
  left: 20%;
  user-select: none;
}
.drop-style {
  cursor: move;
  &:active {
    opacity: 0.7;
  }
}
</style>
