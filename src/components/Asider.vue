<template>
  <div>
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      @select="handleSelect"
      v-if="this.$store.state.status == '0'"
    >
      <el-submenu>
        <template slot="title">
          <i class="el-icon-s-platform"></i>
          <span>工作台</span>
        </template>
        <el-menu-item index="/home/recentFile">最近浏览的文档</el-menu-item>
        <el-menu-item index="/home/collectedFile">收藏的文档</el-menu-item>
        <el-menu-item index="/home/myFile">我创建的文档</el-menu-item>
      </el-submenu>
      <el-submenu>
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span>团队空间</span>
        </template>
        <template v-for="team in teams">
          <el-menu-item :key="team.id" :index="team.name">{{team.name}}</el-menu-item>
        </template>
      </el-submenu>
      <el-menu-item index="/recyclebin">
        <i class="el-icon-delete-solid"></i>
        <span slot="title">回收站</span>
      </el-menu-item>
    </el-menu>
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      @select="handleSelect"
      v-if="this.$store.state.status == '1'"
    >
      <el-menu-item index="/team/doc">
        <i class="el-icon-s-order"></i>
        <span slot="title">团队文档</span>
      </el-menu-item>
      <el-menu-item index="/team/member">
        <i class="el-icon-s-custom"></i>
        <span slot="title">团队成员</span>
      </el-menu-item>
      <el-menu-item index="/team/info">
        <i class="el-icon-info"></i>
        <span slot="title">团队信息</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
import { GetUserTeam } from "../main";
export default {
  data() {
    return {
      teams: [
        { id: "01", name: "test1" },
        { id: "02", name: "test2" },
      ],
      //teams: null,
    };
  },
  computed: {
    status() {
      return this.$store.state.status;
    },
  },
  methods: {
    handleSelect(key, index) {
      for (let i = 0; i < this.teams.length; i++) {
        if (this.teams[i].name == index.toString()) {
          //todo: 跳转到团队页面
          return;
        }
      }
      this.$router.push(index.toString());
    },
  },
  mounted() {
    /*
    GetUserTeam(this.$store.status.userId).then((res) => {
      this.team = res.data.teams;
    });*/
  },
};
</script>
<style>
.el-menu {
  height: 100%;
}
</style>
