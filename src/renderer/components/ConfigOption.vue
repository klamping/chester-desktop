<template>
  <div>
    <Select filterable v-if="options" v-model="override" @on-change="setOverride">
      <Option v-for="option in options" :value="option" :key="option">{{ option }}</Option>
    </Select>

    <template v-if="!options">
      <Button type="ghost" v-if="!inInputMode" @click="showInput" long>{{override || configs[config]}}</Button>

      <template v-if="inInputMode">
        <Input type="text" v-model="override" @on-enter="closeInput" @on-change="setOverride">
          <div slot="append">
            <Button icon="checkmark" @click="closeInput"></Button>
            <Button icon="close" @click="cancelInput"></Button>
          </div>
        </Input>
      </template>
    </template>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'ConfigOption',
    components: { },

    data () {
      return {
        error: null,
        inInputMode: false,
        override: null
      }
    },

    computed: {
      ...mapState({
        configs: state => state.Project.configs,
        overrides: state => state.Project.overrides,
      })
    },

    props: {
      config: String,
      options: Array
    },

    created () {
      this.override = this.configs[this.config];
    },
    watch: {
      'configs': 'resetOverride'
    },
    methods: {
      showInput () {
        this.inInputMode = true;
      },
      cancelInput () {
        this.inInputMode = false;
        this.resetOverride();
      },
      closeInput () {
        this.inInputMode = false;
      },
      setOverride () {
        this.$store.commit('setOverride', {
          [this.config]: this.override
        });
      },
      resetOverride () {
        this.override = this.configs[this.config];
        this.$store.commit('removeOverride', this.config);
      }
    }
  }
</script>

<style>
</style>
