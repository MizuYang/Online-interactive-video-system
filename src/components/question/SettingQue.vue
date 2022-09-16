<template>
<div class="row row-cols-5">
    <div class="border" v-for="(que,index) in questionsList" :key="que.id">
      <label :for="que.id">題目( {{ que.group }}{{ index+1 }} )</label> <br />
      <textarea :id="que.id" cols="25" rows="4" v-model="questionsList[index].heading"></textarea>

      <!-- 文字區塊 -->
      <div v-if="que.group==='文字區塊'">
        輸入答案 <br />
        <textarea id="" cols="25" rows="4" v-model="questionsList[index].answer"></textarea>
        答案：{{ this.questionsList[index].answer }}
      </div>
      <!-- 單選題 -->
      <div v-if="que.group==='單選題'">
        選擇答案 <br />
        <input :name="`radio${que.id}`" type="radio" class="me-2" v-model="questionsList[index].answer" :value="questionsList[index].op1">
        <input type="text" class="mb-1" v-model="questionsList[index].op1"> <br />
        <input :name="`radio${que.id}`" type="radio" class="me-2" v-model="questionsList[index].answer" :value="questionsList[index].op2">
        <input type="text" class="mb-1" v-model="questionsList[index].op2"> <br />
        <input :name="`radio${que.id}`" type="radio" class="me-2" v-model="questionsList[index].answer" :value="questionsList[index].op3">
        <input type="text" class="mb-1" v-model="questionsList[index].op3"> <br />
        <input :name="`radio${que.id}`" type="radio" class="me-2" v-model="questionsList[index].answer" :value="questionsList[index].op4">
        <input type="text" class="mb-1" v-model="questionsList[index].op4"> <br />
        答案：{{ this.questionsList[index].answer }}
      </div>

      <!-- 複選題 -->
      <div v-if="que.group==='複選題'">
        選擇答案 <br />
        <input type="checkbox" class="me-2" :value="questionsList[index].op1" @change="getChebxAnswer($event,index,questionsList[index].op1)">
        <input type="text" class="mb-1" v-model="questionsList[index].op1"> <br />

        <input type="checkbox" class="me-2" :value="questionsList[index].op2" @change="getChebxAnswer($event,index,questionsList[index].op2)">
        <input type="text" class="mb-1" v-model="questionsList[index].op2"> <br />

        <input type="checkbox" class="me-2" :value="questionsList[index].op3" @change="getChebxAnswer($event,index,questionsList[index].op3)">
        <input type="text" class="mb-1" v-model="questionsList[index].op3"> <br />

        <input type="checkbox" class="me-2" :value="questionsList[index].op4" @change="getChebxAnswer($event,index,questionsList[index].op4)">
        <input type="text" class="mb-1" v-model="questionsList[index].op4"> <br />
        答案：{{ this.questionsList[index].answer }}
      </div>

      <!-- 克漏字 -->
      <div v-if="que.group==='克漏字'">
        輸入答案 <br />
        判斷有幾個問題空格，就迴圈渲染幾個文字欄位
        <input type="text" class="mb-1" v-model="questionsList[index].answer">
        答案：{{ this.questionsList[index].answer }}
      </div>

      <!-- 重組題 -->
      <div>
        <div v-if="que.group==='重組題'" class="d-flex justify-content-between">
          <div>
            <input type="text" class="mb-1" v-model="questionsList[index].op1" size="11" @input="getQueList(index)"> <br />
            <input type="text" class="mb-1" v-model="questionsList[index].op2" size="11" @input="getQueList(index)"> <br />
            <input type="text" class="mb-1" v-model="questionsList[index].op3" size="11" @input="getQueList(index)"> <br />
            <input type="text" class="mb-1" v-model="questionsList[index].op4" size="11" @input="getQueList(index)"> <br />
          </div>

          <transition-group class="list drop-area-style text-center w-50 p-1" tag="ul" name="drag">
            <li  v-for="(ans,dropItemIndex) in questionsList[index].dropArr" :key="`ans${dropItemIndex}`"
                class="bg-dark text-light my-1" draggable="true"
                @dragstart="getDragItemIndex(index,dropItemIndex)"
                @dragenter.prevent="changePosition(index,dropItemIndex)">
                {{ ans }}
            </li>
          </transition-group>
          <br>
        </div>
          答案：{{ this.questionsList[index].answer }}
      </div>

      <!-- 問答題 -->
      <div v-if="que.group==='問答題'">
        輸入答案 <br />
        <textarea id="" cols="25" rows="4" v-model="questionsList[index].answer"></textarea>
        答案：{{ this.questionsList[index].answer }}
      </div>

      <!-- 題組 -->
      <div v-if="que.group==='題組'">
        輸入答案 <br />
        <textarea id="" cols="25" rows="4" v-model="questionsList[index].answer"></textarea>
        答案：{{ this.questionsList[index].answer }}
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
      questionsList: [],
      currentDragIndex: 0
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
    //* 取得 checkbox 的答案
    getChebxAnswer (e, index, val) {
      //* 若沒有 answer 這個陣列就先初始化再推勾選項目進去
      if (!this.questionsList[index].answer) {
        this.questionsList[index].answer = []
        this.questionsList[index].answer.push(val)
      } else {
        //* 若已有 answer 先判斷是否已有勾選項目，若有代表是取消勾選，需要移除val
        if (this.questionsList[index].answer.includes(val)) {
          //* 找出該勾選項目索引，並刪除
          const deleteIndex = this.questionsList[index].answer.findIndex(checkboxItem => {
            return checkboxItem === val
          })
          this.questionsList[index].answer.splice(deleteIndex, 1)
        } else {
          //* 若 answer 中沒有該勾選項目，則推送進去
          this.questionsList[index].answer.push(val)
        }
      }
      //! 方法一
      //! 先判斷questionsList[index].answer(陣列)裡有沒有這個值
      //! 如果有，就代表這次點擊是移除，就必須取得索引位置來刪除
      //! 如果沒有，就把值push進去questionsList[index].answer

      // ? 方法二
      // ? 在 checkbox標籤中加入 :checked="questionsList[index].answer.include(value)"
      // ? change 事件
      // ? 寫一個判斷如果 e.target有checked這個屬性的話，那就是取消勾選，如果沒有的話就push進去questionsList[index].answer
    },
    //* 取得 重組題答案
    getQueList (index) {
      this.questionsList[index].dropArr = []
      for (let i = 0; i <= 4; i++) {
        if (this.questionsList[index][`op${i}`]) {
          this.questionsList[index].dropArr.push(this.questionsList[index][`op${i}`])
        }
      }
    },
    //* 開始拖動: 取得拖動對象的索引
    getDragItemIndex (index, dropItemIndex) {
      this.questionsList[index].currentDragIndex = dropItemIndex
    },
    //* 移動到目標位置: 交換位置
    changePosition (index, dropItemIndex) {
      const dropArr = this.questionsList[index].dropArr
      const currentIndex = this.questionsList[index].currentDragIndex
      //* 將當前目標先存起來
      const tempCurrentEl = dropArr[currentIndex]

      //* 將拖動目標刪除，直接插隊到目標位置
      dropArr.splice(currentIndex, 1)
      dropArr.splice(dropItemIndex, 0, tempCurrentEl)

      //* 因拖動元素移到目標位置了，所以要將自己原先索引改為目標索引
      this.questionsList[index].currentDragIndex = dropItemIndex

      //* 將答案傳回題目資料集
      this.questionsList[index].answer = dropArr
    }
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
