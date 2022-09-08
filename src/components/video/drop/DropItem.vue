<template>

  <template v-for="(question, index) in questionsList2" :key="`questionItem${index}`">
      <div class="bg-info text-center px-3 py-3" :class="{drop: isAboutPage, 'drop-style':isAboutPage, poa: $route.path==='/examStart'}" @mousedown="dragStart($event,`dropItem${index}`)" :data-question-id="question.id"
          :ref="`dropItem${index}`" :style="{left:`${question.x}px`, top:`${isAboutPage? question.y:question.y-12}px`,width:`${question.width}px`, height: `${question.height}px`}" v-show="videoTime>=question.showTime&&videoTime<=question.showTime+0.5">
          <!-- v-if="Math.floor(videoTime)===Math.floor(question.showTime)" -->
        <div class="d-flex justify-content-between">
          <h3 class="text-center">第{{ index+1 }}題</h3>
          <div v-if="isAboutPage">
              <button type="button" class="btn btn-danger btn-sm ms-3 d-inline-block" @click="deleteQuestion(question.id)">X</button>
          </div>
        </div>
        <div class="text-start mb-0">
          標題
          <template v-if="isAboutPage">
            <button type="button" @click="loseIndex(index)" :disabled="!questionsList2[index].zIndex||questionsList2[index].zIndex<=0">－</button>
            <button type="button" @click="addIndex(index)">＋</button>
            權重：<span :ref="`zIndexNum${index}`">0</span>
          </template>
        </div>
        <input type="text" :class="{'drop-style': isAboutPage}" v-model.lazy="questionsList2[index].title">

        <p class="text-start mb-0">內容</p>
        <input type="text" :class="{'drop-style': isAboutPage}" v-model.lazy="questionsList2[index].content">

        <p class="text-start mb-0">答案</p>
        <input type="text" :class="{'drop-style': isAboutPage}" v-model.lazy="questionsList2[index].answer">

        <!-- 拖曳按鈕 -->
        <div v-if="isAboutPage">
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
    //* 判斷是否為 about 頁面
    isAboutPage () {
      return this.$route.path === '/about'
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
      //* 如果不是 about 頁面就中斷(學生拖曳無效)
      if (!this.isAboutPage) return

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

      // console.log(area)

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
      this.getMarker()

      //* 把資料傳回 store
      this.$store.commit('SAVE_QUESTIONS_LIST', { questionsList: this.questionsList })
    },
    //* 取得時間軸標記
    getMarker () {
      const progessEl = this.plyr

      let hasmMarkerWarp = null
      this.plyr.elements.progress.children.forEach(item => {
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
          const questionTime = Math.floor(parseInt(item.showTime) / parseInt(this.plyr.duration) * 100)
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
    //* 權重提高
    addIndex (index) {
      this.$refs[`dropItem${index}`][0].style.zIndex++
      this.$refs[`zIndexNum${index}`][0].textContent = this.$refs[`dropItem${index}`][0].style.zIndex
      this.questionsList[index].zIndex = this.$refs[`dropItem${index}`][0].style.zIndex
      console.log(this.questionsList)
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
    }
  },

  mounted () {
  }

}
</script>

<style lang='scss' scope>
.poa {
  position: absolute;
}
// <template v-for="(question, index) in questionsList" :key="`questionItem${index}`">
//   <div class="drop drop-style bg-info text-center px-3 py-3" @mousedown="dragStart($event,`dropItem${index}`)" :data-question-id="question.id"
//       :ref="`dropItem${index}`" :style="{left:`${question.x}px`, top:`${question.y}px`,width:`${question.width}px`, height: `${question.height}px`}" v-show="videoTime>=question.showTime&&videoTime<=question.showTime+0.5">
//       <!-- v-if="Math.floor(videoTime)===Math.floor(question.showTime)" -->
//     <div class="d-flex justify-content-between">
//       <div class="text-start">
//         <button type="button" class="btn btn-secondary btn-sm p-1" @click="sizeSmaller(index)">小</button>
//         <button type="button" class="btn btn-secondary btn-sm mx-1 p-1" @click="sizeBigger(index)">大</button>
//       </div>
//       <h3 class="text-center">第{{ index+1 }}題</h3>
//       <div>
//           <button type="button" class="btn btn-danger btn-sm ms-3 d-inline-block" @click="deleteQuestion(question.id)">X</button>
//       </div>
//     </div>
//     <div class="text-start mb-0">
//       標題
//       <button type="button" @click="loseIndex(index)" :disabled="!questionsList[index].zIndex||questionsList[index].zIndex<=0">－</button>
//       <button type="button" @click="addIndex(index)">＋</button>
//       權重：<span :ref="`zIndexNum${index}`">0</span>
//     </div>
//     <input type="text" class="drop-style" v-model.lazy="questionsList[index].title">

//     <p class="text-start mb-0">內容</p>
//     <input type="text" class="drop-style" v-model.lazy="questionsList[index].content">

//     <p class="text-start mb-0">答案</p>
//     <input type="text" class="drop-style" v-model.lazy="questionsList[index].answer">

//     <!-- 拖曳按鈕 -->
//     <DropBtn :dropWrap="dropWrap" :index="index"></DropBtn>
//     <!-- <a href="javascript:;" class="changeSizeBtn top" @mousedown.prevent.stop="dragChangeSize($event,index)"></a>
//     <a href="javascript:;" class="changeSizeBtn left" @mousedown.prevent.stop="dragChangeSize($event,index)"></a>
//     <a href="javascript:;" class="changeSizeBtn right" @mousedown.prevent.stop="dragChangeSize($event,index)"></a>
//     <a href="javascript:;" class="changeSizeBtn bottom" @mousedown.prevent.stop="dragChangeSize($event,index)"></a> -->
//   </div>
// </template>
</style>
