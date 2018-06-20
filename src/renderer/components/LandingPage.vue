<template>
  <Layout class="main-container">
    <Layout>
      <Sider collapsible :collapsed-width="48" v-model="isCollapsed">
        <ProjectList></ProjectList>
        <AddProjectForm></AddProjectForm>
      </Sider>
      <Content>
        <router-view></router-view>
      </Content>
    </Layout>
    <Footer>
      <Term class="terminal"></Term>
    </Footer>
  </Layout>
</template>

<script>
  import ProjectList from './ProjectList'
  import AddProjectForm from './AddProjectForm'
  import Term from './Term';

  export default {
    name: 'landing-page',
    components: { ProjectList, AddProjectForm, Term },

    data () {
      return {
        isCollapsed: false
      };
    }
  }
</script>

<style>
  .main-container {
    height: 100vh;
  }
  .main-container .ivu-layout-sider {
    overflow: hidden;
    position: relative;
  }
  .main-container .ivu-layout-sider-trigger {
    position: absolute;
  }
  .main-container .ivu-layout-footer {
    padding: 0;
  }

  .terminal {
    border-top: 1px solid #aaa;
    background: #eee;
    width: 100%;
    height: 18em;
  }
</style>