<template>
  <div id="app">
    <div class="background" v-if="!show">
      <transition name="el-zoom-in-center">
        <router-view />
      </transition>
    </div>
    <el-container style="height:100vh;width:100%" v-if="show">
      <el-header v-if="show" style="z-index:2000;height:44px">
        <headerly :key="refresh"></headerly>
      </el-header>
      <el-container>
        <!--<el-aside v-if="show" width="200px" style="margin: 0px -3%;">-->
        <el-aside v-if="show" width="200px" style="background:#EEEEEE">
          <asiderly :key="refresh" class="asi"></asiderly>
        </el-aside>
        <el-main style="background:#F5F5F5;height:100%;width:100%;">
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
import { Message } from "element-ui";
export default {
  name: "app",
  components: {
    headerly,
    asiderly,
  },
  provide: function () {
    return {
      reloadComponent: this.reloadComponent,
    };
  },
  data() {
    return { refresh: 1 };
  },
  computed: {
    show() {
      return this.$store.state.status != "-1";
      //return true;
    },
  },
  methods: {
    reloadComponent() {
      this.refresh = 1 - this.refresh;
      console.log("reloaded: Asider Header");
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
.asi {
  height: calc(100vh - 44px);
}
.background {
  background: url(assets/theatre.png) no-repeat fixed;
  background-position: top left;
  height: 100vh;
  width: 100%;
}
</style>
