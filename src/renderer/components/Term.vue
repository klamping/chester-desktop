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
  import * as fit from 'xterm/lib/addons/fit/fit';
  import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen';
  import 'xterm/dist/xterm.css'

  export default {
    name: 'term',
    components: { },
    data () {
      return {
        terminalExpanded: false
      }
    },
    mounted () {
      Terminal.applyAddon(fit);
      Terminal.applyAddon(fullscreen);
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

      this.term.writeln('Welcome! Test output will appear here')

      // this.$electron.ipcRenderer.on('run-test', function (event, folderPath, command) {
      //   console.log('Term.vue :32');
      //   this.term.writeln(command)
      //   this.term.scrollToBottom();
      // });

      this.$electron.ipcRenderer.on('test-log', (e, log) => {
        log = log.replace(/\r?\n/g, '\r');
        this.term.writeln(log)
        this.term.scrollToBottom();
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
        this.term.clear();
      },
      toggleFullscreen () {
        this.terminalExpanded = !this.terminalExpanded;
        this.term.toggleFullScreen(this.terminalExpanded);
        setTimeout(() => {
          this.term.fit();
        }, 300)
      }
    }
  }
</script>

<style>
  .terminal-container {
    position: absolute;
    flex: 1;
    height: 18em;
    width: 100vw;
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
  .terminal-toggle {
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
  .expanded .terminal-toggle {
    bottom: 97%;
    border: 0;
    border-radius: 3px;
    background: rgba(100, 100, 100, .5);
  }
  .clear-logs {
    position: absolute;
    top: 1em;
    right: 5px;
    z-index: 20;
    opacity: .5;
    background: #555;
    color: #fff;
    transition: all 0.25s ease-in-out;
  }
  .clear-logs:hover,
  .clear-logs:focus {
    opacity: 1;
    background: #000;
  }
</style>
