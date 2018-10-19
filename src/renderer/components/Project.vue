<template>
  <div class="project">
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <template v-if="project">
      <Layout class="project-container">
        <Header class="project-header">
          <div class="project-info">
            <h1>
              {{project.name}}
            </h1>
            <EditProject />
          </div>

          <div class="run-buttons" v-if="configsLoaded">
            <Tooltip placement="bottom" content="(Ctrl+r)">
              <Button v-on:click="runTest" type="success" v-bind:disabled="testRunning">Run Tests</Button>
            </Tooltip>
            <Button v-on:click="stopTest" type="success" v-bind:disabled="!testRunning">Stop Tests</Button>
          </div>
        </Header>
        <Content class="project-content">
          <div class="aux-content">
            <Tabs type="card">
                <TabPane label="File Browser">
                  <FileView></FileView>
                </TabPane>
                <!-- <TabPane label="Test Cases">
                  <p>These are the test cases</p>
                </TabPane> -->
            </Tabs>
          </div>
          <Form :label-width="100" class="config-settings">
            <ConfigFiles/>

            <template v-if="configsLoaded">
              <FormItem label="Test Command">
                <Input type="text" v-model="customCommand" />
              </FormItem>
              <FormItem label="Env. Variables">
                <EnvVars/>
              </FormItem>
              <FormItem label="Spec Files">
                <SpecFiles/>
              </FormItem>
              <FormItem label="Capabilities">
                <Capabilities/>
              </FormItem>
              <FormItem label="Base Url">
                <ConfigOption config="baseUrl"/>
              </FormItem>
              <FormItem label="Log Level">
                <ConfigOption config="logLevel" :options="logLevelOptions" type="radio" />
              </FormItem>
              <FormItem label="Bail">
                <ConfigOption config="bail" />
                <p>Stop the test runner after specific amount of tests have failed (default: 0 - don't bail)</p>
              </FormItem>
            </template>
          </Form>
        </Content>
      </Layout>
      <Term></Term>
    </template>
  </div>
</template>

<style>
  .project {
    display: flex;
    height: 100vh;
    position: relative;
  }
  .project-container {
    display: flex;
    height: calc(100% - 20em);
  }
  .project-header.ivu-layout-header {
    background: #fff;
    box-shadow: 0 2px 3px 2px rgba(0,0,0,.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem 0 5em;
    z-index: 2;
    position: relative;
  }
  .project-header .project-info {
    display: flex;
    align-items: center;
  }
  .project-header .project-info .ivu-btn {
    margin-left: 1rem;
  }
  .project-content {
    display: flex;
    overflow: hidden;
  }
  .aux-content {
    width: 25em;
    flex: 1 0 25em;
    background: #fff;
    display: block;
    overflow: auto;
    max-height: 100%;
    padding-top: 10px;
    box-sizing: border-box;
    border-right: 1px solid #ddd;
  }
  .aux-content .ivu-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .aux-content .ivu-tabs-bar {
    margin-bottom: 0;
  }
  .aux-content .ivu-tabs-nav {
    padding-left: 5px;
  }
  .aux-content .ivu-tabs-content {
    flex: 1;
  }
  .config-settings {
    padding: 16px;
    flex: 1 1 calc(100% - 25em);
    overflow: scroll;
  }
  .small-configs {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
  .small-configs > * {
    flex: 1 0 33.3%;
  }
</style>

<script>
  import fs from 'fs';
  import path from 'path';
  import FileView from './FileView';
  import EditProject from './EditProject';
  import ConfigFiles from './ConfigFiles';
  import SpecFiles from './SpecFiles';
  import ConfigOption from './ConfigOption';
  import Capabilities from './Capabilities';
  import EnvVars from './EnvVars';
  import iView from 'iview';
  import { mapState, mapGetters } from 'vuex';
  import Mousetrap from 'mousetrap';
  import Term from './Term';

  export default {
    name: 'project',
    components: { EditProject, FileView, Term, ConfigFiles, SpecFiles, ConfigOption, Capabilities, EnvVars },

    data () {
      return {
        loading: false,
        error: null,
        testRunning: false,
        configFile: null,
        customCommand: '',
        specs: [],
        logLevelOptions: ['silent', 'verbose', 'command', 'data', 'result', 'error']
      }
    },

    computed: {
      ...mapState({
        envVars: state => state.Project.envVars,
        config: state => state.Project.config,
        configs: state => state.Project.configs,
        overrides: state => state.Project.overrides,
        project: state => state.Project.project
      }),
      ...mapGetters([
        'fullConfigPath'
      ]),
      configsLoaded: function () {
        return this.config.length > 0 && Object.keys(this.configs).length > 0;
      }
    },

    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      this.fetchData()
      this.$electron.ipcRenderer.on('test-status', (e, msg, status) => {
        if (status === 'error' || status === 'success') {
          this.testRunning = false;
        }
      });

      // listen for ctrl/cmd + r
      Mousetrap.bind('ctrl+r', (e) => {
        if (this.configsLoaded && !this.testRunning) {
          this.runTest();
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
        this.$store.dispatch('setConfig', '');

        this.$store.dispatch('setProject', this.$route.params.id)
          .then((project) => {
            iView.LoadingBar.finish();

            if (!project) {
              this.$router.push({ path: '/' });
            } else {
              this.customCommand = this.project.command;
              // check to ensure the database for the project is right
              if (!project.customConfigs) {
                // if no custom configs, set up an array
                this.$store.dispatch('updateProject', { customConfigs: [] });
              }
            }
          })
          .catch((err) => {
            this.error = err;
            iView.LoadingBar.error();
          });
      },
      generateConfigFile () {
        if (this.overrides) {
          // fix for windows pathing issue
          const escapedPath = this.fullConfigPath.replace(/\\/g, '\\\\');
          // write to temp file
          const contents = `exports.config = { ...require('${escapedPath}').config, ...${JSON.stringify(this.overrides)} }`;

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
        this.testRunning = true;
        const tempConfigPath = this.generateConfigFile();
        let envVars = '';
        if (Array.isArray(this.project.envVars)) {
          envVars = this.project.envVars.reduce(function (result, envVar) {
            if (envVar.isEnabled && envVar.name.length > 0 && envVar.value.length > 0) {
              result += `${envVar.name}=${envVar.value} `;
            }

            return result;
          }, '')
        }
        console.log('Project.vue :264', envVars);
        this.$electron.ipcRenderer.send('run-test', this.project.path, envVars, this.customCommand, [tempConfigPath]);
      },
      stopTest () {
        // this.testRunning = false;
        this.$electron.ipcRenderer.send('send-sigint');
      }
    }
  }
</script>
