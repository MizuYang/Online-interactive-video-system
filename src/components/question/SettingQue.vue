<template>
<div class="row row-cols-5">
    <div class="border" v-for="(que,index) in questionsList" :key="que.id">
      <label :for="que.id">題目( {{ que.group }}{{ index+1 }} )</label> <br />
      <textarea :id="que.id" cols="25" rows="4"></textarea>

      <!-- 文字區塊 -->
      <div v-if="que.group==='文字區塊'">
        輸入答案 <br />
        <textarea id="" cols="25" rows="4"></textarea>
      </div>
      <!-- 單選題 -->
      <div v-if="que.group==='單選題'">
        選擇答案 <br />
        <input type="radio" class="me-2">
        <input type="text" class="mb-1"> <br />
        <input type="radio" class="me-2">
        <input type="text" class="mb-1"> <br />
        <input type="radio" class="me-2">
        <input type="text" class="mb-1"> <br />
        <input type="radio" class="me-2">
        <input type="text" class="mb-1"> <br />
      </div>

      <!-- 複選題 -->
      <div v-if="que.group==='複選題'">
        選擇答案 <br />
        <input type="checkbox" class="me-2">
        <input type="text" class="mb-1"> <br />
        <input type="checkbox" class="me-2">
        <input type="text" class="mb-1"> <br />
        <input type="checkbox" class="me-2">
        <input type="text" class="mb-1"> <br />
        <input type="checkbox" class="me-2">
        <input type="text" class="mb-1"> <br />
      </div>

      <!-- 克漏字 -->
      <div v-if="que.group==='克漏字'">
        輸入答案 <br />
        判斷有幾個問題空格，就迴圈渲染幾個文字欄位
        <input type="text" class="mb-1">
      </div>

      <!-- 重組題 -->
      <div v-if="que.group==='重組題'" class="d-flex justify-content-between">
        <div>
          <input type="text" class="mb-1" size="11"> <br />
          <input type="text" class="mb-1" size="11"> <br />
          <input type="text" class="mb-1" size="11"> <br />
          <input type="text" class="mb-1" size="11"> <br />
        </div>
        <div class="drop-area-style text-center w-50">拖曳到此處</div>
      </div>

      <!-- 問答題 -->
      <div v-if="que.group==='問答題'">
        輸入答案 <br />
        <textarea id="" cols="25" rows="4"></textarea>
      </div>

      <!-- 題組 -->
      <div v-if="que.group==='題組'">
        輸入答案 <br />
        <textarea id="" cols="25" rows="4"></textarea>
      </div>

    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {
  },

  data () {
    return {
      questionsList: []
    }
  },

  watch: {
    questionsList2 () {
      this.questionsList = this.questionsList2
    }
  },

  computed: {
    ...mapState(['questionsList2'])
  },

  methods: {
  },

  mounted () {
  }

}
</script>

<style lang='scss' scope>
.drop-area-style {
  border: 2px #000 dashed;
}
</style>
判斷點擊的是哪個題組
用push方式，這樣可以直接把欄位和data v-model綁定
也可以顯示這是第幾題(第data.length題)
輸入題目、答案後，按下確定後才會push題目進去，同時將欄位清空

針對不同題組去 v-if  v-else-if 顯示不一樣的題目呈現方式 (radio、checkbox之類的)
實際情況去看ican5出題系統的題目長怎樣
