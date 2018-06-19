<template>
  <div class="add-project-container">
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
        <FormItem label="Command">
          <Input type="text" required v-model="command" />
        </FormItem>
      </Form>
    </Modal>
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
        this.command = './node_modules/.bin/wdio';
      }
    }
  }
</script>

<style>
  .ivu-btn.add-project {
    margin-top: 10px;
    border: 0;
    padding: 10px 18px;
    color: #ddd;
    text-align: left;
    border-top: 1px #aaa dashed;
  }
  .ivu-btn.add-project:hover {
    color: #fff;
    background: #363e4f;
    border-top-color: #2d8cf0;
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