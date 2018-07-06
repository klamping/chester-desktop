<template>
  <div>
    <FormItem label="Config Files" v-if="configs && configs.length > 0">
      <ButtonGroup>
        <Button v-for="config in configs" v-bind:type="(selectedConfig === config) ? 'primary' : 'default'" :key="config" @click="setConfig(config)">{{config}}</Button>
      </ButtonGroup>
    </FormItem>

    <div v-if="error" class="error">
      <h2>Error while loading <i>{{selectedConfig}}</i> file:</h2>
      <pre>{{ error }}</pre>
    </div>
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
        this.error = ''
        fs.readdir(this.project.path, (err, files) => {
          if (err) {
            this.error = err.toString()
          } else {
            this.configs = files.filter(file => file.endsWith('.conf.js'));

            if (this.configs.length > 0) {
              this.setConfig(this.configs[0]);
            }
          }
        })
      },
      async setConfig (configFile) {
        this.error = ''
        this.selectedConfig = configFile;
        try {
          await this.$store.dispatch('setConfig', configFile);
        } catch (e) {
          this.error = e.message;
        }
      }
    }
  }
</script>

<style>
</style>
