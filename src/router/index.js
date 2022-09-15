import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/MarkerWrap.vue')
  },
  {
    path: '/teacherQuestions',
    name: 'teacherQuestions',
    component: () => import('../views/TeacherQuestions.vue')
  },
  {
    path: '/examStart',
    name: 'examStart',
    component: () => import('../views/ExamStart.vue')
  },
  {
    path: '/youtubeVideo',
    name: 'youtubeVideo',
    component: () => import('../views/YoutubeWrap.vue')
  },
  {
    path: '/queGroup',
    name: 'queGroup',
    component: () => import('../views/QueGroup.vue')
  }
  // { //* 代表所有主頁面下的頁面，路由錯誤都會被導向
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/'
  // },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (to.fullPath.match('/')) {
      return {
        top: 0 //* 切換頁面時會切換到最上面的位置
      }
    }
    return {}
  }
})

export default router
