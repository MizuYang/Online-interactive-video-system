<template>
  <div class="w-75 por" @click="goVideoMarkerPosition">
    <!-- //* 影片播放器 -->
    <vue-plyr :options="options" ref="plyr">
      <video
        controls
        crossorigin
        playsinline
        data-poster="poster.jpg"
      >
        <source
          size="720"
          src="../assets/video/有聲影片測試.mp4"
          type="video/mp4"
        />
        <source
          size="1080"
          src="../assets/video/有聲影片測試.mp4"
          type="video/mp4"
        />
        <track
          default
          kind="captions"
          label="English captions"
          src="../assets/video/有聲影片測試.mp4"
          srclang="en"
        />
      </video>
    </vue-plyr>
    <!-- //* 題目視窗 -->
    <template v-for="(question, index) in questionsList" :key="`question${index}`">
      <!-- v-if="Math.floor(videoTime)===question.showTime" -->
      <div class="w30 poa bg-info text-center px-3 py-3" :ref="question.id" v-if="videoTime>=question.showTime&&videoTime<=question.showTime+0.5"
        :style="{top: question.top, left: question.left}">
        <h3>{{ question.title }}</h3>
        <p>{{ question.question }}</p>
        <input type="text" class="box2 mx-auto d-block my-2" placeholder="答案" v-model="studentAsnwer[index]"> <br>
        <button type="button" class="mx-auto d-block my-2" @click="checkAnswer(index, question.id)">核對答案</button>
      </div>
    </template>
  </div>

</template>

