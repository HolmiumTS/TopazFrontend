<template>
  <div>
    <el-row class="header">
      <el-col :span="2" style="margin: 0px 0px">
        <img src="../assets/Topaz.png" alt />
        <!--<h3 style="margin: 12px auto">金刚石文档</h3>-->
      </el-col>
      <el-col :span="4" :offset="9">
        <el-input
          style="margin: 10px auto;width:100%;"
          v-model="sFile"
          placeholder="输入文档Id以搜索文档"
          clearable
          size="small"
        >
          <el-button slot="append" icon="el-icon-search" circle @click.native.prevent="searchFiles"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-input
          style="margin: 10px 15%;width:100%;"
          v-model="sTeam"
          placeholder="输入团队Id或团队名以搜索团队"
          clearable
          size="small"
        >
          <el-button slot="append" icon="el-icon-search" circle @click.native.prevent="searchTeams"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button
          style="margin: 10px 60%"
          type="info"
          size="small"
          @click.native.prevent="newFile"
        >创建文档</el-button>
      </el-col>
      <el-col :span="1">
        <i style="margin: 18px 100%" class="el-icon-bell"></i>
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
                style="margin: -4px 100%"
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
    <el-dialog :visible.sync="dis0" title="文档搜索结果">
      <!-- todo -->
    </el-dialog>
    <el-dialog :visible.sync="dis1" title="团队搜索结果" modal="false">
      <el-table :data="teams" style="width: 100%" border>
        <el-table-column prop="id" label="团队Id" min-width="20%"></el-table-column>
        <el-table-column prop="name" label="团队名称" min-width="20%"></el-table-column>
        <el-table-column prop="info" label="团队简介" min-width="40"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="15%" :resizable="false">
          <template slot-scope="scope">
            <el-button @click.native.prevent="applyToTeam(scope.$index)" size="small">申请加入</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { SearchTeams } from "../main";
import { ApplyToTeam } from "../main";
export default {
  data() {
    return {
      dis0: false,
      dis1: false,
      sFile: "",
      sTeam: "",
      teams: [
        { id: "001", name: "moyu", info: "955" },
        { id: "002", name: "baogan", info: "996" },
      ],
      //teams: null,
    };
  },
  computed: {
    avatar() {
      //return this.$store.state.avatar;
      return "https://ftp.bmp.ovh/imgs/2020/08/182a2651f9696ab4.png";
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
    newFile() {
      //todo
    },
    searchTeams() {
      SearchTeams({
        id: this.$store.state.userId,
        keyword: this.sTeam,
      }).then((res) => {
        this.teams = res.data.teams;
      });
      this.dis1 = true;
    },
    searchFiles() {
      //todo
    },
    applyToTeam(index) {
      //todo
      ApplyToTeam({
        userId: this.$store.state.userId,
        teamId: this.teams[index].id,
      }).then((res) => {
        if (res.data.result == true) {
          this.$message({
            type: "success",
            message: "申请提交成功",
          });
        } else {
          this.$message.error("申请提交失败，请稍后再试");
        }
      });
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
</style>