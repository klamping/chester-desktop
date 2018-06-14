<template>
  <div>
    <div v-if="error" class="error">
      {{ error }}
    </div>

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
        selectedSpecs: []
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

          this.specs = this.selectedSpecs = specs.map(spec => spec.replace(this.path, '.'));
          this.$emit('updated', this.selectedSpecs);
        } catch (e) {
          this.error = e;
        }
      },
      emitEvent () {
        this.$emit('updated', this.selectedSpecs);
      }
    }
  }
</script>

<style>
</style>
