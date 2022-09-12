<template>
  <vue-plyr ref="plyr">
    <video
      :autoplay="options.autoplay===true"
      controls
      crossorigin
      playsinline
      data-poster="poster.jpg"
    >
      <source
        size="720"
        src="../../../assets/video/有聲影片測試.mp4"
        type="video/mp4"
      />
      <source
        size="1080"
        src="../../../assets/video/有聲影片測試.mp4"
        type="video/mp4"
      />
      <track
        default
        kind="captions"
        label="English captions"
        src="../../../assets/video/有聲影片測試.mp4"
        srclang="en"
      />
    </video>
  </vue-plyr>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {

  computed: {
    ...mapState(['options'])
  },

  methods: {
    ...mapMutations(['PLAYER'])
  },

  mounted () {
    this.$store.commit('PLAYER_INIT', { player: this.$refs.plyr.player })
  }

}
</script>
