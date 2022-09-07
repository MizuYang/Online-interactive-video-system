<template>
  <div class="container my-5">
    <header>
      <h2>學生考試模擬(教師需先出題目)</h2>
      <p>教師選擇影片
        <span ref="autoplayTips" class="fw-bold border-bottom"></span>
      </p>
    </header>

    <!-- 考試區 -->

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {
  },

  data () {
    return {
    }
  },

  computed: {
    ...mapState(['options'])
  },

  watch: {
  },

  methods: {
  },

  mounted () {
    //* 自動播放提示
    const isAutoplay = this.options.autoplay
    this.$refs.autoplayTips.textContent = isAutoplay ? '自動播放' : '手動播放'
  }

}
</script>

<style lang='scss' scope></style>
