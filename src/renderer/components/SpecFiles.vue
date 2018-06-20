<template>
  <div>
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <Button type="ghost" v-if="!inInputMode" @click="showFiles">{{configs.specs}}</Button>

    <template v-if="inInputMode">
      <!-- <Tree :data="treeSpecs" show-checkbox v-if="specs"></Tree> -->

      <Select v-model="selectedSpecs" multiple v-if="specs" @on-change="setSpecs">
        <Option v-for="spec in specs" :key="spec" :value="spec" size="small" placeholder="">{{spec}}</Option>
      </Select>
    </template>
  </div>
</template>

<script>
  import ConfigParser from 'webdriverio/build/lib/utils/ConfigParser.js';
  import path from 'path';
  import { mapState } from 'vuex';

  export default {
    name: 'SpecFiles',
    components: { },

    data () {
      return {
        error: null,
        specs: [],
        selectedSpecs: [],
        treeSpecs: [],
        inInputMode: false
      }
    },

    computed: {
      ...mapState({
        project: state => state.Project.project,
        configs: state => state.Project.configs,
        overrides: state => state.Project.overrides,
      })
    },

    watch: {
      'configs': 'resetFiles'
    },
    methods: {
      showFiles () {
        this.inInputMode = true;
        this.findFiles();
      },
      resetFiles () {
        this.inInputMode = false;
        this.specs = [];
        this.selectedSpecs = [];
      },
      findFiles () {
        if ('specs' in this.configs) {
          const pattern = this.configs.specs.map(spec => path.join(this.project.path, spec));
          const specs = ConfigParser.getFilePaths(pattern);

          // this.selectedSpecs = this.specs = specs.map(spec => spec.replace(this.project.path, ''));
          this.selectedSpecs = this.specs = specs.map(spec => spec.replace(this.project.path, '.'));

          this.setSpecs(this.selectedSpecs);

          this.createTree(this.specs);
        }
      },
      growTree (tree, nodes) {
        // check if branch exists
        let branch = tree.find((item) => item.title === nodes[0]);

        // if not, create it
        if (!branch) {
          branch = {
            title: nodes[0],
            expand: true,
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

        tree[0].checked = true;

        this.treeSpecs = tree;
      },
      setSpecs (specs) {
        // todo make this work with treeview
        // check to see if we've changed the specs from the original

        const areSame = (this.selectedSpecs.length === this.specs.length) &&
          this.selectedSpecs.every((spec) => {
            return this.specs.includes(spec);
          });

        if (!areSame) {
          this.$store.commit('setOverride', { specs });
        } else {
          this.$store.commit('removeOverride', 'specs');
        }
      }
    }
  }
</script>

<style>
  .ivu-tree {
    line-height: 2.25;
  }
  .ivu-tree ul li {
    margin: 0;
  }
  .ivu-tree-title {
    padding: 0;
  }
</style>
