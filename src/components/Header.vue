<template>
  <el-row class="header">
    <el-col :span="2" style="margin: 0px 0px">
      <img src="../assets/Topaz.png" alt />
      <!--<h3 style="margin: 12px auto">金刚石文档</h3>-->
    </el-col>
    <el-col :span="1" :offset="20">
      <p style="margin: 18px auto" class="el-icon-bell"></p>
    </el-col>
    <el-col :span="1">
      <el-dropdown>
        <span class="el-dropdown-link">
          <p>
            <el-avatar
              :src="avatar"
              :size="30"
              fit="fill"
              v-bind:username="this.$store.state.username"
            >{{username}}</el-avatar>
          </p>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native.prevent="toUserInfo">个人信息</el-dropdown-item>
          <el-dropdown-item @click.native.prevent="Logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    avatar() {
      return this.$store.state.avatar;
      //return "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
    },
  },
  methods: {
    toUserInfo() {
      this.$router.push({
        path: "/userInfo",
        query: {
          userId: this.$store.state.userId,
        },
      });
    },
    Logout() {
      this.$store.dispatch("commitLogout");
      this.$router.push("/login");
    },
  },
  mounted() {},
};
</script>
<style scoped>
.header {
  width: 100%;
  height: 50px;
  margin: 0;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0 0 2px #666;
}
.button {
  margin: 10px 0;
}
.el-avatar {
  margin: -4px auto;
}
</style>