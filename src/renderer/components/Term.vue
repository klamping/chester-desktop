<template>
  <div>
    <div id="info-status">Test Status: <span>{{status}}</span></div>
    <div id="info-log" v-html="log"></div>
  </div>
</template>

<script>
  import { default as AnsiUp } from 'ansi_up';

  export default {
    name: 'landing-page',
    components: { },
    data () {
      return {
        log: '',
        status: ''
      }
    },
    created () {
      // eslint-disable-next-line new-parens, new-cap
      const au = new AnsiUp();

      this.$electron.ipcRenderer.on('test-log', (e, log) => {
        const html = au.ansi_to_html(log);
        this.log += `${html}<br />`;
        // cheap hack to scroll to bottom of container
        const container = document.getElementById('info-log');
        container.scrollTop = container.scrollHeight + 200;
      });

      this.$electron.ipcRenderer.on('test-status', (e, status) => {
        this.status = status;
      });
    }
  }
</script>

<style>
  #info-status {
    position: absolute;
    bottom: 20em;
    right: 1em;
  }
  #info-log {
    width: 100%;
    overflow: scroll;
    height: 20em;
  }
</style>
