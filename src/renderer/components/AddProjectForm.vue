<template>
  <DropdownItem class="add-project-container">
    <Button class="add-project" @click="addingProject = true" long size="large" type="dashed" icon="plus"><span>Add a Project</span></Button>
    <Modal
        v-model="addingProject"
        title="Add a Project"
        @on-ok="addProject"
        ok-text="Add"
        cancel-text="Cancel"
        @on-cancel="clear">
      <Form class="project-form" :label-width="100">
        <FormItem label="Project Name">
          <Input type="text" required v-model="name" />
        </FormItem>
        <FormItem label="Project Folder">
          <Button type="ghost" required v-model="path" @click="addPath()">{{path || 'Choose Folder'}}</Button>
          <p>This should be the folder containing your <code>package.json</code> file</p>
        </FormItem>
        <FormItem label="Test Command">
          <Input type="text" required v-model="command" />
          <div class="examples">
            <p>Examples:</p>
            <ul>
              <li><code>npx wdio</code></li>
              <li><code>npm test</code></li>
            </ul>
          </div>
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
        path: '',
        command: './node_modules/.bin/wdio'
      }
    },
    methods: {
      addProject () {
        this.$store.dispatch('addProject', {
          path: this.path,
          name: this.name,
          customConfigs: [],
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
        const updatedPath = this.$electron.remote.dialog.showOpenDialog({
          properties: ['openDirectory']
        });

        if (updatedPath) {
          this.path = updatedPath[0]
        }

        // TODO add notice if no config files are found
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
  .examples {
    background: #fafafa;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: .5em 1em;
    margin-top: .5em;
    line-height: 1.5;
  }
  .examples ul {
    margin: 0;
    padding: 0;
  }
  .examples li {
    margin: 0 0 0 2em;
    padding: 0;
  }
</style>