import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/login',
      component: (resolve) => {
        require(['@/views/index.vue'], resolve)
      },
      children: [{
        path: '/activegroup',
        name: 'activegroup',
        component: (resolve) => {
          require(['@/views/modules/activegroup'], resolve)
        }
      }, {
        path: '/activelist',
        name: 'activelist',
        component: (resolve) => {
          require(['@/views/modules/activelist'], resolve)
        }
      }, {
        path: '/giftlist',
        name: 'giftlist',
        component: (resolve) => {
          require(['@/views/modules/giftlist'], resolve)
        }
      }, {
        path: '/query',
        name: 'query',
        component: (resolve) => {
          require(['@/views/modules/query'], resolve)
        }
      }, {
        path: '/tools',
        name: 'tools',
        component: (resolve) => {
          require(['@/views/modules/tools'], resolve)
        }
      },
      {
        path: '/addactivity',
        name: 'addactivity',
        component: (resolve) => {
          require(['@/views/modules/addactivity'], resolve)
        }
      }, {
        path: '/groupset/:groupId',
        name: 'groupset',
        component: (resolve) => {
          require(['@/views/modules/addactivity/groupset'], resolve)
        },
        props: true
      }, {
        path: '/docs',
        name: 'docs',
        component: (resolve) => {
          require(['@/views/modules/docs/index'], resolve)
        },
        props: true
      }]
    }, {
      path: '/login',
      name: 'login',
      component: (resolve) => {
        require(['@/views/login.vue'], resolve)
      }
    }, 
    // {
    //   path: '*',
    //   redirect: '/login'
    // }
  ]
})
