<template>
  <div>
    <FormItem label="Config Files" v-if="allConfigs && allConfigs.length > 0">
      <ButtonGroup>
        <Button v-for="config in allConfigs" v-bind:type="(selectedConfig === config) ? 'primary' : 'default'" :key="config" @click="setConfig(config)">{{config}}</Button>
      </ButtonGroup>
      <Button @click="addConfig()">+</Button>
    </FormItem>

    <div v-if="error" class="error">
      <h2>Error while loading <i>{{selectedConfig}}</i> file:</h2>
      <pre>{{ error }}</pre>
    </div>

    <Card v-if="!allConfigs || allConfigs.length === 0">
      <p>No WebdriverIO configuration files were found in "{{project.path}}" matching the `*.conf.js` pattern.</p>
      <Button @click="addConfig()">Add a custom config location</Button>
    </Card>
  </div>
</template>

<script>
  import fs from 'fs';
  import path from 'path';
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
        project: state => state.Project.project,
      }),
      allConfigs: function () {
        if (this.configs) {
          if (this.project.customConfigs) {
            return [...this.configs, ...this.project.customConfigs];
          } else {
            return this.configs;
          }
        } else {
          return []
        }
      }
    },

    created () {
      this.findConfigs();
    },
    watch: {
      'project.path': 'findConfigs'
    },
    methods: {
      findConfigs () {
        this.error = ''
        fs.readdir(this.project.path, (err, files) => {
          if (err) {
            this.error = err.toString()
          } else {
            this.configs = files.filter(file => file.endsWith('.conf.js'));

            if (this.allConfigs.length > 0) {
              this.setConfig(this.allConfigs[0]);
            }
          }
        })
      },
      addConfig () {
        this.error = ''

        const configPath = this.$electron.remote.dialog.showOpenDialog({
          defaultPath: this.project.path,
          properties: ['openFile', 'multiSelections']
        });

        if (configPath) {
          const trimmedPaths = configPath.map(filepath => filepath.replace(this.project.path + path.sep, ''))

          const allCustomConfigs = [...this.project.customConfigs, ...trimmedPaths];

          this.$store.dispatch('updateProject', { customConfigs: allCustomConfigs });

          this.setConfig(trimmedPaths[0]);
        }
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
