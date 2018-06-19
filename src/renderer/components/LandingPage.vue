<template>
  <Layout :style="{minHeight: '100vh'}">
    <Sider collapsible :collapsed-width="48" v-model="isCollapsed">
      <ProjectList></ProjectList>
      <AddProjectForm></AddProjectForm>
    </Sider>
    <Layout>
      <router-view></router-view>
    </Layout>
  </Layout>
</template>

<script>
  import ProjectList from './ProjectList'
  import AddProjectForm from './AddProjectForm'

  export default {
    name: 'landing-page',
    components: { ProjectList, AddProjectForm },

    data () {
      return {
        isCollapsed: false
      };
    }
  }
</script>

<style>
  .ivu-layout-sider {
    overflow: hidden;
  }
</style>