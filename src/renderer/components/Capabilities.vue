<template>
  <div class="cards">
    <Card class="card" v-for="cap in configs.capabilities" v-bind:title="cap.browserName">
      <Button slot="extra" @click="toggle(cap, false)" v-if="capabilities.includes(cap)" type="primary">
          <Icon type="checkmark-round"></Icon>
          Enabled
      </Button>
      <Button slot="extra" @click="toggle(cap, true)" v-if="!capabilities.includes(cap)" type="ghost">
          <Icon type="close-round"></Icon>
          Disabled
      </Button>
      <p v-for="(value, key) in cap" :key="key" v-if="key !== 'browserName'">
        <strong>{{ key }}</strong>: {{ value }}
      </p>
    </Card>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'Capabilities',
    components: { },

    data () {
      return {
        capabilities: [],
      }
    },

    computed: {
      ...mapState({
        configs: state => state.Project.configs,
        overrides: state => state.Project.overrides,
      })
    },

    created () {
      this.resetOverride();
    },
    watch: {
      'configs': 'resetOverride'
    },
    methods: {
      toggle (cap, enabled) {
        if (enabled) {
          this.capabilities.push(cap);
        } else {
          this.capabilities = this.capabilities.filter(c => c !== cap);
        }
        this.$store.commit('setOverride', {
          capabilities: this.capabilities.slice(0)
        });
      },
      resetOverride () {
        if (this.configs.capabilities) {
          this.capabilities = this.configs.capabilities.slice(0);
        }
        this.$store.commit('removeOverride', 'capabilities');
      }
    }
  }
</script>

<style>
  .cards {
    display: flex;
    flex-wrap: wrap;
  }
  .card {
    flex: 1 0 calc(25% - 5px);
    margin: 5px 5px 0 0;
    max-width: calc(50% - 5px);
  }
  .card .ivu-card-extra {
    top: 9px;
  }
</style>
