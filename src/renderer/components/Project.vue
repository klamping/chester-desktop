<template>
  <Layout :style="{minHeight: '100vh'}">
    <div class="loading" v-if="loading">
      Loading...
    </div>

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
            <Input type="text" v-model="project.command" size="large"/>
          </FormItem>
          <FormItem label="Config Files">
            <ConfigFiles v-bind:path="project.path" @updated="updateConfigFile"/>
          </FormItem>
          <FormItem label="Spec Files" v-if="configFile">
            <SpecFiles v-bind:path="project.path" v-bind:config="configPath" @updated="updateSpecs"/>
          </FormItem>
          <FormItem>
            <Button v-on:click="runTest" type="success" v-bind:disabled="testRunning">Run Test</Button>
            <p>{{generatedCommand}}</p>
          </FormItem>
        </Form>

      </Content>
      <Term class="terminal"></Term>
    </template>
  </Layout>
</template>

<script>
  import db from '../datastore'
  import ConfigFiles from './ConfigFiles'
  import SpecFiles from './SpecFiles'
  import Term from './Term'
  import path from 'path'

  export default {
    name: 'project',
    components: { ConfigFiles, SpecFiles, Term },

    data () {
      return {
        loading: false,
        project: null,
        error: null,
        testRunning: false,
        configFile: null,
        specs: []
      }
    },

    computed: {
      // a computed getter
      generatedCommand: function () {
        let command = `${this.project.command} ${this.configFile}`;

        if (this.specs.length > 0) {
          console.log('Project.vue :69');
          command = `${command} --spec=${this.specs.join(',')}`
        }

        return command;
      },
      configPath: function () {
        return path.join(this.project.path, this.configFile);
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
        this.error = this.post = null
        this.loading = true
        db.findOne({_id: this.$route.params.id}, (err, project) => {
          this.loading = false
          if (err) {
            this.error = err.toString()
          } else {
            this.project = project
          }
        });
      },
      runTest () {
        this.testRunning = true;
        this.$electron.ipcRenderer.send('run-test', this.project.path, this.generatedCommand);
      },
      deleteProject () {
        this.$store.commit('remove', this.project._id);
        this.$router.push('landing-page')
      },
      updatePath () {
        const path = this.$electron.remote.dialog.showOpenDialog({
          properties: ['openDirectory']
        })[0];

        this.project.path = path;
      },
      updateConfigFile (file) {
        this.configFile = file;
      },
      updateSpecs (specs) {
        this.specs = specs;
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
  .project-path {
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
