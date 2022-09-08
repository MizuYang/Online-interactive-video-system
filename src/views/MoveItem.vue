<template>
  <div class="container my-5">
    <!-- //* 教師新增題目 -->
    <div class="my-4">
      <h2>教師出題</h2>
      <button type="button" @click="addQuestions">新增題目</button>
      <input type="checkbox" class="ms-3" id="autoplay" v-model="options.autoplay" @change="setAutoplay">
      <label for="autoplay">自動播放</label>
    </div>

    <div class="por w-75" @click="goVideoMarkerPosition" ref="dropWrap">
      <!-- //* 影片播放器 -->
      <vue-plyr ref="plyr">
        <video
          :autoplay="options.autoplay==='true'"
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
        <div class="drop drop-style bg-info text-center px-3 py-3" @mousedown="dragStart($event,`dropItem${index}`)" :data-question-id="question.id"
            :ref="`dropItem${index}`" :style="{left:`${question.x}px`, top:`${question.y}px`,width:`${question.width}px`, height: `${question.height}px`}" v-show="videoTime>=question.showTime&&videoTime<=question.showTime+0.5">
            <!-- v-if="Math.floor(videoTime)===Math.floor(question.showTime)" -->
          <div class="d-flex justify-content-between">
            <div class="text-start">
              <button type="button" class="btn btn-secondary btn-sm p-1" @click="sizeSmaller(index)">小</button>
              <button type="button" class="btn btn-secondary btn-sm mx-1 p-1" @click="sizeBigger(index)">大</button>
            </div>
            <h3 class="text-center">第{{ index+1 }}題</h3>
            <div>
                <button type="button" class="btn btn-danger btn-sm ms-3 d-inline-block" @click="deleteQuestion(question.id)">X</button>
            </div>
          </div>
          <div class="text-start mb-0">
            標題
            <button type="button" @click="loseIndex(index)" :disabled="!questionsList[index].zIndex||questionsList[index].zIndex<=0">－</button>
            <button type="button" @click="addIndex(index)">＋</button>
            權重：<span :ref="`zIndexNum${index}`">0</span>
          </div>
          <input type="text" class="drop-style" v-model.lazy="questionsList[index].title">

          <p class="text-start mb-0">內容</p>
          <input type="text" class="drop-style" v-model.lazy="questionsList[index].content">

          <p class="text-start mb-0">答案</p>
          <input type="text" class="drop-style" v-model.lazy="questionsList[index].answer">

          <!-- 拖曳按鈕 -->
          <a href="javascript:;" class="changeSizeBtn top" @mousedown.prevent.stop="dragChangeSize($event,index)"></a>
          <a href="javascript:;" class="changeSizeBtn left" @mousedown.prevent.stop="dragChangeSize($event,index)"></a>
          <a href="javascript:;" class="changeSizeBtn right" @mousedown.prevent.stop="dragChangeSize($event,index)"></a>
          <a href="javascript:;" class="changeSizeBtn bottom" @mousedown.prevent.stop="dragChangeSize($event,index)"></a>
        </div>
      </template>
    </div>
  <!-- 確認出題按鈕 -->
  <div class="my-3">
    <button type="button" @click="confirmQuestions" v-if="questionsList.length>0">確認出題</button>
  </div>
  </div>

