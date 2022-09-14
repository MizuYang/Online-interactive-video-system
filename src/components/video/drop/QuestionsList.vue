<template>
  <template v-for="(question, index) in questionsList2" :key="`questionItem${index}`">
      <div class="bg-info text-center px-3 py-3" :class="{drop: isTeacherQuePage, 'drop-style':isTeacherQuePage, poa: $route.path==='/examStart'||$route.path==='/youtubeVideo'}" @mousedown="dragStart($event,`dropItem${index}`)" :data-question-id="question.id"
          :ref="`dropItem${index}`" :style="{left:`${noTeacherQuePageLoseX(question.x)}px`, top:`${noTeacherQuePageLoseY(question.y)}px`,width:`${question.width}px`, height: `${question.height}px`}" v-show="Math.floor(videoTime)>=question.showTime&&Math.floor(videoTime)<=question.showTime+1">
        <div class="d-flex justify-content-between">
          <h3 class="text-center">第{{ index+1 }}題</h3>
          <div v-if="isTeacherQuePage">
              <button type="button" class="btn btn-danger btn-sm ms-3 d-inline-block" @click="deleteQuestion(question.id)">X</button>
          </div>
        </div>
        <div class="text-start mb-0">
          標題
          <template v-if="isTeacherQuePage">
            <button type="button" @click="loseIndex(index)" :disabled="!questionsList2[index].zIndex||questionsList2[index].zIndex<=0">－</button>
            <button type="button" @click="addIndex(index)">＋</button>
            權重：<span :ref="`zIndexNum${index}`">0</span>
          </template>
        </div>
        <input type="text" :class="{'drop-style': isTeacherQuePage}" v-model.lazy="questionsList2[index].title">

        <p class="text-start mb-0">內容</p>
        <input type="text" :class="{'drop-style': isTeacherQuePage}" v-model.lazy="questionsList2[index].content">

        <p class="text-start mb-0">答案</p>
        <input type="text" :class="{'drop-style': isTeacherQuePage}" v-model.lazy="questionsList2[index].answer">

        <div v-if="isTeacherQuePage">

          <!-- 拖曳按鈕 -->
          <DropBtn :dropWrap="dropWrap" :index="index"></DropBtn>

        </div>
      </div>
    </template>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import DropBtn from './DropBtn.vue'
export default {
  props: ['dropWrap', 'videoTime'],

  components: {
    DropBtn
  },

  data () {
    return {
      questionsList: [],
      currentPage: ''
    }
  },

  computed: {
    ...mapState(['questionsList2', 'plyr']),
    //* 判斷是否為 teacherQuestions 頁面
    isTeacherQuePage () {
      return this.$route.path === '/teacherQuestions'
    }
  },

  watch: {
    questionsList2 () {
      this.questionsList = this.questionsList2
    }
  },

  methods: {
    ...mapMutations(['SAVE_QUESTIONS_LIST']),
    //* 滑鼠按下:拖動開始
    dragStart (e, dropItemRefName) {
      //* 如果點擊的是控制大小的 a 標籤，則中斷程式碼
      if (e.target.nodeName === 'A') return
      if (e.target.nodeName === 'BUTTON') return
      //* 如果不是 teacherQuestions 頁面就中斷(學生拖曳無效)
      if (!this.isTeacherQuePage) return

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
      this.questionsList[itemIndex].x = this.x
      this.questionsList[itemIndex].y = this.y

      //* 把資料傳回 store
      this.$store.commit('SAVE_QUESTIONS_LIST', { questionsList: this.questionsList })
    },
    //* 滑鼠放開:拖動結束
    stop () {
      document.removeEventListener('mousemove', this.move)
      document.removeEventListener('mouseup', this.stop)
    },
    //* 刪除題目
    deleteQuestion (id) {
      //* 取得要刪除的項目位置
      const deleteIndex = this.questionsList.findIndex(item => {
        return item.id === id
      })
      this.questionsList.splice(deleteIndex, 1)
      this.$getMarker()

      //* 把資料傳回 store
      this.$store.commit('SAVE_QUESTIONS_LIST', { questionsList: this.questionsList })
    },
    //* 權重提高
    addIndex (index) {
      this.$refs[`dropItem${index}`][0].style.zIndex++
      this.$refs[`zIndexNum${index}`][0].textContent = this.$refs[`dropItem${index}`][0].style.zIndex
      this.questionsList[index].zIndex = this.$refs[`dropItem${index}`][0].style.zIndex
      //* 把資料傳回 store
      this.$store.commit('SAVE_QUESTIONS_LIST', { questionsList: this.questionsList })
    },
    //* 權重降低
    loseIndex (index) {
      this.$refs[`dropItem${index}`][0].style.zIndex--
      this.$refs[`zIndexNum${index}`][0].textContent = this.$refs[`dropItem${index}`][0].style.zIndex
      this.questionsList[index].zIndex = this.$refs[`dropItem${index}`][0].style.zIndex

      //* 把資料傳回 store
      this.$store.commit('SAVE_QUESTIONS_LIST', { questionsList: this.questionsList })
    },
    //* 如果不是 teacherQuestions 頁面，需扣除播放器左上角座標(因teacherQuestions的起始座標x,y與學生頁面不同)
    noTeacherQuePageLoseX (x) {
      if (this.isTeacherQuePage) {
        return x
      } else {
        const newX = x - this.dropWrap.offsetLeft
        return newX
      }
    },
    noTeacherQuePageLoseY (y) {
      if (this.isTeacherQuePage) {
        return y
      } else {
        const newY = y - this.dropWrap.offsetTop - 12
        return newY
      }
    }
  },

  mounted () {
    this.questionsList = this.questionsList2
  }

}
</script>

<style lang='scss' scope>
.poa {
  position: absolute;
}
</style>
