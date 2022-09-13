//* 題目出現時自動暫停
export function $questionShowVidStop () {
  this.questionsList.forEach((question, index, arr) => {
  //* 如果影片時間抵達題目顯示時間時
    if (this.videoTime >= question.showTime && this.videoTime <= question.showTime + 0.5) {
    //* 如果沒鎖定暫停影片時
      if (!this.vidStopDisabled) {
      //* 鎖定暫停
        this.vidStopDisabled = true
        //* 顯示題目、暫停播放
        this.player.pause()
      }
    }
    setTimeout(() => {
      this.$currentMarkStyle()
    }, 100)

    // ? 若沒鎖定暫停的話，提交答案後因為影片一樣在設定顯示時間，所以會再度暫停，所以需要將暫停鎖定
    //* 鎖定時間 = 影片當前時間 >= 下一個題目顯示的時間(鎖定到下一個題目前解除)
    //* 如果有下一個需顯示的題目才做解除鎖定時間的計算(解決沒下一題計算時跳出的錯誤)
    if (arr[index + 1]) {
    //* 到下一題的前0.5秒解除鎖定
      const lockTime = this.videoTime >= arr[index + 1].showTime - 0.5 && this.videoTime <= arr[index + 1].showTime
      //* 如果影片時間來到下一個題目顯示的時間 (0.5秒後解除鎖定)
      if (lockTime) {
        this.vidStopDisabled = false
        this.lastTime = this.videoTime
      }
    } else if (this.videoTime >= arr[arr.length - 1].showTime + 0.5) {
    //* 如果當前影片時間到顯示最後一題的時間(沒有下一題)
    //* 一秒後自動解除鎖定(自動解除鎖定，若用戶跳回去過去題目顯示的時間，即可正常顯示題目)
      setTimeout(() => {
        this.vidStopDisabled = false
      }, 1000)
    }
    //* 解決從第二題跳至第一題不會暫停問題
    if (!this.lastTime) {
      this.lastTime = this.videoTime
    }
    if (this.videoTime < this.lastTime) {
      this.vidStopDisabled = false
      this.lastTime = this.videoTime
    }
  })
}
