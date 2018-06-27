<template>
  <DropdownItem class="add-project-container">
    <Button class="add-project" @click="addingProject = true" long size="large" type="dashed" icon="plus"><span>Add New Project</span></Button>
    <Modal
        v-model="addingProject"
        title="Add a New Project"
        @on-ok="addProject"
        ok-text="Add"
        cancel-text="Cancel"
        @on-cancel="clear">
      <Form class="project-form" :label-width="100">
        <FormItem label="Project Name">
          <Input type="text" required v-model="name" />
        </FormItem>
        <FormItem label="Folder">
          <Button type="ghost" required v-model="path" @click="addPath()">{{path || 'Choose Folder'}}</Button>
        </FormItem>
      </Form>
    </Modal>
  </DropdownItem>
</template>

<script>
  export default {
    data () {
      return {
        addingProject: false,
        name: '',
        path: ''
      }
    },
    methods: {
      addProject () {
        this.$store.dispatch('addProject', {
          path: this.path,
          name: this.name,
          command: this.command
        })
          .then((project) => {
            this.$router.push({ name: 'project', params: { id: project._id } })
            this.clear();
          })
          .catch(err => {
            console.error(err);
            // show error on form an allow for resubmit
          });
      },
      addPath () {
        this.path = this.$electron.remote.dialog.showOpenDialog({
          properties: ['openDirectory']
        })[0];
      },
      clear () {
        this.name = '';
        this.path = '';
      }
    }
  }
</script>

<style>
  .add-project-container.ivu-dropdown-item {
    padding: 0;
    margin: 5px 0 0;
  }
  .add-project-container .ivu-btn.add-project {
    border: 0;
    border-top: #aaa dashed 1px;
    border-radius: 0;
    padding: 10px 18px;
    color: #999;
    text-align: left;
  }
  .add-project-container .ivu-btn.add-project:hover {
    background: #eee;
  }

  .add-project span {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .ivu-layout-sider-collapsed .add-project span {
    width: 0px;
    transition: width .2s ease;
  }
</style>