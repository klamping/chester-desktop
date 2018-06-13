<template>
  <Layout :style="{minHeight: '50vh'}">
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="project">
      <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">{{project.name}}</Header>
      <Content :style="{padding: '16px'}">

        <p><strong>Project path</strong>: {{project.path}}</p>
        <p><strong>Project command</strong>: {{project.command}}</p>

        <button v-on:click="runTest">Run Test</button>
      </Content>
    </div>
  </Layout>
</template>

<script>
  import db from '../datastore'

  export default {
    name: 'project',
    components: { },

    data () {
      return {
        loading: false,
        project: null,
        error: null
      }
    },

    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      this.fetchData()
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
        this.$electron.ipcRenderer.send('run-test', this.project.path, this.project.command);
      },
      deleteProject (project) {
        this.$store.commit('remove', project)
      }
    }
  }
</script>

<style>
  #info-status {
    position: absolute;
    top: 5px;
    right: 5px;
  }
</style>
