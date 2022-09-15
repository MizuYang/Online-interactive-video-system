<template>
  <div class="container my-5">
    <!--  教師新增題目 -->
    <div class="my-4">
      <h2>教師出題(題組)</h2>
      <button type="button" @click="addQuestions">新增題目</button>
      <input type="checkbox" class="ms-3" id="autoplay" v-model="options.autoplay" @change="setAutoplay">
      <label for="autoplay">自動播放</label>
      <div class="my-3">
        <!-- 題組按鈕 -->
        <QueGroupBtnList :dropWrap="dropWrap" :videoTime="videoTime"></QueGroupBtnList>
        <div class="my-3">
          <!-- 題目設定 -->
          <SettingQue></SettingQue>
        </div>
      </div>
    </div>

    <div class="w-75" @click="$goVideoMarkerPosition" ref="dropWrap3">
      <!--  影片播放器 -->
      <VideoPlyr></VideoPlyr>

      <!--  題目視窗 -->
      <QueGroupList :dropWrap="dropWrap" :videoTime="videoTime"></QueGroupList>
    </div>

    <!-- 確認出題按鈕 -->
    <div class="my-3">
      <button type="button" @click="confirmQuestions" v-if="questionsList.length>0">確認出題</button>
    </div>
  </div>

</template>

<script>
import { mapState, mapMutations } from 'vuex'
import VideoPlyr from '../components/video/plyr/PlyrVideo.vue'
import QueGroupList from '../components/video/drop/QueGroupList.vue'
import QueGroupBtnList from '../components/question/QueGroupBtnList.vue'
import SettingQue from '../components/question/SettingQue.vue'
export default {
  components: {
    VideoPlyr,
    QueGroupList,
    QueGroupBtnList,
    SettingQue
  },

  data () {
    return {
      videoTime: 0,
      lastTime: 0,
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
        this.$hoverMarkerTips()
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
        showTime: Math.floor(this.videoTime),
        //* 影片播放器的左上角座標 (新增題目時才會出現在限制區域中的左上角)
        x: this.dropWrap.offsetLeft,
        y: this.dropWrap.offsetTop,
        width: 248,
        height: 234
      })
      //* 鎖定暫停
      this.vidStopDisabled = true

      this.$getMarker() //* 生成標記

      //* 把資料傳回 store
      this.$store.commit('SAVE_QUESTIONS_LIST', { questionsList: this.questionsList })
    },
    //* 隨機生成 ID
    randomString () {
      const num = 10
      const t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; const a = t.length; let n = ''
      for (let i = 0; i < num; i++) n += t.charAt(Math.floor(Math.random() * a))
      return n
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
    this.dropWrap = this.$refs.dropWrap3

    if (this.questionsList2.length > 0) {
      this.questionsList = this.questionsList2
      this.$getMarker()
    }
    //* 將播放器時間改為"增量計數器"而不是倒數計時
    this.player.config.invertTime = false

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
