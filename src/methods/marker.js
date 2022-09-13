import Tooltip from 'bootstrap/js/src/tooltip'

//* 取得時間軸標記
export function $getMarker () {
  const progessEl = this.player.elements.progress

  let hasmMarkerWarp = null
  this.player.elements.progress.children.forEach(item => {
    //* 如果有 markerWarp 就不再重複生成 markerWarp 了
    if (item.getAttribute('id') === 'markerWarp') {
      hasmMarkerWarp = true
    }
  })
  //! 如果沒有 markerWarp 才生成 markerWarp
  if (!hasmMarkerWarp) {
    //* 生成一個 span(markerWarp) 掛在 progess 底下，用來掛載所有標記按鈕
    const span = document.createElement('span')
    span.setAttribute('id', 'markerWarp')
    progessEl.appendChild(span)
    hasmMarkerWarp = true
  }
  let str = ''
  //* 得到問題顯示時間在影片中的%數位置
  this.questionsList.forEach(item => {
    //* 題目位置 = 題目位置時間 / 影片總時間 *100
    const questionTime = Math.floor(parseInt(item.showTime) / parseInt(this.player.duration) * 100)
    //* 生成標記
    str += `
      <button type="button" class="marker" id="markerWarp" style="left:${questionTime}%" data-questionTime="${item.showTime}"
        data-bs-toggle="tooltip" data-bs-placement="bottom"></button>
      `
  })
  //* 使用 innerHTML 的方式覆蓋，才不會有重複生成的元素
  const markerWarp = document.getElementById('markerWarp')
  if (markerWarp) {
    markerWarp.innerHTML = str
  }
}

//* 跳轉到題目標記處
export function $goVideoMarkerPosition (e) {
  const isTimelineBtn = e.target.getAttribute('data-questionTime') !== null
  //* 如果是題目標記才執行
  if (isTimelineBtn) {
    const questionTime = e.target.getAttribute('data-questionTime')
    this.player.currentTime = parseInt(questionTime) + 0.5
    //* 解決 Youtube 頁面跳轉標籤後，時間軸滾動圈不會移動到標籤問題
    if (this.$route.path === 'youtubeVideo') {
      setTimeout(() => {
        this.player.play()
        setTimeout(() => {
          this.player.pause()
        }, 300)
      }, 150)
    }
  }
}

//* '當前時間軸標記變藍色，否則不變色
export function $currentMarkStyle () {
  //* 抵達時間軸上該標記時，標記變為藍色
  //* 取出所有標記的元素 (前三個會是套件的元件:時間軸外殼、時間軸條、時間tip)
  const markers = this.player.elements.progress.children[3].children
  markers.forEach(mark => {
    const markTime = parseInt(mark.getAttribute('data-questiontime'))
    //* 如果標記時間 === 當前影片播放的時間，標記變藍色
    if (markTime === Math.floor(this.videoTime)) {
      mark.style.backgroundColor = 'blue'
    } else {
      //* 如果影片播放時間不是標記時間，則變回紅色
      mark.style.backgroundColor = 'red'
    }
  })
}

//* 標記 hover 文字提示
export function $hoverMarkerTips () {
  const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
  const arr = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new Tooltip(tooltipTriggerEl)
  })
  if (arr.length > 0) {
    this.questionsList.forEach((item, index) => {
      //* 如果有標題
      if (item.title) {
        //* 加上第幾題+題目標題
        arr[index]._config.title = `第${index + 1}題, ${item.title}`
      }
    })
  }
}
