<template>
  <div class="row row-cols-5">
    <div v-for="(que,index) in questionsList" :key="que.id">
      <label :for="que.id">題目( {{ que.group }}{{ index+1 }} )</label> <br />
      <textarea :id="que.id" cols="25" rows="4"></textarea>
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

<style lang='scss' scope></style>
判斷點擊的是哪個題組
用push方式，這樣可以直接把欄位和data v-model綁定
也可以顯示這是第幾題(第data.length題)
輸入題目、答案後，按下確定後才會push題目進去，同時將欄位清空

針對不同題組去 v-if  v-else-if 顯示不一樣的題目呈現方式 (radio、checkbox之類的)
實際情況去看ican5出題系統的題目長怎樣
