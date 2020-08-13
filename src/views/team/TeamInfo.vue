<!--
完成了团队信息的基本展示
-->
<template>
  <el-container>
    <el-main class="teamInfo">
      <h2>团队信息</h2>
      <table border="0" cellspacing="20" style="margin:0 auto;">
        <tr>
          <td>团队名称：</td>
          <td>{{aboutTeam.teamName}}</td>
        </tr>
        <tr>
          <td>团队编号：</td>
          <td>{{aboutTeam.teamId}}</td>
        </tr>
        <tr>
          <td>团队创建者：</td>
          <td>
            <el-link :underline="false" :href="creatorInfo.creatorUrl">
              <el-avatar :src="creatorInfo.creatorAvatar" :alt="creatorInfo.creatorUsername"></el-avatar>
              <span>{{creatorInfo.creatorUsername}}</span>
            </el-link>
          </td>
        </tr>
        <tr>
          <td>团队简介：</td>
          <td>{{aboutTeam.teamInfo}}</td>
        </tr>
      </table>

      <el-dialog :visible.sync="dialogFormVisible" title="修改团队信息" width="50%">
        <el-form
          :model="changeTeamInfoForm"
          ref="changeTeamInfoForm"
          label-width="80px"
          :rules="rule"
        >
          <el-form-item label="团队名称" prop="teamName">
            <el-input
              v-model="changeTeamInfoForm.teamName"
              placeholder="团队名称"
              maxlength="20"
              show-word-limit="true"
              autofocus="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="团队简介" prop="teamInfo">
            <el-input
              type="textarea"
              v-model="changeTeamInfoForm.teamInfo"
              placeholder="团队简介"
              maxlength="300"
              resize="false"
              show-word-limit="true"
              rows="8"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="submitting" @click.native.prevent="submitTeamInfo">确认</el-button>
        </div>
      </el-dialog>

      <el-button
        type="primary"
        v-if="isCreatorOrAdmin"
        plain
        round
        @click.native.prevent="dialogFormVisible=true"
      >修改团队信息</el-button>

      <el-button
        type="danger"
        v-if="aboutTeam.creatorId == this.$store.state.userId"
        plain
        round
        @click.native.prevent="handleDissolve"
      >解散团队</el-button>

      <el-button
        type="danger"
        v-if="isInTeam && (aboutTeam.creatorId != this.$store.state.userId)"
        plain
        round
        @click.native.prevent="handleQuit"
      >退出团队</el-button>
    </el-main>
  </el-container>
</template>

<script>
import { GetTeamInfo } from "../../main";
import { DissolveTeam } from "../../main";
import { GetUserInfo, GetUserTeam, GetTeamMember, ChangeTeamInfo } from "../../main";

