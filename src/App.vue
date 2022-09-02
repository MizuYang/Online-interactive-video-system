<template>
  <nav>
    <router-link to="/">練習標記</router-link> |
    <router-link to="/about">練習拖曳</router-link>
  </nav>
  <router-view />
</template>

<style lang="scss">
@import "@/assets/stylesheets/all.scss";
</style>

//* 被拖曳的物件可以用一個陣列去寫
//* 用跑迴圈的方式渲染到畫面上
//* 按下新增題目時，push一個{}到陣列中，並增加新增題目時的時間、老師題寫的題目標題、答案、拖曳的位置..等

//! 難點：
//* 拖曳時取得的是 x, y 軸座標，但position 是用%的單位
//* 不同裝置時，影片播放器大小會不同，到時座標位置可能會跑掉

//! 拖曳視窗會超過影片播放器 v
//! 滑鼠按下：拖曳時可變半透明，鼠標變成拖曳狀
//! 滑鼠放開：結束拖曳時解除半透明，鼠標復原
//! 可新增多個拖曳視窗
//! 座標轉換：x,y軸 轉換成 position 或是想辦法在渲染時，使用x,y軸來呈現題目視窗的位置
