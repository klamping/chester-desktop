<template>
  <div>
    <Button @click="editingSettings = true" type="ghost" icon="settings"><span>Project Settings</span></Button>
    <Modal
        v-model="editingSettings"
        title="Update Project Settings"
        @on-ok="updateProject"
        ok-text="Update"
        cancel-text="Cancel">
      <Form class="project-form" :label-width="100">
        <FormItem label="Project Name">
          <Input type="text" required v-model="updatedProject.name" />
        </FormItem>
        <FormItem label="Project Folder">
          <Button type="ghost" required @click="updatePath()">{{updatedProject.path}}</Button>
          <p>This should be the folder containing your <code>package.json</code> file</p>
        </FormItem>
        <FormItem label="Test Command">
          <Input type="text" required v-model="updatedProject.command" />
          <div class="examples">
            <p>Examples:</p>
            <ul>
              <li><code>npx wdio</code></li>
              <li><code>npm test</code></li>
            </ul>
          </div>
        </FormItem>

        <Poptip
            confirm
            title="Are you sure you want to delete this project?"
            ok-text="Delete"
            cancel-text="Nevermind"
            @on-ok="deleteProject"
            placement="bottom">
            <Button type="error">Delete Project</Button>
        </Poptip>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    data () {
      return {
        editingSettings: false,
        updatedProject: {}
      }
    },

    computed: {
      ...mapState({
        project: state => state.Project.project
      }),
    },

    created () {
      this.resetProject()
    },
    watch: {
      'project': 'resetProject'
    },

    methods: {
      resetProject () {
        this.updatedProject = { ...this.project };
      },
      updateProject () {
        this.$store.dispatch('updateProject', this.updatedProject)
          .catch(err => {
            console.error(err);
            // show error on form an allow for resubmit
          });
      },
      updatePath () {
        const updatedPath = this.$electron.remote.dialog.showOpenDialog({
          properties: ['openDirectory']
        });

        if (updatedPath) {
          this.updatedProject.path = updatedPath[0]
        }

        // TODO add notice if no config files are found
      },
      deleteProject () {
        this.$store
          .dispatch('remove', this.project._id)
          .then(() => {
            this.$router.push({ path: '/' });
          });
      },
      showSettings () {
        console.log('Project.vue :256');
      }
    }
  }
</script>

<style>
  .delete {
    position: absolute;
    right: 13px;
    top: 13px;
    padding: 0;
    line-height: 1;
  }
  .delete button {
    color: #fe5f55;
    padding: 0 10px;
    font-size: 2em;
  }
  .delete button:hover,
  .delete button:focus {
    color: #fff;
    background: #ff0000;
  }
  .delete .ivu-btn .ivu-icon+span {
    margin: 0;
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