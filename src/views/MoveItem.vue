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
            <!-- v-if="Math.floor(videoTime)===Math.floor(question.showTime)" -->
          第{{ index+1 }}題
          <div class="text-start mb-0">
            標題
            <button type="button" @click="loseIndex(index)" :disabled="!questionsList[index].zIndex||questionsList[index].zIndex<=0">－</button>
            <button type="button" @click="addIndex(index)">＋</button>
            權重：<span :ref="`zIndexNum${index}`">0</span>
            <button type="button" class="btn btn-danger btn-sm ms-2 d-inline-block" @click="deleteQuestion(question.id)">X</button>
          </div>
          <input type="text" class="drop-style" v-model.lazy="questionsList[index].title">

          <p class="text-start mb-0">內容</p>
          <input type="text" class="drop-style" v-model.lazy="questionsList[index].content">

          <p class="text-start mb-0">答案</p>
          <input type="text" class="drop-style" v-model.lazy="questionsList[index].answer">
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Tooltip from '../../node_modules/bootstrap/js/src/tooltip.js'
export default {
  data () {
    return {
      videoTime: 0,
      vidStopDisabled: false,
      startX: '',
      startY: '',
      x: '',
      y: '',
      dropWrap: '', //* 被拖動的題目外層
      currentDropItem: '', //* 當前被拖動的題目視窗
      questionsList: [] //* 老師要出的考題
    }
  },

  watch: {
    questionsList: {
      handler (questions) {
        this.hoverMarkerTips()
        // questions.forEach(item => {
        //   if (item.title) {
        //     console.log('有標提ㄌ')
        //     const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        //     console.log('tooltipTriggerList', tooltipTriggerList)
        //     tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        //       return new Tooltip(tooltipTriggerEl)
        //     })
        //     console.log('tooltipTriggerList', tooltipTriggerList)
        //     tooltipTriggerList.forEach(que => {
        //       const title = que.getAttribute('title')
        //       que.setAttribute('title', title)
        //     })
        //   }
        // })
      },
      deep: true
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
      this.player.pause()
      this.questionsList.push({
        id: this.randomString(),
        showTime: this.videoTime
      })
      this.getMarker() //* 生成標記
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
      this.getMarker()
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

      let hasmMarkerWarp = null
      this.player.elements.progress.children.forEach(item => {
        //* 如果有 markerWarp 就不再重複生成 markerWarp 了
        if (item.getAttribute('id') === 'markerWarp') {
          hasmMarkerWarp = true
        }
      })
      //! 如果沒有 markerWarp 才生成 markerWarp
      if (!hasmMarkerWarp) {
        //* 生成一個 span 掛在 progess 底下，用來掛載所有標記按鈕
        const span = document.createElement('span')
        span.setAttribute('id', 'markerWarp')
        progessEl.appendChild(span)
        hasmMarkerWarp = true
      }
      // setTimeout(() => {
      let str = ''
      //* 得到問題顯示時間在影片中的%數位置
      this.questionsList.forEach(item => {
        //* 題目位置 = 題目位置時間 / 影片總時間 *100
        const questionTime = Math.floor(item.showTime / this.player.duration * 100)
        //* 生成題目位置標記
        // const btn = document.createElement('button')

        // btn.classList.add('box')
        // btn.setAttribute('type', 'button')
        // btn.setAttribute('style', `left:${questionTime}%`)
        // btn.setAttribute('data-questionTime', item.showTime)
        // // btn.setAttribute('title', item.title)
        // //* BS5 提示視窗元件
        // // btn.setAttribute('title', item.title)
        // btn.setAttribute('data-bs-toggle', 'tooltip')
        // btn.setAttribute('data-bs-placement', 'bottom')
        // progessEl.appendChild(btn)
        str += `
          <button type="button" class="box" id="markerWarp" style="left:${questionTime}%" data-questionTime="${item.showTime}"
            data-bs-toggle="tooltip" data-bs-placement="bottom"></button>
          `
      })
      //* 使用 innerHTML 的方式覆蓋，才不會有重複生成的元素
      const markerWarp = document.getElementById('markerWarp')
      if (markerWarp) {
        markerWarp.innerHTML = str
      }
      // }, 500)
    },
    //* 跳轉到題目標記處
    goVideoMarkerPosition (e) {
      const isTimelineBtn = e.target.getAttribute('data-questionTime') !== null
      //* 如果是題目標記才執行
      if (isTimelineBtn) {
        const questionTime = e.target.getAttribute('data-questionTime')
        this.player.currentTime = parseInt(questionTime) + 0.5
      }
    },
    //* '當前時間軸標記變藍色，否則不變色
    currentMarkStyle () {
      //* 抵達時間軸上該標記時，標記變為藍色
      //* 取出所有標記的元素 (前三個會是套件的元件:時間軸外殼、時間軸條、時間tip)
      const markers = this.player.elements.progress.children[3].children
      markers.forEach(mark => {
        const markTime = parseInt(mark.getAttribute('data-questiontime'))
        console.log(markTime)
        console.log(Math.floor(this.videoTime))
        //* 如果標記時間 === 當前影片播放的時間，標記變藍色
        if (markTime === Math.floor(this.videoTime)) {
          mark.style.backgroundColor = 'blue'
        } else {
          //* 如果影片播放時間不是標記時間，則變回紅色
          mark.style.backgroundColor = 'red'
        }
      })
    },
    //* 標記 hover 文字提示
    hoverMarkerTips () {
      const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
      console.log(tooltipTriggerList)
      const arr = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new Tooltip(tooltipTriggerEl)
      })
      console.log(arr)
      if (arr.length > 0) {
        this.questionsList.forEach((item, index) => {
          if (item.title) {
            arr[index]._config.title = item.title
          }
        })
      }
    }
  },

  mounted () {
    this.dropWrap = this.$refs.dropWrap

    //* 取得播放器元素
    this.player = this.$refs.plyr.player

    //* 將播放器時間改為"增量計數器"而不是倒數計時
    this.player.config.invertTime = false

    this.player.on('timeupdate', (event) => {
    //* 取得當前影片播放時間
      this.videoTime = this.player.currentTime

      //* 題目出現時自動暫停
      this.questionsList.forEach((question, index) => {
      //* 如果影片時間抵達題目顯示時間時
        // if (Math.floor(this.videoTime) === Math.floor(question.showTime)) {
        if (this.videoTime >= question.showTime && this.videoTime <= question.showTime + 0.5) {
        //* 如果沒鎖定暫停影片時
          if (!this.vidStopDisabled) {
          //* 鎖定暫停
            this.vidStopDisabled = true
            //* 顯示題目、暫停播放
            // setTimeout(() => {
            this.player.pause()
            // }, 200)
          }
        }
        this.currentMarkStyle()
        // ? 若沒鎖定暫停的話，提交答案後因為影片一樣在設定顯示時間，所以會再度暫停，所以需要將暫停鎖定
        //* 鎖定時間 = 影片當前時間 >= 下一個題目顯示的時間(鎖定到下一個題目前解除)
        //* 如果有下一個需顯示的題目才做解除鎖定時間的計算(解決沒下一題計算時跳出的錯誤)
        if (this.questionsList[index + 1]) {
          const lockTime = this.videoTime >= this.questionsList[index + 1].showTime && this.videoTime <= this.questionsList[index + 1].showTime + 0.5
          //* 如果影片時間來到下一個題目顯示的時間 (0.5秒後解除鎖定)
          if (lockTime) {
            this.vidStopDisabled = false
          }
        } else if (this.videoTime >= this.questionsList[this.questionsList.length - 1].showTime + 0.5) {
        //* 如果當前影片時間到顯示最後一題的時間(沒有下一題)
        //* 一秒後自動解除鎖定(自動解除鎖定，若用戶跳回去過去題目顯示的時間，即可正常顯示題目)
          setTimeout(() => {
            this.vidStopDisabled = false
          }, 1000)
        }
      })
    })

    // const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    // console.log(tooltipTriggerList)
    // const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    //   return new Tooltip(tooltipTriggerEl)
    // })
    // console.log(tooltipList)
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
