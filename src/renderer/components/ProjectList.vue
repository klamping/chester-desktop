<template>
  <Menu theme="dark" width="auto" v-bind:active-name="$route.params.id">
    <MenuItem v-for="project in projects" :key="project._id" v-bind:name="project._id">
      <router-link :to="{ name: 'project', params: { id: project._id }}">
        {{project.name}}
      </router-link>
    </MenuItem>
  </Menu>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState({
        projects: state => state.Projects.all
      })
    },

    created () {
      this.$store.dispatch('getProjects')
    }
  }
</script>

<style>
  .ivu-menu-vertical .ivu-menu-item {
    position: relative;
    padding: 0;
  }
  .ivu-menu-item a {
    color: inherit;
    padding: 14px 24px;
    display: block;
  }
</style>