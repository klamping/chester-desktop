<template>
  <div class="env-vars">
    <FormItem
      v-for="(item, index) in tempEnvVars"
      :key="index"
      inline>
      <div class="env-var">
        <Checkbox v-model="item.isEnabled" @on-change="setVars"/>
        <Input type="text" v-model="item.name" placeholder="Name" class="var-name" @on-change="setVars"></Input>
        <Input type="text" v-model="item.value" placeholder="Value" class="var-value" @on-change="setVars"></Input>
        <Input type="text" v-model="item.description" placeholder="Description..." class="var-description" @on-change="setVars"></Input>

        <Button type="ghost" @click="handleRemove(index)" class="var-delete">Delete</Button>
      </div>
    </FormItem>
    <Button long @click="handleAdd" icon="plus-round">Add Variable</Button>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        tempEnvVars: []
      }
    },

    computed: {
      ...mapState({
        project: state => state.Project.project
      })
    },

    created () {
      this.getVars()
    },
    watch: {
      'project._id': 'getVars'
    },

    methods: {
      getVars () {
        this.tempEnvVars = Array.isArray(this.project.envVars) ? this.project.envVars.map((b, idx) => Object.assign({ index: idx }, b)) : []
      },
      setVars () {
        // console.log('EnvVars.vue :68', this.tempEnvVars);
        this.$store.dispatch('updateProject', { envVars: this.tempEnvVars })
          .catch(err => {
            console.error(err);
          });
      },
      handleAdd () {
        this.tempEnvVars.push({
          name: '',
          value: '',
          isEnabled: true,
          description: ''
        });
      },
      handleRemove (index) {
        this.tempEnvVars.splice(index, 1)
        this.setVars()
      }
    }
  }
</script>

<style>
  .env-var {
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
  }
  .env-var .var-name .ivu-input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .env-var .var-value .ivu-input {
    border-left: 0;
    border-right: 0;
    border-radius: 0;
  }
  .env-var .var-description .ivu-input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .var-delete {
    margin-left: 10px;
  }
</style>