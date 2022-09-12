import { createApp } from 'vue'
import 'bootstrap'
import axios from 'axios'
import VueAxios from 'vue-axios'

import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'

import Vuex from 'vuex'
import store from './vuex/index'

//* 自定義方法
//* 標記相關方法
import {
  $getMarker,
  $goVideoMarkerPosition,
  $currentMarkStyle,
  $hoverMarkerTips
} from './methods/marker'

import App from './App.vue'
import router from './router'

const app = createApp(App)

//* 註冊自定義方法
app.config.globalProperties.$getMarker = $getMarker
app.config.globalProperties.$goVideoMarkerPosition = $goVideoMarkerPosition
app.config.globalProperties.$currentMarkStyle = $currentMarkStyle
app.config.globalProperties.$hoverMarkerTips = $hoverMarkerTips

app.use(Vuex)
app.use(store)
app.use(VuePlyr)
app.use(router)
app.use(VueAxios, axios)
app.mount('#app')
