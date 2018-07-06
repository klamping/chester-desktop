<template>
  <Layout>
    <Content v-if="error" class="error">
      {{ error }}
    </Content>

    <template v-if="project">
      <Header class="project-header">
        <h1>{{project.name}}</h1>
        <Button @click="updatePath()" type="text" class="project-path">{{project.path}}</Button>

        <div class="run-buttons" v-if="configsLoaded">
          <Button v-on:click="runTest" type="success" v-bind:disabled="testRunning">Run Tests</Button>
          <Button v-on:click="stopTest" type="success" v-bind:disabled="!testRunning">Stop Tests</Button>
        </div>

        <Tooltip placement="left" content="Delete this project?" class="delete">
          <Button v-on:click="deleteProject" type="text">
            <Icon type="trash-a"></Icon>
          </Button>
        </Tooltip>
      </Header>
      <Content class="content">
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
          <Card v-if="!config">
            No WebdriverIO configuration files were found in "{{project.path}}" matching the `*.conf.js` pattern.
          </Card>

          <template v-if="configsLoaded">
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
              <ConfigOption config="logLevel" :options="logLevelOptions"/>
            </FormItem>
            <FormItem label="Env. Variables">
              <EnvVars/>
            </FormItem>
          </template>
        </Form>
      </Content>
    </template>
  </Layout>
</template>

<style>
  .ivu-layout {
    min-height: 100%;
    max-height: 100%;
  }
  .project-header.ivu-layout-header {
    background: #fff;
    box-shadow: 0 2px 3px 2px rgba(0,0,0,.1);
    display: flex;
    align-items: baseline;
    padding-left: 5em;
    z-index: 2;
    position: relative;
  }
  .delete {
    position: absolute;
    right: 13px;
    top: 13px;
    padding: 0;
    line-height: 1;
  }
  .delete button {
    color: #fe5f55;
    padding: 0 10px;
    font-size: 2em;
  }
  .delete button:hover,
  .delete button:focus {
    color: #fff;
    background: #ff0000;
  }
  .content {
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
  import ConfigFiles from './ConfigFiles';
  import SpecFiles from './SpecFiles';
  import ConfigOption from './ConfigOption';
  import Capabilities from './Capabilities';
  import EnvVars from './EnvVars';
  import iView from 'iview';
  import { mapState, mapGetters } from 'vuex';

  export default {
    name: 'project',
    components: { FileView, ConfigFiles, SpecFiles, ConfigOption, Capabilities, EnvVars },

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
        this.testRunning = true;
        const tempConfigPath = this.generateConfigFile();
        const command = `${this.envVars} ./node_modules/.bin/wdio ${tempConfigPath}`;
        this.$electron.ipcRenderer.send('run-test', this.project.path, command);
      },
      stopTest () {
        this.testRunning = false;
        this.$electron.ipcRenderer.send('send-sigint');
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
