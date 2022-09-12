<template>
  <div class="por w-75" ref="dropWrap">
    <!-- Youtube 影片播放器 -->
    <div class="plyr__video-embed" id="player">
      <iframe src="https://www.youtube.com/watch?v=LFaKMm0Gulw"
              allowfullscreen allowtransparency allow="autoplay">
      </iframe>
    </div>
    <!-- 題目 -->
    <DropItem :dropWrap="dropWrap" :videoTime="videoTime"></DropItem>
  </div>
</template>

<script>
import Plyr from '../../../../node_modules/plyr'
import { mapState } from 'vuex'

import DropItem from '../drop/DropItem.vue'
export default {
  components: {
    DropItem
  },

  data () {
    return {
      player: '',
      videoTime: 0,
      dropWrap: ''
    }
  },

  computed: {
    ...mapState(['questionsList2'])
  },

  methods: {
  },

  mounted () {
    //* 取得播放器外圍
    this.dropWrap = this.$refs.dropWrap
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

    console.log(this.player)
    console.log(this.questionsList2)

    this.player.on('timeupdate', (event) => {
      //* 取得當前影片播放時間
      this.videoTime = this.player.currentTime
    })
  }
}
</script>

<style lang='scss' scope>
.por {
  position: relative;
}
</style>
