<template>
  <template>
    <DropdownItem v-for="project in projects" :key="project._id" v-bind:name="project._id">
      <router-link :to="{ name: 'project', params: { id: project._id }}">
        {{project.name}}
      </router-link>
    </DropdownItem>
  </template>
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
  .projects.ivu-menu-vertical .ivu-menu-item {
    position: relative;
    padding: 0;
    transition: width .2s ease .2s;
  }
  .ivu-layout-sider-collapsed .projects .ivu-menu-item {
    transition: width .2s ease .2s;
  }
  .projects .ivu-menu-item a {
    color: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    white-space: nowrap;
    padding: 14px 20px;
  }
  .ivu-layout-sider-collapsed .projects .ivu-menu-item a {
    text-overflow: clip;
    overflow: hidden;
  }
  .ivu-layout-sider-collapsed .projects .ivu-menu-item a:first-letter {
    position: absolute;
    color: #fff;
    margin-right: 30em;
  }
</style>