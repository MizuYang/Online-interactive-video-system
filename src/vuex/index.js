import { createStore } from 'vuex'

export default createStore({
  strict: false, // 嚴謹模式
  state: {
    // 所有在 store 裏的資料
    questionsList: []
  },
  actions: {
    // 負責觸發 mutations
    // 可處理非同步程式（e.g: 打 API）
  },
  mutations: {
    // 負責改變 state 裏的資料
    CONGIRM_QUESTIONS (state, questionsList) {
      state.questionsList = questionsList
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
