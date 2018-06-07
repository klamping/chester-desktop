<template>
  <ul id="project-list">
    <li v-for="project in projects">
      <button @click="deleteProject(project)">x</button>
      {{project.name}}
      <button @click="runTest(project)">Run Test</button>
    </li>
  </ul>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: mapState({
      projects: state => state.Projects.all
    }),

    methods: {
      runTest (project) {
        this.$electron.ipcRenderer.send('run-test', project.path, project.command);
      },
      deleteProject (project) {
        this.$store.commit('remove', project)
      }
    },

    created () {
      this.$store.dispatch('getProjects')
    }
  }
</script>