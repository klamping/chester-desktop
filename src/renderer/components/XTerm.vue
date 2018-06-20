<template>
  <div id="terminal"></div>
</template>

<script>
  import { Terminal } from 'xterm';

  export default {
    name: 'xterm',
    components: { },
    data () {
      return {
        log: '',
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

      this.$Message.config({
        top: 80,
        duration: 2
      });

      this.$electron.ipcRenderer.on('test-status', (e, status, type) => {
        this.$Message[type](status);
      });
    }
  }
</script>

<style>
  #info-log {
    width: 100%;
    max-height: 100%;
    overflow: scroll;
  }
</style>
