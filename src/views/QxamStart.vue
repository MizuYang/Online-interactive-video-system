<template>
  <div class="container my-5">
    <header>
      <h2>學生考試模擬(教師需先出題目)</h2>
      <p v-if="questionsList2.length>0">教師選擇影片
        <span ref="autoplayTips" class="fw-bold border-bottom"></span>
      </p>
    </header>

    <!-- 考試區 -->
    <div class="minSize w-75" @click="goVideoMarkerPosition" ref="dropWrap" v-if="questionsList2.length>0">
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
      <template v-for="(question, index) in questionsList2" :key="`questionItem${index}`">
        <div class="poa bg-info text-center px-3 py-3" :data-question-id="question.id"
            :ref="`dropItem${index}`" :style="{left:`${question.x||430}px`, top:`${question.y||257}px`,width:`${question.width}`, height: `${question.height}`}" v-show="videoTime>=question.showTime&&videoTime<=question.showTime+0.5">
            <!-- v-if="Math.floor(videoTime)===Math.floor(question.showTime)" -->
          <div class="d-flex">
            <h3 class="me-auto">第{{ index+1 }}題</h3>
            <div>
                <button type="button" class="btn btn-danger btn-sm ms-3 d-inline-block" @click="deleteQuestion(question.id)">X</button>
            </div>
          </div>
          <div class="text-start mb-0">
            標題
          </div>
          <input type="text" v-model.lazy="questionsList2[index].title">

          <p class="text-start mb-0">內容</p>
          <input type="text" v-model.lazy="questionsList2[index].content">

          <p class="text-start mb-0">答案</p>
          <input type="text" v-model.lazy="questionsList2[index].answer">

          <div class="mt-3">
            <button type="button">
              核對答案
            </button>
          </div>
        </div>
      </template>
    </div>

    <h3 class="text-danger my-5" v-else>
      目前沒有題目唷，請先到"<router-link to="/about">練習拖曳</router-link>"中出題目~
    </h3>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {
  },

  data () {
    return {
      player: '',
      videoTime: ''
    }
  },

  computed: {
    ...mapState(['options', 'questionsList2'])
  },

  watch: {
  },

  methods: {
  },

  mounted () {
    //* 如果沒題目就中斷
    if (this.questionsList2.length === 0) return

    //* 自動播放提示
    const isAutoplay = this.options.autoplay
    this.$refs.autoplayTips.textContent = isAutoplay ? '自動播放' : '手動播放'

    this.player = this.$refs.plyr.player

    //* 將播放器時間改為"增量計數器"而不是倒數計時
    this.player.config.invertTime = false

    this.player.on('timeupdate', (event) => {
    //* 取得當前影片播放時間
      this.videoTime = this.player.currentTime

      //* 題目出現時自動暫停
      this.questionsList2.forEach((question, index) => {
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
        // this.currentMarkStyle()
        // ? 若沒鎖定暫停的話，提交答案後因為影片一樣在設定顯示時間，所以會再度暫停，所以需要將暫停鎖定
        //* 鎖定時間 = 影片當前時間 >= 下一個題目顯示的時間(鎖定到下一個題目前解除)
        //* 如果有下一個需顯示的題目才做解除鎖定時間的計算(解決沒下一題計算時跳出的錯誤)
        if (this.questionsList2[index + 1]) {
          const lockTime = this.videoTime >= this.questionsList2[index + 1].showTime && this.videoTime <= this.questionsList2[index + 1].showTime + 0.5
          //* 如果影片時間來到下一個題目顯示的時間 (0.5秒後解除鎖定)
          if (lockTime) {
            this.vidStopDisabled = false
          }
        } else if (this.videoTime >= this.questionsList2[this.questionsList2.length - 1].showTime + 0.5) {
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
.minSize {
  min-width: 20%;
  min-height: 25%;
}
.poa {
  position: absolute;
}
</style>
