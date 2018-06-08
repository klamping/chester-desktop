<template>
  <div id="wrapper">
    <AddProjectForm></AddProjectForm>
    <ProjectList></ProjectList>
    <div id="runner">
      <div id="info-status">Test Status: <span>{{status}}</span></div>
      <div id="info-log" v-html="log"></div>
    </div>
  </div>
</template>

<script>
  import ProjectList from './ProjectList'
  import AddProjectForm from './AddProjectForm'
  import { default as AnsiUp } from 'ansi_up';

  export default {
    name: 'landing-page',
    components: { ProjectList, AddProjectForm },
    data () {
      return {
        status: '',
        log: ''
      }
    },
    created () {
      this.$electron.ipcRenderer.on('test-status', (e, status) => {
        this.status = status;
      });

      // eslint-disable-next-line new-parens, new-cap
      const au = new AnsiUp();

      this.$electron.ipcRenderer.on('test-log', (e, log) => {
        const html = au.ansi_to_html(log);
        this.log += `${html}<br />`;
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