<script>
export default {
  data () {
    return {
      player: '',
      videoTime: 0,
      vidStopLock: false, //* 例:影片2秒顯示題目，此時會暫停影片，但答題後影片仍在兩秒，所以又會直接暫停，所以用此變數鎖定暫停的CD時間
      lockTime: 0,
      //* 迴圈渲染到影片中，並使用定位，依據老師當時拖曳的 XY軸座標做定位，並使用 v-if 判斷影片時間在某些區間才顯示該題目
      questionsList: [
        {
          id: 'AA',
          title: '數學考題',
          question: '1+1=?',
          answer: '2',
          showTime: 2,
          top: '30%',
          left: '15%'
        },
        {
          id: 'BB',
          title: '填空題',
          question: '星期二的前一天是星期?',
          answer: '一',
          showTime: 4,
          top: '30%',
          left: '25%'
        },
        {
          id: 'CC',
          title: '超簡單的題',
          question: '答案為"測試題"',
          answer: '測試題',
          showTime: 6,
          top: '30%',
          left: '40%'
        },
        {
          id: 'DD',
          title: '沒有梗了題',
          question: '答案為"測試題"',
          answer: '測試題',
          showTime: 77,
          top: '30%',
          left: '55%'
        },
        {
          id: 'EE',
          title: '點我看看題',
          question: '答案為"測試題"',
          answer: '測試題',
          showTime: 33,
          top: '30%',
          left: '15%'
        },
        {
          id: 'FF',
          title: '想不到名字的題',
          question: '答案為"測試題"',
          answer: '測試題',
          showTime: 18,
          top: '30%',
          left: '40%'
        },
        {
          id: 'GG',
          title: '送分題',
          question: '答案為"測試題"',
          answer: '測試題',
          showTime: 120,
          top: '30%',
          left: '20%'
        },
        {
          id: 'HH',
          title: '超難題',
          question: '答案為"測試題"',
          answer: '測試題',
          showTime: 99,
          top: '30%',
          left: '35%'
        },
        {
          id: 'II',
          title: '考古題',
          question: '答案為"測試題"',
          answer: '測試題',
          showTime: 160,
          top: '30%',
          left: '40%'
        }
      ],
      studentAsnwer: {}, //* 學生答案
      currentProgress: 0,
      options: {
        markers: {
          enabled: true,
          points: [
            {
              time: 10, // marker point time
              tip: 'first marker' // marker point hover display tip
            },
            {
              time: 20,
              tipHTML: '<strong>second</strong> marker' // or you can custom marker hover tip by innerHTML
            }
          ]
        }
      },
      markers: {
        enabled: true,
        points: [
          {
            time: 10, // marker point time
            tip: 'first marker' // marker point hover display tip
          },
          {
            time: 20,
            tipHTML: '<strong>second</strong> marker' // or you can custom marker hover tip by innerHTML
          }
        ]
      }
    }
  },

  methods: {
    //* 審查答案
    checkAnswer (index, id) {
      this.$refs[id][0].classList.add('d-none')
      this.player.play()
    },
    //* 取得時間軸標記
    getMarker () {
      const progessEl = this.player.elements.progress
      setTimeout(() => {
      // this.player.currentTime = 100
      // console.log(this.player.duration)
      // console.log(this.player.playing)
        progessEl.classList.add('por')
        //* 得到問題顯示時間在影片中的%數位置
        this.questionsList.forEach(item => {
        //* 題目位置 = 題目位置時間 / 影片總時間 *100
          const questionTime = Math.floor(item.showTime / this.player.duration * 100)
          //* 生成題目位置標記
          const span = document.createElement('button')
          span.classList.add('box')
          span.setAttribute('type', 'button')
          span.setAttribute('style', `left:${questionTime}%`)
          span.setAttribute('data-questionTime', item.showTime)
          span.setAttribute('title', item.title)
          progessEl.appendChild(span)
        })
      }, 500)
    },
    //* '當前時間軸標記變藍色，否則不變色
    currentMarkStyle () {
      //* 抵達時間軸上該標記時，標記變為藍色
      //* 取出所有標記的元素 (前三個會是套件的元件:時間軸外殼、時間軸條、時間tip)
      const markers = this.player.elements.progress.children
      markers.forEach(mark => {
        const markTime = parseInt(mark.getAttribute('data-questiontime'))
        //* 如果標記時間 === 當前影片播放的時間，標記變藍色
        if (markTime === Math.floor(this.videoTime)) {
          mark.style.backgroundColor = 'blue'
        } else {
          //* 如果影片播放時間不是標記時間，則變回紅色
          mark.style.backgroundColor = 'red'
          //* 將套件的元件：時間軸外殼、時間軸條、時間tip 移除紅色背景(若不移除也會變紅色)
          markers[0].style.removeProperty('background-color')
          markers[1].style.removeProperty('background-color')
          markers[2].style.removeProperty('background-color')
        }
      })
    },
    //* 跳轉到題目標記處
    goVideoMarkerPosition (e) {
      const isTimelineBtn = e.target.getAttribute('data-questionTime') !== null
      //* 如果是題目標記才執行
      if (isTimelineBtn) {
        const questionTime = e.target.getAttribute('data-questionTime')
        console.log(questionTime)
        this.player.currentTime = parseInt(questionTime)
      }
    }
  },

  mounted () {
    console.log(this.$refs.plyr.player)
    this.player = this.$refs.plyr.player
    //* 取得時間軸標記
    this.getMarker()

    //* 影片播放事件(影片播放時觸發)
    this.player.on('timeupdate', (event) => {
      // const instance = event.detail.plyr
      // console.log(instance)
      this.videoTime = this.player.currentTime

      //* 題目出現時自動暫停
      this.questionsList.forEach((question, index) => {
        //* 如果影片時間抵達題目顯示時間時
        // if (Math.floor(this.videoTime) === question.showTime) {
        if (this.videoTime >= question.showTime && this.videoTime <= question.showTime + 0.5) {
          //* 如果沒鎖定暫停影片時
          if (!this.vidStopLock) {
            //* 鎖定暫停
            this.vidStopLock = true
            //* 顯示題目、暫停播放
            setTimeout(() => {
              this.player.pause()
            }, 200)
          }
        }
        this.currentMarkStyle()
        // ? 若沒鎖定暫停的話，提交答案後因為影片一樣在設定顯示時間，所以會再度暫停，所以需要將暫停鎖定
        //* 鎖定時間 = 影片當前時間 >= 下一個題目顯示的時間(鎖定到下一個題目前解除)
        //* 如果有下一個需顯示的題目才做解除鎖定時間的計算(解決沒下一題計算時跳出的錯誤)
        if (this.questionsList[index + 1]) {
          this.lockTime = this.videoTime >= this.questionsList[index + 1].showTime && this.videoTime <= this.questionsList[index + 1].showTime + 0.5
          // this.lockTime = Math.floor(this.videoTime) === this.questionsList[index + 1].showTime
          //* 如果影片時間來到下一個題目顯示的時間 (0.5秒後解除鎖定)
          if (this.lockTime) {
            //! console.log('我該不會執行了吧!')
            this.vidStopLock = false
          }
        } else if (this.videoTime >= this.questionsList[this.questionsList.length - 1].showTime + 0.5) {
          //* 如果當前影片時間到顯示最後一題的時間
          //* 如果沒有下一題，則一秒後自動解除鎖定(自動解除鎖定，若用戶跳回去過去題目顯示的時間，即可正常顯示題目)
          //! console.log('最後一題~解除鎖定')
          this.vidStopLock = false
        }
      })
    })
  }
}
</script>

<style lang='scss' scope>
:root {
  --plyr-color-main: #1ac266;
}
.w30 {
  max-width: 30%;
}
.box2 {
  max-width: 50%;
}
.rwd {
  max-width: 100%;
  height: auto;
}
.por {
  position: relative;
}
.poa {
  position: absolute;
}
.ball {
  position: absolute;
  display: block;
  border: 3px solid #000;
  height: 15px;
  width: 1px;
  top: 0;
  z-index: 10;
}
.box {
  position: absolute;
  top: 0%;
  left: 0;
  z-index: 50;
  padding: 8px 2px;
  background-color: red;
}
.box:hover {
  background-color: blue;
}
</style>
