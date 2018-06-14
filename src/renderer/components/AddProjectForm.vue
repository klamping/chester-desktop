<template>
  <div class="add-project-container">
    <Button class="add-project" @click="addingProject = true" v-if="!addingProject" long type="dashed" icon="plus">Add New Project</Button>
    <Form v-if="addingProject" class="project-form" label-position="top">
      <FormItem label="Project Name">
        <Input type="text" required v-model="name" />
      </FormItem>
      <FormItem label="Folder">
        <Input type="text" required v-model="path" @click="addPath()" />
      </FormItem>
      <FormItem label="Command">
        <Input type="text" required v-model="command" />
      </FormItem>
      <Button @click="addProject()" long type="success">Add</Button><br /><br />
      <Button @click="addingProject = false" type="warning" long>Cancel</Button>
    </Form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        addingProject: false,
        name: '',
        path: '',
        command: './node_modules/.bin/wdio'
      }
    },
    methods: {
      addProject () {
        this.$store.commit('add', {
          path: this.path,
          name: this.name,
          command: this.command
        });
        this.addingProject = false;
      },
      addPath () {
        this.path = this.$electron.remote.dialog.showOpenDialog({
          properties: ['openDirectory']
        })[0];
      }
    }
  }
</script>

<style>
  .add-project-container {
    margin-top: 1em;
    border-top: 1px #aaa dashed;
  }
  .ivu-btn.add-project {
    border: 0;
    color: #ddd;
    text-align: left;
  }
  .ivu-btn.add-project:hover {
    color: #fff;
    border-color: #5cadff;
  }
  .project-form {
    color: #fff;
    padding: 1em 10px;
  }
  .project-form.ivu-form .ivu-form-item-label {
    color: #fff;
  }
</style>