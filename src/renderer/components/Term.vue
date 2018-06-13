<template>
  <div id="info-log" v-html="log"></div>
</template>

<script>
  import { default as AnsiUp } from 'ansi_up';

  export default {
    name: 'landing-page',
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
        const html = au.ansi_to_html(log);
        this.log += `${html}<br />`;
      });
    }
  }
</script>

<style>
  #info-log {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 20em;
    overflow: scroll;
    border-top: 1px solid #eee;
  }
</style>
