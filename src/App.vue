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

questionList: [
  {
  title: '',
  content: '',
  answer: '',
  zIndex: 0,
  x: 0,
  y: 0,
  showTime: 0
  }
]

//* 被拖曳的物件可以用一個陣列去寫 v
//* 用跑迴圈的方式渲染到畫面上 v
//* 按下新增題目時，push一個{}到陣列中，並增加新增題目時的時間、老師寫的題目標題、答案、拖曳的位置..等 v

//* 拖曳視窗會超過影片播放器 v
//* 滑鼠按下：拖曳時可變半透明，鼠標變成拖曳狀 v
//* 滑鼠放開：結束拖曳時解除半透明，鼠標復原 v
//* 可新增多個拖曳視窗 v
//* 可使用 z-index 讓老師決定拖曳視窗的覆蓋先後 v
//* 座標轉換：x,y軸 轉換成 position 或是想辦法在渲染時，使用x,y軸來呈現題目視窗的位置 v

//* 改用 v-if 來做題目顯示(設定顯示題目時間與當前影片時間相同時) v
//* 題目顯示時 影片暫停 v
//* 若按核對答案 題目視窗會隱藏 且影片會繼續播放(播放不會再自動暫停) v
//* 題目在時間軸上的標記 v
//* 新增題目時可拖曳題目區塊，來決定顯示的位置 v
//* 可設定是否自動播放

//* 如果影片時間到題目出現時間，顯示題目、影片暫停，否則題目隱藏 v
//* 如果輸入答案且按核對答案，題目隱藏、影片播放 v

//* 標記的元素會重複生成到，有地方需做初始化 v
//* 標記的 hover tips 動態生成 v
//* 刪除題目後，標記會從時間軸上被刪除 v

// 學生考試頁面：
//* 標記未出現 v
//* 寬高沒有傳過去 v
//* plry 加上 .por 拖曳區塊限制的位置就會跑掉，看是不是 area 限制的左上角座標錯誤了；或是想辦法不用 por 且讓他一開始就定位在影片區塊內(試試看HTML中將影片左上角座標的參數傳到CSS，然後drop直接定位top,left這個座標；或是想辦法在新增題目時，就先將計算好的影片左上角座標賦予到questions.x和questions.y) v
//* "考試開始"：y軸的座標似乎有跑掉 v
//* 沒有拖曳 x,y軸、寬高的話，就已當前狀態傳遞 v
//* 標記的 hover tips 動態生成 v
//* 老師出題也可以從 store 取得先前題目做呈現 v

//* 如果是 examStart 頁面，就移除拖動事件 v
//* 老師 store 取得以往題目，外層限制異常 v
//* 元件模組化複用： v
  // 影片套件、拖曳按鈕、拖曳區塊
//* 將可複用性的函式用 ESM 模組化後複用
  - $getMarker
  - $goVideoMarkerPosition
  - $currentMarkStyle
  - $hoverMarkerTips
  - 鎖定暫停
//* 測試建立三個題目，從最後題目跳轉到第一題是否能自動暫停 v
//* 優化影片暫停、題目顯示邏輯 v
//* 整理多餘程式碼 v

---Youtube播放器測試---
//* 使用 Youtube 影片看看(直接用模組化的方式) v
//! Youtube 時間軸的當前時間移動標記無法隨著點擊標記而跟著移動至相對應時間位置 (看 YT 的 API 有沒有相關設定)(如果是YT頁面，先play再馬上pause，滾動圈就可以過去了))

//! 增加題組
//! 跳轉時不一定會移動到題目出現的畫面(data-question時間用更精準時間，不要去除小數點) marker.js 48行
//* 只有到最後一個標記才可以清除第一個的暫停鎖定(三個題目，跳到第二個，在到第一個時並不會暫停的錯誤) v

//* 老師出題的的 x,y 軸要把他在考試頁面減掉，當作是初始化，因為老師的起始座標與考試頁面不一樣 v

//* Youtube 暫停會出現 "更多影片" v
    只用 youtube iframe 不依賴套件需做到 //* 已解決
  - 影片播放監聽(影片播放時要取得當前影片時間)
  - 能夠透過 youtube 提供的 API 暫停、開始影片、影片時間跳轉、可以抓到時間軸的元件(要掛載標記)
