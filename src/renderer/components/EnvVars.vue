<template>
  <div>
    <Input type="text" :value="envVars" @on-change="setVars"/>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState({
        envVars: state => state.Project.envVars
      })
    },

    methods: {
      setVars (e) {
        this.$store.commit('setEnvVars', e.target.value);
      },
    }
  }
</script>

<style>
</style>