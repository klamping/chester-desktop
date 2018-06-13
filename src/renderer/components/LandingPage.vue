<template>
  <div class="layout">
    <Layout :style="{minHeight: '100vh'}">
      <Sider collapsible :collapsed-width="78">
        <ProjectList></ProjectList>
        <AddProjectForm></AddProjectForm>
      </Sider>
      <Layout>
        <router-view></router-view>
        <div id="info-status">Test Status: <span>{{status}}</span></div>
        <Term></Term>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import ProjectList from './ProjectList'
  import SystemInformation from './LandingPage/SystemInformation'
  import AddProjectForm from './AddProjectForm'
  import Term from './Term'

  export default {
    name: 'landing-page',
    components: { ProjectList, AddProjectForm, SystemInformation, Term },
    data () {
      return {
        status: ''
      }
    },
    created () {
      this.$electron.ipcRenderer.on('test-status', (e, status) => {
        this.status = status;
      });
    }
  }
</script>

<style>
  #info-status {
    position: absolute;
    top: 5px;
    right: 5px;
  }
</style>
