<template>
  <div class="container my-5">
    <!-- //* 教師新增題目 -->
    <div class="my-4">
      <h2>教師出題</h2>
      <button type="button" @click="addQuestions">新增題目</button>
      <input type="checkbox" class="ms-3" id="autoplay" v-model="options.autoplay" @change="setAutoplay">
      <label for="autoplay">自動播放</label>
    </div>

    <div class="por">
      <div class="w-75" @click="goVideoMarkerPosition" ref="dropWrap">

        <!-- //* 影片播放器 -->
        <VideoPlyr></VideoPlyr>

        <!-- //* 被拖曳的物件 -->
        <DropItem :dropWrap="dropWrap" :videoTime="videoTime"></DropItem>

      </div>
    </div>
  <!-- 確認出題按鈕 -->
  <div class="my-3">
    <button type="button" @click="confirmQuestions" v-if="questionsList.length>0">確認出題</button>
  </div>
  </div>

</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Tooltip from 'bootstrap/js/src/tooltip'
import VideoPlyr from '../components/video/plyr/PlyrVideo.vue'
import DropItem from '../components/video/drop/DropItem.vue'
export default {
  components: {
    VideoPlyr,
    DropItem
  },

  data () {
    return {
      // options: {
      //   autoplay: localStorage.getItem('vid-autoplay') || false
      // },
      videoTime: 0,
      vidStopDisabled: false,
      vidBorder: {}, //* 影片播放器邊界
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
    ...mapState(['questionsList2', 'plyr', 'options'])
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
    ...mapMutations(['SAVE_QUESTIONS_LIST', 'SAVE_OPTIONS']),

    //* 新增考題
    addQuestions () {
      this.player.pause()
      this.questionsList.push({
        id: this.randomString(),
        showTime: this.videoTime,
        x: 0,
        y: 0,
        width: 248,
        height: 234
      })

      this.getMarker() //* 生成標記

      //* 把資料傳回 store
      this.$store.commit('SAVE_QUESTIONS_LIST', { questionsList: this.questionsList })
    },
    // //* 權重提高
    // addIndex (index) {
    //   this.$refs[`dropItem${index}`][0].style.zIndex++
    //   this.$refs[`zIndexNum${index}`][0].textContent = this.$refs[`dropItem${index}`][0].style.zIndex
    //   this.questionsList[index].zIndex = this.$refs[`dropItem${index}`][0].style.zIndex

    //   //* 把資料傳回 store
    //   this.$store.commit('SAVE_QUESTIONS_LIST', { questionsList: this.questionsList })
    // },
    // //* 權重降低
    // loseIndex (index) {
    //   this.$refs[`dropItem${index}`][0].style.zIndex--
    //   this.$refs[`zIndexNum${index}`][0].textContent = this.$refs[`dropItem${index}`][0].style.zIndex
    //   this.questionsList[index].zIndex = this.$refs[`dropItem${index}`][0].style.zIndex

    //   //* 把資料傳回 store
    //   this.$store.commit('SAVE_QUESTIONS_LIST', { questionsList: this.questionsList })
    // },
    // //* 刪除題目
    // deleteQuestion (id) {
    //   //* 取得要刪除的項目位置
    //   const deleteIndex = this.questionsList.findIndex(item => {
    //     return item.id === id
    //   })
    //   this.questionsList.splice(deleteIndex, 1)
    //   this.getMarker()

    //   //* 把資料傳回 store
    //   this.$store.commit('SAVE_QUESTIONS_LIST', { questionsList: this.questionsList })
    // },
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
          <button type="button" class="marker" id="markerWarp" style="left:${questionTime}%" data-questionTime="${item.showTime}"
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
      this.$store.commit('SAVE_QUESTIONS_LIST', { questionsList: this.questionsList })
      this.$store.commit('SAVE_OPTIONS', { options: this.options })
      console.log('題目：', this.questionsList)
      console.log('配置項目', this.options)
    }
  },

  mounted () {
    //* 取得播放器元素
    this.player = this.plyr
    this.dropWrap = this.$refs.dropWrap

    if (this.questionsList2.length > 0) {
      this.questionsList = this.questionsList2
      this.getMarker()
    }
    //* 將播放器時間改為"增量計數器"而不是倒數計時
    this.player.config.invertTime = false

    this.player.on('timeupdate', (event) => {
    //* 取得當前影片播放時間
      this.videoTime = this.player.currentTime

      //* 題目出現時自動暫停
      this.questionsList.forEach((question, index, arr) => {
      //* 如果影片時間抵達題目顯示時間時
        if (this.videoTime >= question.showTime && this.videoTime <= question.showTime + 0.5) {
        //* 如果沒鎖定暫停影片時
          if (!this.vidStopDisabled) {
          //* 鎖定暫停
            this.vidStopDisabled = true
            //* 顯示題目、暫停播放
            this.player.pause()
          }
        }
        this.currentMarkStyle()
        // ? 若沒鎖定暫停的話，提交答案後因為影片一樣在設定顯示時間，所以會再度暫停，所以需要將暫停鎖定
        //* 鎖定時間 = 影片當前時間 >= 下一個題目顯示的時間(鎖定到下一個題目前解除)
        //* 如果有下一個需顯示的題目才做解除鎖定時間的計算(解決沒下一題計算時跳出的錯誤)
        if (arr[index + 1]) {
          //* 到下一題的前0.5秒解除鎖定
          const lockTime = this.videoTime >= arr[index + 1].showTime - 0.5 && this.videoTime <= arr[index + 1].showTime
          //* 如果影片時間來到下一個題目顯示的時間 (0.5秒後解除鎖定)
          if (lockTime) {
            this.vidStopDisabled = false
          }
        } else if (this.videoTime >= arr[arr.length - 1].showTime + 0.5) {
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
  user-select: none;
  min-width: 20%;
  min-height: 25%;
}
.drop-style {
  cursor: move;
  &:active {
    opacity: 0.7;
  }
}
.por {
  position: relative;
}

.marker {
  position: absolute;
  top: 0%;
  left: 0;
  z-index: 50;
  padding: 8px 2px;
  background-color: red;
}
.marker:hover {
  background-color: blue;
}
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
