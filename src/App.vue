<template>
  <nav>
    <router-link to="/">練習標記</router-link> |
    <router-link to="/teacherQuestions">教師出題</router-link> |
    <router-link to="/examStart">考試開始</router-link> |
    <router-link to="/youtubeVideo">Youtube 影片</router-link>
  </nav>
  <router-view />
</template>

<style lang="scss">
@import "@/assets/stylesheets/all.scss";
</style>
