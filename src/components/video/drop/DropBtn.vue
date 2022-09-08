<template>
  <a href="javascript:;" class="changeSizeBtn top" @mousedown.prevent.stop="dragChangeSize($event,index)"></a>
  <a href="javascript:;" class="changeSizeBtn left" @mousedown.prevent.stop="dragChangeSize($event,index)"></a>
  <a href="javascript:;" class="changeSizeBtn right" @mousedown.prevent.stop="dragChangeSize($event,index)"></a>
  <a href="javascript:;" class="changeSizeBtn bottom" @mousedown.prevent.stop="dragChangeSize($event,index)"></a>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  props: ['dropWrap', 'index'],

  components: {
  },

  data () {
    return {
      questionsList: []
    }
  },

  computed: {
    ...mapState(['questionsList2'])
  },

  watch: {
  },

  methods: {
    ...mapMutations(['SAVE_QUESTIONS_LIST']),
    //* 拖曳改變元素大小
    dragChangeSize (e, index) {
      const that = this
      const currentDropItem = this.$parent.$refs[`dropItem${index}`][0]

      //* 一開始先決定邊界範圍
      const area = {
        left: this.dropWrap.offsetLeft,
        right: this.dropWrap.offsetLeft + this.dropWrap.offsetWidth - currentDropItem.offsetWidth,
        top: this.dropWrap.offsetTop,
        bottom: this.dropWrap.offsetTop + this.dropWrap.offsetHeight - currentDropItem.offsetHeight
      }

      console.log(area)

      let dir = '' // 设置好方向
      const firstX = e.clientX // 获取第一次点击的横坐标
      const firstY = e.clientY // 获取第一次点击的纵坐标
      const width = currentDropItem.offsetWidth // 获取到元素的宽度
      const height = currentDropItem.offsetHeight // 获取到元素的高度
      // const Left = currentDropItem.offsetLeft // 获取到距离左边的距离
      // const Top = currentDropItem.offsetTop // 获取到距离上边的距离

      const Left = currentDropItem.offsetLeft // 获取到距离左边的距离
      const Top = currentDropItem.offsetTop // 获取到距离上边的距离

      // 下一步判断方向距离左边的距离+元素的宽度减去自己设定的宽度，只要点击的时候大于在这个区间，他就算右边
      if (firstX > Left + width - 10) {
        dir = 'right'
      } else if (firstX < Left + 10) {
        dir = 'left'
      }
      if (firstY > Top + height - 10) {
        dir = 'bottom'
      } else if (firstY < Top + 10) {
        dir = 'top'
      }
      // 判断方向结束
      document.onmousemove = function (e) {
        if (dir === 'left') {
          if (e.clientX < firstX) {
            //* 如果沒超過邊界才變更寬度
            if (e.clientX >= area[dir]) {
              //* 將寬度、座標傳回資料集
              that.questionsList[index].width = width - (e.clientX - firstX)
              that.questionsList[index].x = Left + (e.clientX - firstX)
              currentDropItem.style.width = width - (e.clientX - firstX)
              currentDropItem.style.left = Left + (e.clientX - firstX)
            }
          }
        } else if (dir === 'right') {
          //* 如果沒超過邊界才變更寬度
          if (area[dir] >= Left + (e.clientX - firstX)) {
            //* 將寬度、座標傳回資料集
            console.log(that.questionsList)
            console.log(that.questionsList2)
            that.questionsList[index].width = width + (e.clientX - firstX)
            currentDropItem.style.width = width + (e.clientX - firstX)
          }
        } else if (dir === 'top') {
          if (e.clientY < firstY) {
            //* 如果沒超過邊界才變更寬度
            if (e.clientY >= area[dir]) {
              //* 將寬度、座標傳回資料集
              that.questionsList[index].height = height - (e.clientY - firstY)
              that.questionsList[index].y = Top + (e.clientY - firstY)
              currentDropItem.style.height = height - (e.clientY - firstY)
              currentDropItem.style.top = Top + (e.clientY - firstY)
            }
          }
        } else if (dir === 'bottom') {
          //* 如果沒超過邊界才變更寬度
          if (area[dir] >= Top + (e.clientY - firstY)) {
            //* 將寬度、座標傳回資料集
            that.questionsList[index].height = height + (e.clientY - firstY)
            currentDropItem.style.height = height + (e.clientY - firstY)
          }
        }
        //* 把資料傳回 store
        that.$store.commit('SAVE_QUESTIONS_LIST', { questionsList: this.questionsList })
      }

      //* 清除事件
      document.onmouseup = function () {
        document.onmousemove = null
      }
    }
  },

  mounted () {
    this.questionsList = this.questionsList2
  }

}
</script>

<style lang='scss' scope></style>
