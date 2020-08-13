<template>
  <div>
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      @select="handleSelect"
      v-if="this.$store.state.status == '0'"
    >
      <el-submenu index>
        <template slot="title">
          <i class="el-icon-s-platform"></i>
          <span>工作台</span>
        </template>
        <el-menu-item index="/home/recentFile">最近浏览的文档</el-menu-item>
        <el-menu-item index="/home/collectedFile">收藏的文档</el-menu-item>
        <el-menu-item index="/home/myFile">我创建的文档</el-menu-item>
      </el-submenu>
      <el-submenu index>
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span>团队空间</span>
          <i
            style="margin:auto 15%;"
            class="el-icon-circle-plus-outline"
            @click="dialogFormVisible=true"
          ></i>
        </template>
        <template v-for="team in teams">
          <el-menu-item :key="team.id" :index="team.id" :disabled="team.id=='-1'">{{team.name}}</el-menu-item>
        </template>
      </el-submenu>
      <el-menu-item index="/home/recyclebin">
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
      <el-menu-item index="goBack">
        <i class="el-icon-back"></i>
        <span slot="title">返回</span>
      </el-menu-item>
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

    <el-dialog :visible.sync="dialogFormVisible" title="创建团队" width="50%">
      <el-form
        :model="createTeamInfoForm"
        ref="createTeamInfoForm"
        label-width="80px"
        :rules="rule"
      >
        <el-form-item label="团队名称" prop="teamName">
          <el-input
            v-model="createTeamInfoForm.teamName"
            placeholder="团队名称"
            maxlength="20"
            show-word-limit="true"
            autofocus="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="团队简介" prop="teamInfo">
          <el-input
            type="textarea"
            v-model="createTeamInfoForm.teamInfo"
            placeholder="团队简介"
            maxlength="300"
            resize="false"
            show-word-limit="true"
            rows="8"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitting" @click.native.prevent="createTeam">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { GetUserTeam, CreateTeam } from "../main";
export default {
  data() {
    return {
      /*teams: [
        { id: "01", name: "test1" },
        { id: "02", name: "test2" },
      ],*/
      //teams: [{ id: "-1", name: "空" }],
      teams: [],
      dialogFormVisible: false,
      submitting: false,
      createTeamInfoForm: {
        teamName: "",
        teamInfo: "",
      },
      rule: {
        teamName: [
          { required: true, message: "请输入团队名称", trigger: "blur" },
        ],
        teamInfo: [
          { required: true, message: "请输入团队简介", trigger: "blur" },
        ],
      },
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
      if (index.toString() == "goBack") {
        this.$store.dispatch("commitChangeStatus", "0");
        this.$router.push("/home/recentFile");
        return;
      }
      for (let i = 0; i < this.teams.length; i++) {
        if (this.teams[i].id == index.toString()) {
          this.$store.dispatch("commitChangeTeamId", this.teams[i].id);
          this.$router.push("/team");
          return;
        }
      }
      this.$router.push(index.toString());
    },

    createTeam() {
      this.$refs.createTeamInfoForm.validate((valid) => {
        if (valid) {
          this.submitting = true;
          let params = {
            id: this.$store.state.userId,
            teamName: this.createTeamInfoForm.teamName,
            teamInfo: this.createTeamInfoForm.teamInfo,
          };
          CreateTeam(params).then((res) => {
            if (res.data.result == true) {
              this.$message({
                type: "success",
                message: "创建团队成功！",
              });
              this.submitting = false;
              this.dialogFormVisible = false;
              // this.$store.dispatch("commitChangeTeamId", "123456");
              this.$store.dispatch("commitChangeTeamId", res.data.teamId);
              this.$store.dispatch("commitChangeStatus", "1");
              this.$router.push({
                path: "/team/info",
              });
            } else {
              this.$message.error({
                message: "创建团队失败，请稍后再试",
              });
            }
          });
        } else {
          this.$message.error({
            message: "请检查输入信息",
          });
        }
      });
    },
  },
  mounted() {
    GetUserTeam({ id: this.$store.state.userId }).then((res) => {
      this.teams = res.data.teams;
    });
    if (this.teams.length < 1) {
      this.teams = [{ id: "-1", name: "空" }];
    }
  },
};
</script>
<style>
.el-menu {
  height: 100%;
}
</style>
