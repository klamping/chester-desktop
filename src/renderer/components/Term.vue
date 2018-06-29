<template>
  <div class="log-container">
    <div id="info-log" v-html="log"></div>
    <Button class="clear-logs" @click="clearLogs">Clear Logs</Button>
  </div>
</template>

<script>
  import { default as AnsiUp } from 'ansi_up';

  export default {
    name: 'term',
    components: { },
    data () {
      return {
        log: ''
      }
    },
    created () {
      // eslint-disable-next-line new-parens, new-cap
      const au = new AnsiUp();

      this.$electron.ipcRenderer.on('test-log', (e, log) => {
        let html = au.ansi_to_html(log).replace(/\n/, '<br/>');
        if (!html.endsWith('<br/>')) {
          html = `${html}<br/>`;
        }
        this.log += html;
        // cheap hack to scroll to bottom of container
        const container = document.querySelector('.log-container');
        container.scrollTop = container.scrollHeight + 200;
      });

      this.$Notice.config({
        top: 80,
        duration: 2
      });

      this.$electron.ipcRenderer.on('test-status', (e, status, type) => {
        this.$Notice[type]({
          title: status
        });
      });
    },
    methods: {
      clearLogs () {
        this.log = '';
      }
    }
  }
</script>

<style>
  .log-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: scroll;
  }
  .clear-logs {
    position: absolute;
    top: 5px;
    right: 5px;
  }
</style>
