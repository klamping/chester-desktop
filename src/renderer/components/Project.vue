<template>
  <Layout :style="{minHeight: '100vh'}">
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <template v-if="project">
      <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
        <h1>{{project.name}}</h1>
        <Button v-on:click="deleteProject" type="error" class="delete">Delete Project</Button>
      </Header>
      <Content :style="{padding: '16px'}">

        <Form :label-width="150">
          <FormItem label="Project path">
            <Button @click="updatePath()" type="ghost">{{project.path}}</Button>
          </FormItem>
          <FormItem label="Project command">
            <Input type="text" v-model="project.command" size="large"/>
          </FormItem>
          <FormItem label="Config Files">
            <ConfigFiles v-bind:path="project.path"/>
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
  import db from '../datastore'
  import ConfigFiles from './ConfigFiles'
  import Term from './Term'

  export default {
    name: 'project',
    components: { ConfigFiles, Term },

    data () {
      return {
        loading: false,
        project: null,
        error: null,
        testRunning: false
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
        this.$electron.ipcRenderer.send('run-test', this.project.path, this.project.command);
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
      }
    }
  }
</script>

<style>
  .delete {
    position: absolute;
    top: 1.25em;
    right: 1.25em;
  }
  .terminal {
    border-top: 1px solid #eee;
    background: #eee;
    width: 100%;
  }
</style>
