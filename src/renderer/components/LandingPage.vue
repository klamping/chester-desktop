<template>
  <div class="main-container">
    <ProjectMenu></ProjectMenu>
    <router-view></router-view>
    <Feedback class="feedback"></Feedback>
  </div>
</template>

<script>
  import ProjectMenu from './ProjectMenu'
  import Feedback from './Feedback'

  export default {
    name: 'landing-page',
    components: { ProjectMenu, Feedback }
  }
</script>

<style>
  body {
    position: relative;
    height: 100vh;
  }
  .main-container {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .feedback {
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 20;
  }
</style>