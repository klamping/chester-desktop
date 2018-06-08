<template>
  <div>
    <button @click="addingProject = true" v-if="!addingProject">+ New Project</button>
    <div v-if="addingProject">
      <input type="text" required placeholder="Project Name" v-model="name">
      <input type="text" required placeholder="Folder" v-model="path" @click="addPath()">
      <input type="text" required placeholder="Command" v-model="command">
      <button @click="addProject()">Add</button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        addingProject: false,
        name: '',
        path: '',
        command: './node_modules/.bin/wdio'
      }
    },
    methods: {
      addProject () {
        this.$store.commit('add', {
          path: this.path,
          name: this.name,
          command: this.command
        });
        this.addingProject = false;
      },
      addPath () {
        this.path = this.$electron.remote.dialog.showOpenDialog({
          properties: ['openDirectory']
        })[0];
      }
    }
  }
</script>