import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default,
      children: [
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
