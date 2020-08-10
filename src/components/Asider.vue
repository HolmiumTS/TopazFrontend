<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    router
    @open="handleOpen"
    @close="handleClose"
    @select="handleSelect"
  >
    <!-- todo: 把v-for改成确定的菜单项 -->
    <template v-for="route in $router.options.routes">
      <template v-if="route.type==status">
        <el-menu-item v-if="!route.hasChild" :key="route.path" :index="route.path">{{ route.name }}</el-menu-item>
        <template v-else>
          <el-menu-item
            v-for="child in route.children"
            :key="child.path"
            :index="child.path"
          >{{ child.name }}</el-menu-item>
        </template>
      </template>
    </template>
  </el-menu>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    status() {
      return this.$store.state.status;
    },
  },
  methods: {
    handleSelect(key, index) {
      this.$router.push(index);
    },
  },
};
</script>
<style>
.el-menu {
  height: 100%;
}
</style>
