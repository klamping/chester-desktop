<template>
  <div class="file-view-container">
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="isLoading">
      Files loading...
    </div>

    <div v-if="!isLoading">
      <p class="help">(Double-click to open file)</p>
      <ul class="items">
        <Item
          :model="fileTree">
        </Item>
      </ul>
    </div>
  </div>
</template>

<style>
  .file-view-container {
    padding: 5px 10px;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
  }
  .items .sub-items {
    margin-left: 10px;
  }
  .help {
    color: rgb(158, 167, 180);
    text-align: center;
  }
</style>

<script>
  import path from 'path'
  import { mapState } from 'vuex'
  import recursive from 'recursive-readdir'
  import { createTree } from './TreeBuilder.js'
  import Item from './Item'

  export default {
    name: 'FileView',
    components: { Item },

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
      'project.path': 'findFiles'
    },
    methods: {
      findFiles () {
        this.isLoading = true;
        recursive(this.project.path, this.ignoredPatterns).then(
          (files) => {
            this.isLoading = false;
            const folders = this.project.path.split(path.sep);
            const lastFolderName = folders[folders.length - 1];
            let shortFiles = files.map(file => file.replace(this.project.path, `.${path.sep}${lastFolderName}`))
            shortFiles.push(lastFolderName)
            this.fileTree = createTree(shortFiles)[0];
          },
          function (error) {
            this.isLoading = false
            console.error('something exploded', error);
          }
        );
      }
    }
  }
</script>