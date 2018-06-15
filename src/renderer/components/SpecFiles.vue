<template>
  <div>
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <Tree :data="treeSpecs" show-checkbox v-if="specs"></Tree>

    <Select v-model="selectedSpecs" multiple v-if="specs" @on-change="emitEvent">
      <Option v-for="spec in specs" :key="spec" :value="spec" size="small" placeholder="">{{spec}}</Option>
    </Select>
  </div>
</template>

<script>
  import ConfigParser from 'webdriverio/build/lib/utils/ConfigParser.js';
  import path from 'path';

  export default {
    name: 'SpecFiles',
    components: { },

    data () {
      return {
        specs: null,
        error: null,
        selectedSpecs: [],
        treeSpecs: []
      }
    },

    props: {
      config: String,
      path: String
    },

    created () {
      this.findFiles();
    },
    watch: {
      'config': 'findFiles'
    },
    methods: {
      findFiles () {
        try {
          const { config } = this.$electron.remote.require(`${this.config}`);

          const pattern = config.specs.map(spec => path.join(this.path, spec));
          const specs = ConfigParser.getFilePaths(pattern);

          this.specs = this.selectedSpecs = specs.map(spec => spec.replace(this.path, ''));
          this.createTree(this.specs);
          this.$emit('updated', this.selectedSpecs);
        } catch (e) {
          this.error = e;
        }
      },
      growTree (tree, nodes) {
        // check if branch exists
        let branch = tree.find((item) => item.title === nodes[0]);

        // if not, create it
        if (!branch) {
          branch = {
            title: nodes[0],
            children: []
          }
          tree.push(branch);
        }

        if (nodes.length > 1) {
          // go down the stem, creating more if necessary
          this.growTree(branch.children, nodes.slice(1));
        }

        return tree;
      },
      createTree (files, parent) {
        let tree = [];

        files.forEach(file => {
          const nodes = file.split(path.sep);
          tree = this.growTree(tree, nodes.slice(1));
        })

        tree[0].expand = true;
        tree[0].checked = true;

        this.treeSpecs = tree;
      },
      emitEvent () {
        this.$emit('updated', this.selectedSpecs);
      }
    }
  }
</script>

<style>
</style>