export default {
  data() {
    return {
      aboutTeam: {
        // teamName: "Topaz Team", // for test
        // teamId: "123",
        // creatorId: "19260817",
        // teamInfo: "955团队",
         //teamName: "",
         //teamId: "",
         //creatorId: "",
         //teamInfo: "",
      },
      creatorInfo: {
        creatorUrl: "",
        creatorUsername: "",
        creatorAvatar: "",
        // creatorUrl: "https://www.baidu.com",
        // creatorUsername: "一个普通的创建者",
        // creatorAvatar: "https://i.loli.net/2020/08/11/mfBdpDUIsJChLGM.png",
      },
      changeTeamInfoForm: {
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
      dialogFormVisible: false,
      isInTeam: false,
      isCreatorOrAdmin: false,
      submitting: false,
    };
  },
  methods: {
    handleDissolve() {
      this.$confirm("确定要解散团队吗？这是不可逆转的操作", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            teamId: this.aboutTeam.teamId,
          };
          console.log("confirm dissolve");
          DissolveTeam(params).then((res) => {
            if (res.data.result == true) {
              this.$message({
                type: "success",
                message: "成功解散团队",
              });
              this.$router.push("/home"); // 返回到主页
            } else {
              this.$message.error({
                message: "解散团队失败，请稍后再试",
              });
            }
          });
        })
        .catch(() => {});
    },

    handleQuit() {
      let params = {
        id: this.$store.state.userId,
        teamId: this.aboutTeam.teamId,
      };
      console.log(params.id + " quit team " + params.teamId);
      QuitTeam(params).then((res) => {
        if (res.data.result == true) {
          this.$message({
            type: "success",
            message: "成功退出团队！",
          });
        } else {
          this.$message.error({
            message: "退出团队失败，请稍后再试",
          });
        }
      });
    },

    getCreatorUsernameAndAvatar() {
      console.log("creatorId: "+this.aboutTeam.creatorId);
      let params = {
        id: this.aboutTeam.creatorId,
      };
      GetUserInfo(params).then((res) => {
        if (res.data.result == true) {
          this.creatorInfo.creatorUrl =
            "http://localhost:8080/userInfo?userId=" + creatorInfo.creatorId; // 替换成 http://[ip]/home/[creatorInfo.creatorId]
          this.creatorInfo.creatorUsername = res.data.username;
          this.creatorInfo.creatorAvatar = res.data.avatar;
        } else {
          this.$message.error({
            message: "获取团队创建者信息失败",
          });
        }
      });
    },

    submitTeamInfo() {
      this.$refs.changeTeamInfoForm.validate((valid) => {
        if (valid) {
          let params = {
            teamId: this.aboutTeam.teamId,
            teamName: this.changeTeamInfoForm.teamName,
            teamInfo: this.changeTeamInfoForm.teamInfo,
          };
          this.submitting = true;
          console.log(params);
          ChangeTeamInfo(params).then((res) => {
            if (res.data.result == true) {
              this.$message({
                type: "success",
                message: "信息修改成功",
              });
              this.aboutTeam.teamName = this.changeTeamInfoForm.teamName;
              this.aboutTeam.teamInfo = this.changeTeamInfoForm.teamInfo;
              this.submitting = false;
              this.dialogFormVisible = false;
              this.mounted();
              this.$router.push({
                path: "/team/info",
              });
            } else {
              this.$message.error({
                message: "修改团队信息失败",
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
    console.log(this.$store.state.teamId);
    GetTeamInfo({ teamId: this.$store.state.teamId }).then((res) => {
      if (res.data.result == false) {
        console.log("ERROR");
      } else {
        this.aboutTeam.teamName = res.data.teamName;
        this.aboutTeam.teamId = this.$store.state.teamId;
        this.aboutTeam.creatorId = res.data.creatorId;
        this.aboutTeam.teamInfo = res.data.teamInfo;
      }
      console.log("creatorId2: "+res.data.creatorId);
    });
    console.log("teamInfo: "+this.aboutTeam.teamInfo);
    console.log("creatorId3: "+this.aboutTeam.creatorId);
    this.changeTeamInfoForm.teamName = this.aboutTeam.teamName;
    this.changeTeamInfoForm.teamInfo = this.aboutTeam.teamInfo;

    this.getCreatorUsernameAndAvatar();
    this.submitting = false;
    this.dialogFormVisible = false;

    GetTeamMember({ teamId: this.$store.state.teamId }).then((res) => {
      var userId = this.$store.state.userId;
      if (
        userId == this.aboutTeam.creatorId ||
        res.data.adminId.includes(userId)
      )
        this.isCreatorOrAdmin = true;
    });

    GetUserTeam({ id: this.$store.state.userId }).then((res) => {
      this.isInTeam = false;
      for (var teamID in res.data.joinedTeam) {
        if (teamID == this.aboutTeam.teamId) this.isInTeam = true;
      }
    });
    console.log("creatorId3: "+this.aboutTeam.creatorId);
  },
};
</script>

<style scoped>
.teamInfo {
  margin: auto auto;
  background: #fff;
  box-shadow: 0 0 8px #b4bccc;
  padding: 20px 30px 30px 30px;
  border-radius: 10px;
}

span {
  margin-left: 10px;
  vertical-align: middle;
}
</style>
