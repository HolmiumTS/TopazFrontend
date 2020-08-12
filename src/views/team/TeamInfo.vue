<!--
完成了团队信息的基本展示
-->
<template>
  <el-container>
    <el-main class="teamInfo">
      <el-page-header content="团队信息"></el-page-header>
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

      <el-button
        type="danger"
        v-if="aboutTeam.creatorId == this.$store.state.userId"
        plain
        round
        @click="handleDissolve"
      >解散团队</el-button>

      <el-button
        type="danger"
        v-if="isInTeam && (aboutTeam.creatorId != this.$store.state.userId)"
        plain
        round
        @click="handleQuit"
      >退出团队</el-button>
    </el-main>
  </el-container>
</template>

<script>
import { GetUserInfo, GetUserTeam, generateTeamUrl } from "../../main";
import { GetTeamInfo } from "../../main";
import { DissolveTeam } from "../../main";

export default {
  data() {
    return {
      aboutTeam: {
        teamName: "Topaz Team", // for test
        teamId: "123",
        creatorId: "19260817",
        teamInfo: "955团队",
        teamUrl: "http://60.205.189.66/team/info?teamId=123",
      },
      creatorInfo: {
        creatorUrl: "https://www.baidu.com",
        creatorUsername: "一个普通的创建者",
        creatorAvatar: "https://i.loli.net/2020/08/11/mfBdpDUIsJChLGM.png",
      },
      isInTeam: true,
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
      let params = {
        id: this.aboutTeam.creatorId,
      };
      GetUserInfo(params).then((res) => {
        if (res.data.result == true) {
          this.creatorInfo.creatorUrl = "www.baidu.com"; // 替换成 http://[ip]/home/[creatorInfo.creatorId]
          this.creatorInfo.creatorUsername = res.data.username;
          this.creatorInfo.creatorAvatar = res.data.avatar;
        } else {
          this.$message.error({
            message: "获取团队创建者信息失败",
          });
        }
      });
    },
  },

  mounted() {
    GetTeamInfo({ teamId: this.$store.state.teamId }).then((res) => {
      this.aboutTeam.teamName = res.data.teamName;
      this.aboutTeam.teamId = this.$store.state.teamId;
      this.aboutTeam.creatorId = res.data.creatorId;
      this.aboutTeam.teamInfo = res.data.teamInfo;
      this.aboutTeam.teamUrl = generateTeamUrl(this.aboutTeam.teamId);
    });
    this.getCreatorUsernameAndAvatar();
    console.log(this.aboutTeam.teamUrl);

    GetUserTeam({ id: this.$store.state.userId }).then((res) => {
      this.isInTeam = false;
      for (var teamID in res.data.joinedTeam) {
        if (teamID == this.aboutTeam.teamId) this.isInTeam = true;
      }
    });
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