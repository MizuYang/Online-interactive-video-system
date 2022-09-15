<template>
  <header>
    <h2>學生考試模擬(教師使用 Youtube 影片)</h2>
    <p v-if="questionsList2.length>0">教師選擇影片
      <span ref="autoplayTips2" class="fw-bold border-bottom"></span>
    </p>
  </header>
  <div class="por w-75" ref="dropWrap2" @click="$goVideoMarkerPosition">

    <!-- Youtube 影片播放器 -->
    <div class="plyr__video-embed" id="player" ref="yt" v-show="questionsList2.length>0">
      <iframe src="https://www.youtube.com/watch?v=B-BQnCwTBeQ?rel=0&amp;showinfo=0?ecver=2"
              allowfullscreen allowtransparency allow="autoplay">
      </iframe>
    </div>

    <!-- 題目視窗 -->
    <QuestionsList :dropWrap="dropWrap2" :videoTime="videoTime"></QuestionsList>

    <h3 class="text-danger my-5" v-show="questionsList2.length===0">
      目前沒有題目唷，請先到"<router-link to="/teacherQuestions">教師出題</router-link>"出題目~
    </h3>
  </div>
</template>

<script>
import Plyr from '../../../../node_modules/plyr'
import { mapState } from 'vuex'

import QuestionsList from '../drop/QuestionsList.vue'
export default {
  components: {
    QuestionsList
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

  mounted () {
    //* 如果沒題目就中斷
    if (this.questionsList2.length === 0) return

    //* 取得播放器外圍
    this.dropWrap2 = this.$refs.dropWrap2
    this.player = new Plyr('#player', {
      // noCookie: false,
      rel: 0, //* 只會顯示該頻道的影片，不會顯示其他頻道的影片
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
//* 提高權重，用戶才可以手動關閉到播放器暫停時 youtube 顯示的推薦影片視窗
.plyr iframe {
    z-index: 2;
}
</style>
