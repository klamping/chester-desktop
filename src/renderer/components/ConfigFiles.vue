<template>
  <div>
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <ButtonGroup v-if="configs">
      <Button v-for="config in configs" v-bind:type="(selectedConfig === config) ? 'primary' : 'default'" :key="config" @click="selectedConfig = config">{{config}}</Button>
    </ButtonGroup>
  </div>
</template>

<script>
  import fs from 'fs';

  export default {
    name: 'ConfigFiles',
    components: { },

    data () {
      return {
        configs: null,
        error: null,
        selectedConfig: null
      }
    },

    props: {
      path: String
    },

    created () {
      this.findConfigs();
    },
    watch: {
      'path': 'findConfigs'
    },
    methods: {
      findConfigs () {
        fs.readdir(this.path, (err, files) => {
          if (err) {
            this.error = err.toString()
          } else {
            this.configs = files.filter(file => file.endsWith('.conf.js'));
            this.selectedConfig = this.configs[0]
          }
        })
      }
    }
  }
</script>

<style>
</style>
