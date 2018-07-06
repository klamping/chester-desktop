<template>
  <div class="main-container">
    <ProjectMenu></ProjectMenu>
    <div class="main-content">
      <router-view></router-view>
    </div>
    <div class="footer">
      <div
        class="terminal"
        v-bind:class="{ expanded: terminalExpanded }">
        <Button v-bind:icon="terminalExpanded ? 'chevron-down' : 'chevron-up'" @click="terminalExpanded = !terminalExpanded" type="text" class="terminal-toggle"></Button>
        <Term></Term>
      </div>
    </div>

    <Feedback class="feedback"></Feedback>
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
  .main-container {
    max-height: 100vh;
    overflow: hidden;
  }
  .main-content {
    height: calc(100vh - 18em);
    overflow: auto;
  }
  .footer {
    padding: 0;
    height: 18em;
  }
  .feedback {
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 10;
    color: #aaa;
  }

  .terminal {
    position: absolute;
    z-index: 5;
    bottom: 0;
    border-top: 1px solid #aaa;
    background: #eee;
    width: 100%;
    height: 18em;
    transition: height 0.25s ease-in-out;
  }
  .terminal.expanded {
    height: 100%;
  }
  .terminal-toggle {
    position: absolute;
    left: 50%;
    z-index: 2;
    color: #ccc;
  }
</style>