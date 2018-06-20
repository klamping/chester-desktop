<template>
  <Layout :style="{minHeight: '100vh'}">
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <template v-if="project">
      <Header class="project-header">
        <h1>{{project.name}}</h1>
        <Button @click="updatePath()" type="text" class="project-path">{{project.path}}</Button>
        <Button v-on:click="deleteProject" type="error" class="delete">Delete Project</Button>
      </Header>
      <Content :style="{padding: '16px'}">

        <Form :label-width="100">
          <FormItem label="Config Files">
            <ConfigFiles/>
          </FormItem>
          <FormItem label="Spec Files">
            <SpecFiles/>
          </FormItem>
          <FormItem label="Capabilities">
            <Capabilities/>
          </FormItem>
          <FormItem label="Log Level">
            <ConfigOption config="logLevel" :options="logLevelOptions"/>
          </FormItem>
          <FormItem label="Base Url">
            <ConfigOption config="baseUrl"/>
          </FormItem>
          <FormItem>
            <Button v-on:click="runTest" type="success" v-bind:disabled="testRunning">Run Test</Button>
          </FormItem>
        </Form>

      </Content>
      <Term class="terminal"></Term>
    </template>
  </Layout>
</template>

<script>
  import fs from 'fs';
  import path from 'path';
  import ConfigFiles from './ConfigFiles';
  import SpecFiles from './SpecFiles';
  import ConfigOption from './ConfigOption';
  import Capabilities from './Capabilities';
  import Term from './Term';
  import iView from 'iview';
  import { mapState, mapGetters } from 'vuex';

  export default {
    name: 'project',
    components: { ConfigFiles, SpecFiles, ConfigOption, Term, Capabilities },

    data () {
      return {
        loading: false,
        error: null,
        testRunning: false,
        configFile: null,
        specs: [],
        logLevelOptions: ['silent', 'verbose', 'command', 'data', 'result', 'error']
      }
    },

    computed: {
      ...mapState({
        config: state => state.Project.config,
        overrides: state => state.Project.overrides,
        project: state => state.Project.project
      }),
      ...mapGetters([
        'fullConfigPath'
      ])
    },

    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      this.fetchData()
      this.$electron.ipcRenderer.on('test-status', (e, status) => {
        if (status === 'Successful' || status === 'Failed') {
          this.testRunning = false;
        }
      });
    },

    watch: {
      // call again the method if the route changes
      '$route': 'fetchData'
    },
    methods: {
      fetchData () {
        iView.LoadingBar.start();
        this.error = null

        this.$store.dispatch('setProject', this.$route.params.id)
          .then((project) => {
            iView.LoadingBar.finish();
            if (!project) {
              this.$router.push({ path: '/' });
            }
          })
          .catch((err) => {
            this.error = err;
            iView.LoadingBar.error();
          });
      },
      generateConfigFile () {
        if (this.overrides) {
          // write to temp file
          const contents = `exports.config = { ...require('${this.fullConfigPath}').config, ...${JSON.stringify(this.overrides)} }`;

          // return path
          const tempDir = this.$electron.remote.app.getPath('temp');
          const filePath = path.join(tempDir, 'wdio.conf.js');
          fs.writeFileSync(filePath, contents, 'utf8');

          return filePath;
        } else {
          return this.config;
        }
      },
      runTest () {
        // this.testRunning = true;
        const tempConfigPath = this.generateConfigFile();
        const command = `./node_modules/.bin/wdio ${tempConfigPath}`;
        this.$electron.ipcRenderer.send('run-test', this.project.path, command);
      },
      deleteProject () {
        this.$store
          .dispatch('remove', this.project._id)
          .then(() => {
            this.$router.push({ path: '/' });
          });
      },
      updatePath () {
        const path = this.$electron.remote.dialog.showOpenDialog({
          properties: ['openDirectory']
        });

        if (path) {
          this.$store.dispatch('updateProject', { path: path[0] });
        }
      }
    }
  }
</script>

<style>
  .project-header {
    background: #fff;
    box-shadow: 0 2px 3px 2px rgba(0,0,0,.1);
    display: flex;
    align-items: baseline;
  }
  .delete {
    position: absolute;
    right: 1em;
    top: 1.2em;
  }
  .terminal {
    border-top: 1px solid #eee;
    background: #eee;
    width: 100%;
  }
</style>
