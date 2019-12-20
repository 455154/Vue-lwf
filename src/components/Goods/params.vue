<template>
  <div>
    <my-header>
      <template slot="two"
                slot-scope="scope">
        <span>
          {{path}}
        </span>
      </template>
      <template slot="tree"
                slot-scope="scope">
        <span>
          {{path2}}
        </span>
      </template>
    </my-header>
  </div>
</template>

<script>
import mycommon from '../mycommon.vue'
let Header;
export default {
  data () {
    return {
      path: '商品分类',
      path2: '分类参数'
    }
  },
  created () {

  },
  methods: {

  },
  components: {
    'my-header': mycommon
  }
}
</script>

<style lang="less" scoped>
</style>
