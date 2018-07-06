<template>
  <div>
    <Tooltip placement="left" content="Have feedback?" class="feedback-container">
      <Button @click="feedbackOpen = true" type="text" icon="chatboxes"></Button>
    </Tooltip>

    <Modal
      v-model="feedbackOpen"
      title="Send Feedback"
      :loading="loading"
      :mask-closable="false"
      @on-cancel="cancelForm"
    >
      <p class="feedback-message">Have a feature request or run in to an issue? I'd love to hear!</p>
      <p class="error" v-if="error">{{error}}</p>
      <Form class="feedback-form" :label-width="100" ref="feedback-form" :model="feedback" :rules="ruleValidate">
        <FormItem label="Your Name" prop="name">
          <Input type="text" required v-model="feedback.name" />
        </FormItem>
        <FormItem label="Your Email" prop="email">
          <Input type="text" required v-model="feedback.email" />
        </FormItem>
        <FormItem label="Your Feedback" prop="message">
          <Input v-model="feedback.message" type="textarea" :autosize="{minRows: 3,maxRows: 10}" placeholder="" required></Input>
        </FormItem>
        <Checkbox v-model="includeSystem" style="margin-left: 100px;font-size: 1.1em;">Include system details?</Checkbox>
      </Form>
      <div slot="footer" class="form-buttons">
        <Button @click="cancelForm()">Cancel</Button>
        <Button type="primary" @click="handleFormSubmit()" :loading="loading">Send</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        feedback: {
          name: '',
          email: '',
          message: ''
        },
        ruleValidate: {
          name: [
            { required: true, message: 'Please provide a name', trigger: 'blur' }
          ],
          email: [
            { required: true, message: 'Please provide an email', trigger: 'blur' },
            { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
          ],
          message: [
            { required: true, message: 'Please enter a message', trigger: 'blur' }
          ]
        },
        feedbackOpen: false,
        error: '',
        includeSystem: false,
        loading: false,
        systemInfo: {
          electron: process.versions['atom-shell'],
          name: this.$route.name,
          node: process.versions.node,
          path: this.$route.path,
          platform: require('os').platform(),
          vue: require('vue/package.json').version
        }
      }
    },

    methods: {
      handleFormSubmit: function () {
        this.error = '';

        this.$refs['feedback-form'].validate((valid) => {
          if (valid) {
            this.loading = true;
            const feedback = { ...this.feedback };
            if (this.includeSystem) {
              feedback.properties = {
                ...this.systemInfo
              };
            }
            this.sendFeedback(JSON.stringify(feedback));
          }
        });
      },
      sendFeedback: function (feedback) {
        const key = 'pMBPYTMA0HvP5CzMdvajlCYZgvHt8umrzkVepewIuYdDNmU982Z9bUYKIc0jqY7M';
        const url = `https://doorbell.io/api/applications/9357/submit?key=${key}`;

        fetch(url, {
          method: 'POST',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: feedback
        })
          .then(response => {
            if (response.status >= 400) {
              this.error = response.body;
            } else {
              this.loading = false;
              this.feedbackOpen = false;
              this.clear();
              this.$Message.info('Feedback sent! Thanks!');
            }
          })
          .catch(error => { this.error = error });
      },
      cancelForm () {
        this.clear();
        this.feedbackOpen = false;
      },
      clear () {
        this.includeSystem = false;
        this.$refs['feedback-form'].resetFields();
      }
    }
  }
</script>

<style scoped>
  .feedback-container .ivu-btn {
    font-size: 26px;
    padding: 0;
  }
  .error {
    color: #fff;
    background: #fe5f55;
    margin: 20px 15px 25px;
    padding: 1em;
    font-size: 1.2em;
    border-radius: 5px;
    font-weight: bold;
  }
  .feedback-form {
    margin-top: 25px;
  }
  .feedback-message {
    font-size: 1.2em;
  }
  .form-buttons {
    display: flex;
    justify-content: space-between;
  }
</style>
