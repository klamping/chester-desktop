<template>
  <li
    class="item"
    :class="{ folder: isFolder }"
  >
    <div
      @click="toggle"
      @dblclick="openFile"
      class="item-name">
      <span v-if="isFolder">
        <Icon type="ios-plus-empty" v-if="!open"></Icon>
        <Icon type="ios-minus-empty" v-if="open"></Icon>
        <Icon type="folder"></Icon>
      </span>
      <Icon type="document" v-if="!isFolder"></Icon>
      {{ model.title }}
    </div>
    <ul v-show="open" v-if="isFolder" class="sub-items">
      <Item
        class="item"
        v-for="(model, index) in model.children"
        :key="index"
        :model="model">
      </Item>
    </ul>
  </li>
</template>

<style>
  .item {
    list-style: none;
  }
  .sub-items .item {
    margin: 0 0 0 12px;
  }
  .sub-items .item.folder {
    margin-left: 2px;
  }
  .item-name {
    cursor: pointer;
    margin: 0 0 5px;
    display: block;
    font-size: 14px;
  }
</style>

<script>
  import path from 'path'
  import { shell } from 'electron'
  import { mapState } from 'vuex'

  export default {
    name: 'Item',
    components: { },

    props: {
      model: Object
    },

    data () {
      return {
        open: this.model.expand
      }
    },

    computed: {
      ...mapState({
        project: state => state.Project.project
      }),
      isFolder: function () {
        return this.model.children &&
          this.model.children.length
      }
    },

    methods: {
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      openFile: function () {
        if (!this.isFolder) {
          const fullPath = path.join(this.project.path, '..', this.model.path, this.model.title)
          shell.openItem(fullPath)
        }
      }
    }
  }
</script>