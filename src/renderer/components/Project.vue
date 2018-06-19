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

        <Form :label-width="150">
          <FormItem label="Project command">
            <Input type="text" :value="project.command" @input="updateCommand" size="large"/>
          </FormItem>
          <FormItem label="Config Files">
            <ConfigFiles/>
          </FormItem>
          <FormItem label="Spec Files">
            <SpecFiles/>
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
        <p>{{generatedCommand}}</p>

      </Content>
      <Term class="terminal"></Term>
    </template>
  </Layout>
</template>

<script>
  import ConfigFiles from './ConfigFiles';
  import SpecFiles from './SpecFiles';
  import ConfigOption from './ConfigOption';
  import Term from './Term';
  import iView from 'iview';
  import { mapState } from 'vuex';

  export default {
    name: 'project',
    components: { ConfigFiles, SpecFiles, ConfigOption, Term },

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
      // a computed getter
      generatedCommand: function () {
        let command = `${this.project.command} ${this.config}`;

        if (this.overrides) {
          const cliArgs = Object.keys(this.overrides).reduce((args, arg) => {
            let argValue = this.overrides[arg];

            if (Array.isArray(argValue)) {
              argValue = argValue.join(',');
            }

            return `${args} --${arg}=${argValue}`;
          }, '');
          command = `${command} ${cliArgs}`
        }

        return command;
      }
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
      runTest () {
        this.testRunning = true;
        this.$electron.ipcRenderer.send('run-test', this.project.path, this.generatedCommand);
      },
      deleteProject () {
        this.$store
          .dispatch('remove', this.project._id)
          .then(() => {
            this.$router.push({ path: '/' });
          });
      },
      updateCommand (command) {
        this.$store.dispatch('updateProject', { command });
      },
      updatePath () {
        const path = this.$electron.remote.dialog.showOpenDialog({
          properties: ['openDirectory']
        });

        console.log('Project.vue :137', path);

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
