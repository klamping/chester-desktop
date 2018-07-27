<template>
  <div class="no-project-container">
    <div class="no-project-content">
      <div class="no-projects" v-if="projects.length === 0">
        <h2>You have no projects setup.</h2>
        <AddProjectForm></AddProjectForm>
      </div>
      <div class="project-list" v-if="projects.length > 0">
        <h2>Select a project:</h2>

        <ul>
          <li v-for="project in projects" :key="project._id" v-bind:name="project._id">
            <router-link :to="{ name: 'project', params: { id: project._id }}">
              {{project.name}}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import AddProjectForm from './AddProjectForm';
  import { mapState } from 'vuex'

  export default {
    name: 'noproject',
    components: { AddProjectForm },

    computed: {
      ...mapState({
        projects: state => state.Projects.all
      })
    },
  }
</script>

<style>
  .no-project-container {
    display: flex;
    flex: 1;
    padding: 16px;
    justify-content: center;
    align-items: center;
    background: #efefef;
  }
  .no-project-content {
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #fff;
    padding: 30px;
    width: 30em;
  }
  .project-list h2 {
    text-align: center;
    margin-bottom: 1em;
  }
  .project-list ul {
    list-style: none;
    font-size: 1.2em;
  }
  .project-list li {
    margin: 0;
    border-top: 1px solid #ddd;
  }
  .project-list li a {
    display: block;
    padding: 10px;
  }
  .project-list li:first-child {
    border-top: 0;
  }
</style>