</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Tooltip from '../../node_modules/bootstrap/js/src/tooltip.js'
export default {
  data () {
    return {
      options: {
        autoplay: localStorage.getItem('vid-autoplay') || false
      },
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

  computed: {
    ...mapState(['questionsList2'])
  },

  watch: {
    questionsList: {
      handler () {
        this.hoverMarkerTips()
      },
      deep: true
    }
  },

  methods: {
    ...mapMutations(['CONFIRM_QUESTIONS']),
    sizeBigger (index) {
      this.$refs[`dropItem${index}`][0].style.width = `${this.$refs[`dropItem${index}`][0].offsetWidth + 50}`
    },
    sizeSmaller (index) {
      this.$refs[`dropItem${index}`][0].style.width = `${this.$refs[`dropItem${index}`][0].offsetWidth - 50}`
    },
    //* 拖曳改變元素大小
    dragChangeSize (e, index) {
      const that = this
      const currentDropItem = this.$refs[`dropItem${index}`][0]

      //* 一開始先決定邊界範圍
      const area = {
        left: this.dropWrap.offsetLeft,
        right: this.dropWrap.offsetLeft + this.dropWrap.offsetWidth - currentDropItem.offsetWidth,
        top: this.dropWrap.offsetTop,
        bottom: this.dropWrap.offsetTop + this.dropWrap.offsetHeight - currentDropItem.offsetHeight
      }

      let dir = '' // 设置好方向
      const firstX = e.clientX // 获取第一次点击的横坐标
      const firstY = e.clientY // 获取第一次点击的纵坐标
      const width = currentDropItem.offsetWidth // 获取到元素的宽度
      const height = currentDropItem.offsetHeight // 获取到元素的高度
      // const Left = currentDropItem.offsetLeft // 获取到距离左边的距离
      // const Top = currentDropItem.offsetTop // 获取到距离上边的距离

      const Left = currentDropItem.offsetLeft // 获取到距离左边的距离
      const Top = currentDropItem.offsetTop // 获取到距离上边的距离

      // 下一步判断方向距离左边的距离+元素的宽度减去自己设定的宽度，只要点击的时候大于在这个区间，他就算右边
      if (firstX > Left + width - 10) {
        dir = 'right'
      } else if (firstX < Left + 10) {
        dir = 'left'
      }
      if (firstY > Top + height - 10) {
        dir = 'bottom'
      } else if (firstY < Top + 10) {
        dir = 'top'
      }
      // 判断方向结束
      document.onmousemove = function (e) {
        if (dir === 'left') {
          if (e.clientX < firstX) {
            //* 如果沒超過邊界才變更寬度
            if (e.clientX >= area[dir]) {
              //* 將寬度、座標傳回資料集
              that.questionsList[index].width = width - (e.clientX - firstX)
              that.questionsList[index].x = Left + (e.clientX - firstX)
              currentDropItem.style.width = width - (e.clientX - firstX)
              currentDropItem.style.left = Left + (e.clientX - firstX)
            }
          }
        } else if (dir === 'right') {
          //* 如果沒超過邊界才變更寬度
          if (area[dir] >= Left + (e.clientX - firstX)) {
            //* 將寬度、座標傳回資料集
            that.questionsList[index].width = width + (e.clientX - firstX)
            currentDropItem.style.width = width + (e.clientX - firstX)
          }
        } else if (dir === 'top') {
          console.log('右邊界：', area[dir], '滑鼠當前座標：', e.clientY)
          console.log('右邊', Top)
          console.log(e.clientY - firstY)
          console.log(!e.clientY === area[dir])
          if (e.clientY < firstY) {
            //* 如果沒超過邊界才變更寬度
            if (e.clientY >= area[dir]) {
              //* 將寬度、座標傳回資料集
              that.questionsList[index].height = height - (e.clientY - firstY)
              that.questionsList[index].y = Top + (e.clientY - firstY)
              currentDropItem.style.height = height - (e.clientY - firstY)
              currentDropItem.style.top = Top + (e.clientY - firstY)
            }
          }
        } else if (dir === 'bottom') {
          //* 如果沒超過邊界才變更寬度
          if (area[dir] >= Top + (e.clientY - firstY)) {
            //* 將寬度、座標傳回資料集
            that.questionsList[index].height = height + (e.clientY - firstY)
            currentDropItem.style.height = height + (e.clientY - firstY)
          }
        }
      }
      //* 清除事件
      document.onmouseup = function () {
        document.onmousemove = null
      }
    },
    //* 滑鼠按下:拖動開始
    dragStart (e, dropItemRefName) {
      //* 如果點擊的是控制大小的 a 標籤，則中斷程式碼
      if (e.target.nodeName === 'A') return
      if (e.target.nodeName === 'BUTTON') return
      this.currentDropItem = this.$refs[dropItemRefName][0]

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
        showTime: this.videoTime,
        x: '61',
        y: '170',
        width: '248',
        height: '234'
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
        //* 生成一個 span(markerWarp) 掛在 progess 底下，用來掛載所有標記按鈕
        const span = document.createElement('span')
        span.setAttribute('id', 'markerWarp')
        progessEl.appendChild(span)
        hasmMarkerWarp = true
      }
      setTimeout(() => {
        let str = ''
        //* 得到問題顯示時間在影片中的%數位置
        this.questionsList.forEach(item => {
        //* 題目位置 = 題目位置時間 / 影片總時間 *100
          const questionTime = Math.floor(parseInt(item.showTime) / parseInt(this.player.duration) * 100)
          //* 生成標記
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
      }, 100)
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
      const arr = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new Tooltip(tooltipTriggerEl)
      })
      if (arr.length > 0) {
        this.questionsList.forEach((item, index) => {
          //* 如果有標題
          if (item.title) {
            //* 加上第幾題+題目標題
            arr[index]._config.title = `第${index + 1}題, ${item.title}`
          }
        })
      }
    },
    //* 設定自動播放
    setAutoplay () {
      localStorage.setItem('vid-autoplay', this.options.autoplay)
      if (this.options.autoplay) {
        this.player.play()
      }
    },
    //* 確定出題
    confirmQuestions () {
      this.$store.commit('CONFIRM_QUESTIONS', { questionsList: this.questionsList, options: this.options })
      console.log('題目：', this.questionsList)
      console.log('配置項目', this.options)
    }
  },

  mounted () {
    //* 取得播放器元素
    this.player = this.$refs.plyr.player

    if (this.questionsList2.length > 0) {
      this.questionsList = this.questionsList2
      this.getMarker()
    }
    this.dropWrap = this.$refs.dropWrap

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
  }
}
</script>
<style lang='scss' scope>
.drop {
  position: absolute;
  // top: 0%;
  // left: 0%;
  // top: 20%;
  // left: 20%;
  user-select: none;
  // border:4px solid blue;
  min-width: 20%;
  min-height: 25%;
}
.drop-style {
  cursor: move;
  &:active {
    opacity: 0.7;
  }
}
// .por {
//   position: relative;
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
//* 測試拖曳大小
.changeSizeBtn {
  position: absolute;
  padding: 3px;
  background: #fff;
  border: 1px solid blue;
}
.left {
  top: 50%;
  left: -4px;
  transform: translateY(-50%);
  cursor: e-resize;
}
.right {
  top: 50%;
  right: -4px;
  transform: translateY(-50%);
  cursor: e-resize;
}
.top {
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
   cursor: n-resize;
}
.bottom {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
   cursor: n-resize;
}
</style>
