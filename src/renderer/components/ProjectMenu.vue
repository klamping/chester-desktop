<template>
  <Dropdown trigger="click" placement="bottom-start" class="project-menu">
    <Button type="primary">
      <Icon type="navicon-round"></Icon>
    </Button>
    <DropdownMenu slot="list">
      <DropdownItem v-for="project in projects" :key="project._id" v-bind:name="project._id">
        <router-link :to="{ name: 'project', params: { id: project._id }}">
          {{project.name}}
        </router-link>
      </DropdownItem>
      <AddProjectForm></AddProjectForm>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
  import AddProjectForm from './AddProjectForm';
  import { mapState } from 'vuex'

  export default {
    name: 'project-menu',
    components: { AddProjectForm },

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
  .project-menu {
    position: absolute;
    left: 10px;
    top: 15px;
    z-index: 3;
  }
  .project-menu .ivu-select-dropdown {
    padding-bottom: 0;
  }
  .ivu-dropdown-item {
    padding: 0;
  }
  .ivu-dropdown-item a {
    display: block;
    margin: 0;
    padding: 8px 16px;
    font-size: 1.2em;
  }
</style>
