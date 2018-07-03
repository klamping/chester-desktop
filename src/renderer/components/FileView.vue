<template>
  <div class="file-view-container">
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="isLoading">
      Files loading...
    </div>

    <Tree :data="fileTree" v-if="!isLoading && !error" v-on:on-select-change="openFile"></Tree>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import recursive from 'recursive-readdir'
  import { createTree } from './TreeBuilder.js'
  import { shell } from 'electron'

  export default {
    name: 'FileView',
    components: { },

    data () {
      return {
        fileTree: null,
        isLoading: true,
        error: null,
        ignoredPatterns: ['node_modules', '.git', '.DS_Store', 'junit', 'allure-results', 'allure-report']
      }
    },

    computed: {
      ...mapState({
        project: state => state.Project.project
      })
    },

    created () {
      this.findFiles();
    },
    watch: {
      'project': 'findFiles'
    },
    methods: {
      findFiles () {
        this.isLoading = true;
        recursive(this.project.path, this.ignoredPatterns).then(
          (files) => {
            this.isLoading = false;
            let shortFiles = files.map(file => file.replace(this.project.path, '.'))
            this.fileTree = createTree(shortFiles);
          },
          function (error) {
            this.isLoading = false
            console.error('something exploded', error);
          }
        );
      },

      openFile (file) {
        console.log('FileView.vue :63', arguments);

        console.log('FileView.vue :65', shell);
      }
    }
  }
</script>

<style>
.file-view-container {
  padding: 5px 10px;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}
</style>
