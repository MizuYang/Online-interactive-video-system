<template>
  <div class="container my-5">
    <!-- //* 教師新增題目 -->
    <div class="my-4">
      <h2>教師出題</h2>
      <button type="button" @click="addQuestions">新增題目</button>
    </div>

    <div class="w-75" @click="goVideoMarkerPosition" ref="dropWrap">
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
      <template v-for="(question, index) in questionsList" :key="`questionItem${index}`">
        <div class="drop drop-style w30 bg-info text-center px-3 py-3" @mousedown="dragStart($event,`dropItem${index}`)" :data-question-id="question.id"
            :ref="`dropItem${index}`" :style="{left:`${question.x||430}px`, top:`${question.y||257}px`}" v-if="videoTime>=question.showTime&&videoTime<=question.showTime+0.5">
          {{ index }}
          <div class="text-start mb-0">
            標題
            <button type="button" @click="loseIndex(index)" :disabled="!questionsList[index].zIndex||questionsList[index].zIndex<=0">－</button>
            <button type="button" @click="addIndex(index)">＋</button>
            權重：<span :ref="`zIndexNum${index}`">0</span>
            <button type="button" class="btn btn-danger btn-sm ms-2 d-inline-block" @click="deleteQuestion(question.id)">X</button>
          </div>
          <input type="text" class="drop-style" v-model="questionsList[index].title">

          <p class="text-start mb-0">內容</p>
          <input type="text" class="drop-style" v-model="questionsList[index].content">

          <p class="text-start mb-0">答案</p>
          <input type="text" class="drop-style" v-model="questionsList[index].answer">
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      videoTime: 0,
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

      //* 取得當前移動題目窗 ID 並將當前 x,y 軸賦予到題目集裡
      const id = this.currentDropItem.getAttribute('data-question-id')
      const itemIndex = this.questionsList.findIndex(item => {
        return item.id === id
      })
      //* 變更拖曳位置
      this.questionsList[itemIndex].x = `${this.x}`
      this.questionsList[itemIndex].y = `${this.y}`
    },
    //* 滑鼠放開:拖動結束
    stop () {
      document.removeEventListener('mousemove', this.move)
      document.removeEventListener('mouseup', this.stop)
    },
    //* 新增考題
    addQuestions () {
      this.questionsList.push({
        id: this.randomString(),
        showTime: this.videoTime
      })
      this.getMarker()
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
    },
    //* 刪除題目
    deleteQuestion (id) {
      //* 取得要刪除的項目位置
      const deleteIndex = this.questionsList.findIndex(item => {
        return item.id === id
      })
      this.questionsList.splice(deleteIndex, 1)
    },
    //* 隨機生成 ID
    randomString () {
      const num = 10
      const t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; const a = t.length; let n = ''
      for (let i = 0; i < num; i++) n += t.charAt(Math.floor(Math.random() * a))
      return n
    },
    //* 取得時間軸標記
    getMarker () {
      const progessEl = this.player.elements.progress
      setTimeout(() => {
        //* 得到問題顯示時間在影片中的%數位置
        this.questionsList.forEach(item => {
        //* 題目位置 = 題目位置時間 / 影片總時間 *100
          const questionTime = Math.floor(item.showTime / this.player.duration * 100)
          //* 生成題目位置標記
          const span = document.createElement('button')
          span.classList.add('box')
          span.setAttribute('type', 'button')
          span.setAttribute('style', `left:${questionTime}%`)
          span.setAttribute('data-questionTime', item.showTime)
          span.setAttribute('title', item.title)
          progessEl.appendChild(span)
        })
      }, 500)
    },
    //* 跳轉到題目標記處
    goVideoMarkerPosition (e) {
      const isTimelineBtn = e.target.getAttribute('data-questionTime') !== null
      //* 如果是題目標記才執行
      if (isTimelineBtn) {
        const questionTime = e.target.getAttribute('data-questionTime')
        this.player.currentTime = parseInt(questionTime)
      }
    }
  },

  mounted () {
    this.dropWrap = this.$refs.dropWrap

    //* 取得播放器元素
    this.player = this.$refs.plyr.player
    this.player.on('timeupdate', (event) => {
    //* 取得當前影片播放時間
      this.videoTime = this.player.currentTime
    })
    //* 將播放器時間改為"增量計數器"而不是倒數計時
    this.player.config.invertTime = false
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

.w30 {
  max-width: 30%;
}
// .por {
//   position: relative;
// }
// .poa {
//   position: absolute;
// }
.box {
  position: absolute;
  top: 0%;
  left: 0;
  z-index: 50;
  padding: 8px 2px;
  background-color: red;
}
.box:hover {
  background-color: blue;
}
</style>
