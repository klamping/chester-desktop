<template>
  <div class="layout">
    <Layout :style="{minHeight: '100vh'}">
      <Sider collapsible :collapsed-width="78">
        <ProjectList></ProjectList>
        <AddProjectForm></AddProjectForm>
      </Sider>
      <Layout>
        <router-view></router-view>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import ProjectList from './ProjectList'
  import AddProjectForm from './AddProjectForm'

  export default {
    name: 'landing-page',
    components: { ProjectList, AddProjectForm }
  }
</script>
