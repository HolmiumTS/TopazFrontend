<template>
  <div id="app">
    <el-container style="height:95vh">
      <el-header v-if="show" style="z-index:1">
        <headerly></headerly>
      </el-header>
      <el-container>
        <el-aside v-if="show" width="200px">
          <asiderly></asiderly>
        </el-aside>
        <el-main>
          <transition name="el-zoom-in-center">
            <router-view />
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import headerly from "@/components/Header.vue";
import asiderly from "@/components/Asider.vue";
export default {
  name: "app",
  components: {
    headerly,
    asiderly,
  },
  data() {
    return { winHeight: window.innerHeight };
  },
  computed: {
    show() {
      //return this.$store.state.status != "-1";
      return true;
    },
  },
};
</script>
<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}
.el-aside {
  text-align: left;
}
</style>
