<!--
完成了团队信息的基本展示
-->
<!-- Todo: 添加`分享团队`功能 -->
<template>
  <el-container>
    <el-main>
      <el-page-header @back="goBack" content="团队信息"></el-page-header>
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
              <el-tooltip
                class="item"
                effect="light"
                :content="creatorInfo.creatorUsername"
                placement="top"
              >
                <el-avatar :src="creatorInfo.creatorAvatar" :alt="creatorInfo.creatorUsername"></el-avatar>
              </el-tooltip>
            </el-link>
          </td>
        </tr>
        <tr>
          <td>团队简介：</td>
          <td>{{aboutTeam.teamInfo}}</td>
        </tr>
      </table>
      <el-button type="primary" v-if="!isInTeam" round>加入团队</el-button>
    </el-main>
  </el-container>
</template>

<script>
import { GetUserInfo } from "../../main";
import { GetTeamInfo } from "../../main";

export default {
  data() {
    return {
      aboutTeam: {
        teamName: "Topaz Team", // for test
        teamId: "123",
        creatorId: "19260817",
        teamInfo: "955团队",
      },
      creatorInfo: {
        creatorUrl: "https://www.baidu.com",
        creatorUsername: "一个普通的创建者",
        creatorAvatar: "https://i.loli.net/2020/08/11/mfBdpDUIsJChLGM.png",
      },
      isInTeam: false,
    };
  },
  methods: {
    goBack() {
      // 返回到 '我的团队'
      this.$router.push("/home");
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
    GetTeamInfo({ teamId: this.$route.query.teamId }).then((res) => {
      this.aboutTeam.teamName = res.data.teamName;
      this.aboutTeam.teamId = this.$route.query.teamId;
      this.aboutTeam.creatorId = res.data.creatorId;
      this.aboutTeam.teamInfo = res.data.teamInfo;
    });
    this.getCreatorUsernameAndAvatar();
    GetUserTeam({ id: this.$route.query.id }).then((res) => {
      this.isInTeam = false;
      for (var teamID in res.data.joinedTeam) {
        if (teamID == this.aboutTeam.teamId) this.isInTeam = true;
      }
    });
  },
};
</script>

<style scoped>
</style>