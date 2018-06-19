import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: require('@/components/LandingPage').default,
      children: [
        {
          path: '',
          component: require('@/components/NoProject').default
        },
        {
          path: 'project/:id',
          name: 'project',
          component: require('@/components/Project').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
