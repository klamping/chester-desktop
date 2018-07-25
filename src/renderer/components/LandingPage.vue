<template>
  <div class="main-container">
    <ProjectMenu></ProjectMenu>
    <div class="main-content">
      <router-view></router-view>
    </div>
    <Feedback class="feedback"></Feedback>
    <Term></Term>
  </div>
</template>

<script>
  import ProjectMenu from './ProjectMenu'
  import Feedback from './Feedback'
  import Term from './Term';

  export default {
    name: 'landing-page',
    components: { ProjectMenu, Term, Feedback },
    data () {
      return {
        terminalExpanded: false
      }
    }
  }
</script>

<style>
  body {
    position: relative;
    height: 100vh;
  }
  .main-container {
    max-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .main-content {
    flex: 1;
    height: calc(100vh - 18em);
    overflow: auto;
  }
  .feedback {
    position: absolute;
    right: 10px;
    bottom: calc(18em);
    z-index: 2;
    color: #aaa;
  }
</style>