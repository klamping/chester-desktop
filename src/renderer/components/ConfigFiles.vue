<template>
  <div>
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <ButtonGroup v-if="configs">
      <Button v-for="config in configs" v-bind:type="(selectedConfig === config) ? 'primary' : 'default'" :key="config" @click="setConfig(config)">{{config}}</Button>
    </ButtonGroup>
  </div>
</template>

<script>
  import fs from 'fs';
  import { mapState } from 'vuex';

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

    computed: {
      ...mapState({
        project: state => state.Project.project
      })
    },

    created () {
      this.findConfigs();
    },
    watch: {
      'project': 'findConfigs'
    },
    methods: {
      findConfigs () {
        fs.readdir(this.project.path, (err, files) => {
          if (err) {
            this.error = err.toString()
          } else {
            this.configs = files.filter(file => file.endsWith('.conf.js'));

            this.setConfig(this.configs[0]);
          }
        })
      },
      setConfig (configFile) {
        this.selectedConfig = configFile;
        this.$store.dispatch('setConfig', configFile);
      }
    }
  }
</script>

<style>
</style>
