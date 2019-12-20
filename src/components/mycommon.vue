<template  >
  <div>
    <span class="back">{{mes.one}}<i>/</i></span>
    <span>
      <slot name="two"
            :data="mes"></slot><i>/</i>
    </span>
    <span>
      <slot name="tree"
            :data="mes"></slot>
    </span>

  </div>
</template>

<script>
export default {
  name: 'vTable',
  data () {
    return {
      mes: {
        one: '首页'
      }
    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
* {
  font-size: 14px;
}
div {
  margin-top: -4px;
}
i {
  margin-left: 5px;
  margin-right: 5px;
}
i,
span {
  color: #797b7e;
}
.back{
  font-weight: 700;
  color: #424345;
}
.back:hover{
  color: #65a7f9
}
</style>
