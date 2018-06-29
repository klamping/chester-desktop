<template>
  <div class="spec-files">
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <Button type="ghost" v-if="!inInputMode" @click="showFiles">{{configs.specs}}</Button>

    <template v-if="inInputMode">
      <!-- <Tree :data="treeSpecs" show-checkbox v-if="specs"></Tree> -->

      <Select v-model="selectedSpecs" multiple v-if="specs" @on-change="setSpecs" placeholder="No Files Selected" not-found-text="No files found">
        <Option v-for="spec in specs" :key="spec" :value="spec" size="small" placeholder="">{{spec}}</Option>
      </Select>
    </template>
  </div>
</template>

<script>
  import ConfigParser from 'webdriverio/build/lib/utils/ConfigParser.js';
  import path from 'path';
  import { mapState } from 'vuex';
  import { createTree } from './TreeBuilder.js'

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
          const include = this.configs.specs.map(spec => path.join(this.project.path, spec));
          const exclude = this.configs.exclude.map(exclude => path.join(this.project.path, exclude));

          const configParser = new ConfigParser();
          const specs = configParser.getSpecs(include, exclude);

          // this.selectedSpecs = this.specs = specs.map(spec => spec.replace(this.project.path, ''));
          this.selectedSpecs = this.specs = specs.map(spec => spec.replace(this.project.path, '.'));

          this.setSpecs(this.selectedSpecs);

          this.treeSpecs = createTree(this.specs);
        }
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
  .spec-files .ivu-tree {
    line-height: 2.25;
  }
  .spec-files .ivu-tree ul li {
    margin: 0;
  }
  .spec-files .ivu-tree-title {
    padding: 0;
  }
</style>
