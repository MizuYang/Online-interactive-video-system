<template>
  <HelloWorld></HelloWorld>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '../components/MarkerItem.vue'
//! import emitter from '@/utils/emitter.js'
export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },

  data () {
    return {

    }
  },

  mounted () {

    // 將題目加入到影片中
    // 在時間軸加入標記
    // 標記點選可跳轉至影片該時間位置

  }
}
</script>
