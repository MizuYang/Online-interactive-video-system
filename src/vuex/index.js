import { createStore } from 'vuex'

export default createStore({
  strict: false, // 嚴謹模式
  state: {
    // 所有在 store 裏的資料
    questionsList2: [],
    options: { autoplay: false },
    plyr: ''
  },
  actions: {
    // 負責觸發 mutations
    // 可處理非同步程式（e.g: 打 API）
  },
  mutations: {
    //* 儲存題目到 store
    SAVE_QUESTIONS_LIST (state, params) {
      state.questionsList2 = params.questionsList
    },
    //* 儲存選項
    SAVE_OPTIONS (state, params) {
      state.options = params.options
    },
    //* 取得 plyr 實體
    PLAYER_INIT (state, params) {
      state.plyr = params.player
    }
  },
  getters: {
    // 像 computed 一樣，運算處理 state 資料
  },
  modules: {
    // 按需求分拆 module
    // 每個 module 都有自己的state, actions, mutations, getters, modules
  }
})
