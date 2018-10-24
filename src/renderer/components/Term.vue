<template>
  <div
    class="terminal-container"
    v-bind:class="{ expanded: terminalExpanded }">
    <div id="terminal"></div>
    <Button
      type="ghost"
      class="terminal-toggle"
      v-bind:icon="terminalExpanded ? 'chevron-down' : 'chevron-up'"
      @click="toggleFullscreen"
    ></Button>
    <Button type="ghost" class="clear-logs" @click="clearLogs">Clear Logs</Button>
  </div>
</template>

<script>
  import { Terminal } from 'xterm';
  // import  { EOL } from 'os';
  import * as fit from 'xterm/lib/addons/fit/fit';
  import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
  import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';
  import 'xterm/dist/xterm.css'

  export default {
    name: 'term',
    components: { },
    data () {
      return {
        terminalExpanded: false
      }
    },
    watch: {
      // call again the method if the route changes
      '$route': 'reload'
    },
    mounted () {
      Terminal.applyAddon(fit);
      Terminal.applyAddon(fullscreen);
      Terminal.applyAddon(winptyCompat);
      this.term = new Terminal({
        theme: {
          foreground: '#d0d0d0',
          background: '#223',
          cursor: '#d0d0d0',
          selection: 'rgba(255, 255, 255, 0.3)',
          black: '#000000',
          red: '#e06c75',
          brightRed: '#e06c75',
          green: '#A4EFA1',
          brightGreen: '#A4EFA1',
          brightYellow: '#EDDC96',
          yellow: '#EDDC96',
          magenta: '#e39ef7',
          brightMagenta: '#e39ef7',
          cyan: '#5fcbd8',
          brightBlue: '#5fcbd8',
          brightCyan: '#5fcbd8',
          blue: '#5fcbd8',
          white: '#d0d0d0',
          brightBlack: '#808080',
          brightWhite: '#ffffff'
        }
      });
      this.term.open(document.getElementById('terminal'));
      this.term.fit();
      this.term.writeln('Terminal loaded. Test output will appear here')

      this.term.on('data', (data) => {
        this.$electron.ipcRenderer.send('xterm', data);
      });

      this.$electron.ipcRenderer.on('test-log', (e, log) => {
        this.term.write(log)
      });

      this.$Notice.config({
        top: 80,
        duration: 2
      });

      this.$electron.ipcRenderer.on('test-status', (e, status, type) => {
        this.term.writeln(`---- ${status} ----`)
        this.$Notice[type]({
          title: status
        });
      });
    },
    methods: {
      clearLogs () {
        this.term.clear();
      },
      toggleFullscreen () {
        this.terminalExpanded = !this.terminalExpanded;
        this.term.toggleFullScreen(this.terminalExpanded);
        setTimeout(() => {
          this.term.fit();
        }, 300)
      },
      reload () {
        // this.term.write('Test output will appear here')
        // this.term.clear();
      }
    }
  }
</script>

<style>
  .terminal-container {
    position: absolute;
    flex: 1;
    box-sizing: border-box;
    height: 20em;
    width: 100vw;
    padding: 0 5px;
    bottom: 0;
    border-top: 1px solid #aaa;
    transition: height 0.25s ease-in-out;
    background: #223;
    z-index: 5;
  }
  .terminal-container.expanded {
    height: 100%;
  }
  #terminal {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .terminal-toggle.ivu-btn {
    position: absolute;
    left: 50%;
    bottom: calc(100% + 1px);
    padding: 3px 15px;
    border-bottom: 0;
    border-radius: 3px 3px 0 0;
    z-index: 20;
    color: #ccc;
    transition: bottom 0.25s ease-in-out;
  }
  .expanded .terminal-toggle.ivu-btn {
    bottom: 97%;
    border: 0;
    border-radius: 3px;
    background: rgba(100, 100, 100, .5);
  }
  .clear-logs.ivu-btn {
    position: absolute;
    top: 1em;
    right: 10px;
    z-index: 20;
    opacity: .5;
    background: #555;
    color: #fff;
    transition: all 0.25s ease-in-out;
  }
  .terminal-container.expanded .clear-logs.ivu-btn {
    top: 55px;
  }
  .clear-logs.ivu-btn:hover,
  .clear-logs.ivu-btn:focus {
    opacity: 1;
    background: #000;
  }
</style>
