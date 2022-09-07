import { createApp } from 'vue'
import 'bootstrap'
import axios from 'axios'
import VueAxios from 'vue-axios'

import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

import $thousandths from '@/utils/thousandths.js' //* 千分位

import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'

import Vuex from 'vuex'
import store from './vuex/index' //* 放實際 index.js 檔案位置

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.globalProperties.$thousandths = $thousandths //* 千分位

app.component('IsLoading', VueLoading)

app.use(Vuex)
app.use(store)
app.use(VuePlyr)
app.use(router)
app.use(VueAxios, axios)
app.mount('#app')
