<template>
  <button type="button" class="btn btn-sm btn-primary me-1" v-for="btn in queGroupList" :key="btn"
          @click="addQuestions(btn)">
      {{ btn }}
  </button>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['dropWrap', 'videoTime'],

  data () {
    return {
      questionsList: [],
      queGroupList: ['文字區塊', ' 單選題', ' 複選題', ' 克漏字', ' 重組題', ' 問答題', ' 題組']
    }
  },

  computed: {
    ...mapState(['plyr'])
  },

  methods: {
    //* 新增題組
    addQuestions (queGroup) {
      this.plyr.pause()
      this.questionsList.push({
        group: queGroup,
        id: this.randomString(),
        showTime: Math.floor(this.videoTime),
        //* 影片播放器的左上角座標 (新增題目時才會出現在限制區域中的左上角)
        x: this.dropWrap.offsetLeft,
        y: this.dropWrap.offsetTop,
        width: 248,
        height: 234
      })
      console.log(this.questionsList)
      //* 鎖定暫停
      this.vidStopDisabled = true

      // this.$getMarker() //* 生成標記

      //* 把資料傳回 store
      this.$store.commit('SAVE_QUESTIONS_LIST', { questionsList: this.questionsList })
    },
    //* 隨機生成 ID
    randomString () {
      const num = 10
      const t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; const a = t.length; let n = ''
      for (let i = 0; i < num; i++) n += t.charAt(Math.floor(Math.random() * a))
      return n
    }
  },

  mounted () {
  }

}
</script>

<style lang='scss' scope></style>
