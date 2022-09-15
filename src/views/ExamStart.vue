<template>
  <div class="container my-5">
    <header>
      <h2>學生考試模擬(教師自行上傳影片)</h2>
      <p v-if="questionsList2.length>0">教師選擇影片
        <span ref="autoplayTips" class="fw-bold border-bottom"></span>
      </p>
    </header>

    <!-- 考試區 -->
    <div class="por minSize w-75" @click="$goVideoMarkerPosition" ref="dropWrap" v-show="questionsList2.length>0">
      <!--  影片播放器 -->
      <VideoPlyr></VideoPlyr>

      <!--  題目視窗 -->
      <QuestionsList :dropWrap="dropWrap2" :videoTime="videoTime"></QuestionsList>

    </div>

    <h3 class="text-danger my-5" v-show="questionsList2.length===0">
      目前沒有題目唷，請先到"<router-link to="/teacherQuestions">教師出題</router-link>"出題目~
    </h3>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VideoPlyr from '../components/video/plyr/PlyrVideo.vue'
import QuestionsList from '../components/video/drop/QuestionsList.vue'
export default {
  components: {
    VideoPlyr,
    QuestionsList
  },

  data () {
    return {
      player: '',
      videoTime: '',
      dropWrap2: '',
      questionsList: []
    }
  },

  computed: {
    ...mapState(['options', 'plyr', 'questionsList2'])
  },

  mounted () {
    //* 如果沒題目就中斷
    if (this.questionsList2.length === 0) return

    this.player = this.plyr
    this.questionsList = this.questionsList2

    //* 取得播放器外圍
    this.dropWrap2 = this.$refs.dropWrap

    //* 自動播放提示
    const isAutoplay = this.options.autoplay
    this.$refs.autoplayTips.textContent = isAutoplay ? '自動播放' : '手動播放'

    //* 將播放器時間改為"增量計數器"而不是倒數計時
    this.player.config.invertTime = false

    //* 取得時間戳記
    setTimeout(() => {
      this.$getMarker()
      this.$hoverMarkerTips()
    }, 100)

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
.minSize {
  min-width: 20%;
  min-height: 25%;
}
.por {
  position: relative;
}
.poa {
  position: absolute;
}
.marker:hover {
  background-color: blue !important;
}
</style>
