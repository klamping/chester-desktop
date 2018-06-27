<template>
  <Layout class="main-container">
    <ProjectMenu></ProjectMenu>
    <Content>
      <router-view></router-view>
    </Content>
    <Footer>
      <Term class="terminal"></Term>
    </Footer>
  </Layout>
</template>

<script>
  import ProjectMenu from './ProjectMenu'
  import Term from './Term';

  export default {
    name: 'landing-page',
    components: { ProjectMenu, Term },
  }
</script>

<style>
  .main-container {
    height: 100vh;
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