<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    router
    @select="handleSelect"
  >
    <el-menu-item index="workbench">
      <i class="el-icon-s-platform"></i>
      <span slot="title">工作台</span>
    </el-menu-item>
    <el-submenu>
      <template slot="title">团队空间</template>
      <template v-for="team in teams">
        <el-menu-item :key="team.id" :index="team.name">{{team.name}}</el-menu-item>
      </template>
    </el-submenu>
    <el-menu-item index="recyclebin">
      <i class="el-icon-delete-solid"></i>
      <span slot="title">回收站</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
import { GetUserTeam } from "../main";
export default {
  data() {
    return {
      teams: {id:'01',name:'all'},
    };
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
  mounted() {
    GetUserTeam(this.$store.status.userId).then((res) => {
      this.team = res.data.teams;
    });
  },
};
</script>
<style>
.el-menu {
  height: 100%;
}
</style>
