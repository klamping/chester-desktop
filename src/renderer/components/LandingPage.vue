<template>
  <div id="wrapper">
    <AddProjectForm></AddProjectForm>
    <ProjectList></ProjectList>
    <div id="runner">
      <div id="info-status">Test Status: <span></span></div>
      <div id="info-log"></div>
    </div>
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

<style>
  #info-status {
    position: absolute;
    top: 5px;
    right: 5px;
  }
</style>
