<template>
  <div id="terminal"></div>
</template>

<script>
  // import { Terminal } from 'xterm';

  export default {
    name: 'xterm',
    components: { },
    data () {
      return {
        log: '',
      }
    },
    created () {
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
