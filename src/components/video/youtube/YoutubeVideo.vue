<template>
  <header>
    <h2>學生考試模擬(教師使用 Youtube 影片)</h2>
    <p v-if="questionsList2.length>0">教師選擇影片
      <span ref="autoplayTips2" class="fw-bold border-bottom"></span>
    </p>
  </header>
  <div class="por w-75" ref="dropWrap2" @click="$goVideoMarkerPosition">

    <!-- Youtube 影片播放器 -->
    <div class="plyr__video-embed" id="player" v-show="questionsList2.length>0">
      <iframe src="https://www.youtube.com/watch?v=B-BQnCwTBeQ"
              allowfullscreen allowtransparency allow="autoplay">
      </iframe>
    </div>

    <!-- 題目 -->
    <DropItem :dropWrap="dropWrap2" :videoTime="videoTime"></DropItem>

    <h3 class="text-danger my-5" v-show="questionsList2.length===0">
      目前沒有題目唷，請先到"<router-link to="/moveItem">練習拖曳</router-link>"中出題目~
    </h3>
  </div>
</template>

<script>
import Plyr from '../../../../node_modules/plyr'
// import Tooltip from 'bootstrap/js/src/tooltip'
import { mapState } from 'vuex'

import DropItem from '../drop/DropQuestions.vue'
export default {
  components: {
    DropItem
  },

  data () {
    return {
      player: '',
      videoTime: 0,
      dropWrap2: '',
      vidStopDisabled: false,
      questionsList: []
    }
  },

  computed: {
    ...mapState(['options', 'questionsList2'])
  },

  methods: {
    //* 取得時間軸標記
    // getMarker () {
    //   const progessEl = this.player.elements.progress

    //   let hasmMarkerWarp = null

    //   this.player.elements.progress.children.forEach(item => {
    //     //* 如果有 markerWarp 就不再重複生成 markerWarp 了
    //     if (item.getAttribute('id') === 'markerWarp') {
    //       hasmMarkerWarp = true
    //     }
    //   })
    //   //! 如果沒有 markerWarp 才生成 markerWarp
    //   if (!hasmMarkerWarp) {
    //     //* 生成一個 span 掛在 progess 底下，用來掛載所有標記按鈕
    //     const span = document.createElement('span')
    //     span.setAttribute('id', 'markerWarp')
    //     progessEl.appendChild(span)
    //     hasmMarkerWarp = true
    //   }
    //   let str = ''
    //   //* 得到問題顯示時間在影片中的%數位置
    //   this.questionsList2.forEach(item => {
    //     //* 題目位置 = 題目位置時間 / 影片總時間 *100
    //     const questionTime = Math.floor(item.showTime / this.player.duration * 100)
    //     str += `
    //       <button type="button" class="marker" id="markerWarp" style="left:${questionTime}%" data-questionTime="${item.showTime}"
    //         data-bs-toggle="tooltip" data-bs-placement="bottom"></button>
    //       `
    //   })
    //   //* 使用 innerHTML 的方式覆蓋，才不會有重複生成的元素
    //   const markerWarp = document.getElementById('markerWarp')
    //   if (markerWarp) {
    //     markerWarp.innerHTML = str
    //   }

    //   //* 取得標記 hover 文字提示
    //   this.hoverMarkerTips()
    // },
    //* 跳轉到題目標記處
    // goVideoMarkerPosition (e) {
    //   const isTimelineBtn = e.target.getAttribute('data-questionTime') !== null
    //   //* 如果是題目標記才執行
    //   if (isTimelineBtn) {
    //     const questionTime = e.target.getAttribute('data-questionTime')
    //     this.player.currentTime = parseInt(questionTime) + 0.5
    //   }
    // },
    //* '當前時間軸標記變藍色，否則不變色
    // currentMarkStyle () {
    //   //* 抵達時間軸上該標記時，標記變為藍色
    //   //* 取出所有標記的元素 (前三個會是套件的元件:時間軸外殼、時間軸條、時間tip)
    //   const markers = this.player.elements.progress.children[3].children
    //   markers.forEach(mark => {
    //     const markTime = parseInt(mark.getAttribute('data-questiontime'))
    //     //* 如果標記時間 === 當前影片播放的時間，標記變藍色
    //     if (markTime === Math.floor(this.videoTime)) {
    //       mark.style.backgroundColor = 'blue'
    //     } else {
    //       //* 如果影片播放時間不是標記時間，則變回紅色
    //       mark.style.backgroundColor = 'red'
    //     }
    //   })
    // },
    //* 標記 hover 文字提示
    // hoverMarkerTips () {
    //   const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
    //   const arr = tooltipTriggerList.map(function (tooltipTriggerEl) {
    //     return new Tooltip(tooltipTriggerEl)
    //   })
    //   if (arr.length > 0) {
    //     this.questionsList2.forEach((item, index) => {
    //       //* 如果有標題
    //       if (item.title) {
    //         //* 加上第幾題+題目標題
    //         arr[index]._config.title = `第${index + 1}題, ${item.title}`
    //       }
    //     })
    //   }
    // }
  },

  mounted () {
    //* 如果沒題目就中斷
    if (this.questionsList2.length === 0) return

    //* 取得播放器外圍
    this.dropWrap2 = this.$refs.dropWrap2
    this.player = new Plyr('#player', {
      // noCookie: false,
      // rel: 0,
      // showinfo: 0,
      // iv_load_policy: 3,
      // modestbranding: 1,
      invertTime: false, //* 將播放器時間改為"增量計數器"而不是倒數計時
      tooltips: { controls: true, seek: true }, //* icon hover 文字提示
      i18n: {
        restart: '重播',
        rewind: '倒帶 {seektime} 秒',
        fastForward: '快轉 {seektime} 秒',
        play: '播放',
        pause: '暫停',
        seek: '尋找',
        played: '已播放',
        buffered: '緩衝',
        currentTime: '目前時間',
        duration: '總共時間',
        volume: '音量',
        mute: '靜音',
        unmute: '取消靜音',
        captions: '內嵌字幕',
        enableCaptions: '開啟內嵌字幕',
        disableCaptions: '關閉內嵌字幕',
        enterFullscreen: '全螢幕',
        exitFullscreen: '退出全螢幕',
        frameTitle: '{title} 播放器',
        settings: '設定',
        speed: '播放速率',
        normal: '一般',
        quality: '畫質',
        loop: '循還播放',
        start: '開始',
        end: '結束',
        all: '全部',
        reset: '重置',
        disabled: '關閉',
        advertisement: '廣告'
      }
    })

    this.questionsList = this.questionsList2

    //* 自動播放提示
    const isAutoplay = this.options.autoplay
    this.$refs.autoplayTips2.textContent = isAutoplay ? '自動播放' : '手動播放'

    //* 取得時間戳記
    setTimeout(() => {
      this.$getMarker()
      this.$hoverMarkerTips()
    }, 1000)

    this.player.on('timeupdate', (event) => {
      //* 取得當前影片播放時間
      this.videoTime = this.player.currentTime

      //* 題目出現時自動暫停
      this.$questionShowVidStop()
      // this.questionsList2.forEach((question, index, arr) => {
      // //* 如果影片時間抵達題目顯示時間時
      //   if (this.videoTime >= question.showTime && this.videoTime <= question.showTime + 0.5) {
      //   //* 如果沒鎖定暫停影片時
      //     if (!this.vidStopDisabled) {
      //     //* 鎖定暫停
      //       this.vidStopDisabled = true
      //       //* 顯示題目、暫停播放
      //       this.player.pause()
      //     }
      //   }
      //   setTimeout(() => {
      //     this.$currentMarkStyle()
      //   }, 100)
      //   // ? 若沒鎖定暫停的話，提交答案後因為影片一樣在設定顯示時間，所以會再度暫停，所以需要將暫停鎖定
      //   //* 鎖定時間 = 影片當前時間 >= 下一個題目顯示的時間(鎖定到下一個題目前解除)
      //   //* 如果有下一個需顯示的題目才做解除鎖定時間的計算(解決沒下一題計算時跳出的錯誤)
      //   if (arr[index + 1]) {
      //     //* 到下一題的前0.5秒解除鎖定
      //     const lockTime = this.videoTime >= arr[index + 1].showTime - 0.5 && this.videoTime <= arr[index + 1].showTime
      //     //* 如果影片時間來到下一個題目顯示的時間 (0.5秒後解除鎖定)
      //     if (lockTime) {
      //       this.vidStopDisabled = false
      //     }
      //   } else if (this.videoTime >= arr[arr.length - 1].showTime + 0.5) {
      //   //* 如果當前影片時間到顯示最後一題的時間(沒有下一題)
      //   //* 一秒後自動解除鎖定(自動解除鎖定，若用戶跳回去過去題目顯示的時間，即可正常顯示題目)
      //     setTimeout(() => {
      //       this.vidStopDisabled = false
      //     }, 1000)
      //   }
      // })
    })
  }
}
</script>

<style lang='scss' scope>
.por {
  position: relative;
}
.marker:hover {
  background-color: blue !important;
}
</style>
