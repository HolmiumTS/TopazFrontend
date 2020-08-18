<!--
TODO:
未考虑管理员设置和取消后的页面表格变动问题
-->

<template>
  <el-container>
    <el-main class="teamMember">
      <h2>团队成员</h2>
      <el-table
        height="600"
        :data="memberInfo"
        style="width: 1000px;margin:auto auto;border-radius: 20px;box-shadow: 0 0 5px #b4bccc;padding: 20px 30px 30px 30px;"
        :default-sort="{prop: 'memberType', order: 'ascending'}"
      >
        <el-table-column label="用户" min-width="40%">
          <template slot-scope="scope">
            <el-link :underline="false" :href="scope.row.memberUrl">
              <el-avatar :src="getAvatar(scope.row.memberAvatar)" :alt="scope.row.memberUsername"></el-avatar>
              <span>{{scope.row.memberUsername}}</span>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="权限" min-width="30%">
          <template slot-scope="scope">
            <div v-if="scope.row.memberType==0">创建者</div>
            <div v-else-if="scope.row.memberType==1">管理员</div>
            <div v-else-if="scope.row.memberType==2">普通成员</div>
            <!-- <div v-else>ERROR</div> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="30%">
          <template slot-scope="scope">
            <!-- <el-button
              type="primary"
              plain
              v-if="scope.row.memberType == 2 && userTypeInTeam == 0"
              @click.native.prevent="setAdmin(scope.$index, scope.row)"
            >设为管理员</el-button>

            <el-button
              type="warning"
              plain
              v-if="scope.row.memberType == 1 && userTypeInTeam == 0"
              @click.native.prevent="cancelAdmin(scope.$index, scope.row)"
            >取消管理员</el-button>-->
            <el-button
              v-if="userTypeInTeam == 0 && scope.row.memberType != 0"
              plain
              :type="scope.row.buttonType"
              @click.native.prevent="changeAdmin(scope.$index, scope.row)"
            >{{scope.row.buttonText}}</el-button>

            <el-button
              type="success"
              plain
              round
              v-if="scope.row.memberType<=1&&userId==scope.row.memberId"
              @click.native.prevent="getAllApplication()"
            >审核申请</el-button>

            <el-button
              type="danger"
              plain
              v-if="userTypeInTeam<scope.row.memberType"
              @click.native.prevent="confirmKickOff(scope.$index, scope.row.memberId, scope.row.memberUsername)"
            >踢出团队</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="审核申请" :visible.sync="dialogTableVisible">
        <el-table :data="applicationInfo">
          <el-table-column label="用户" width="350">
            <template slot-scope="scope">
              <el-link :underline="false" :href="scope.row.url">
                <el-avatar :src="getAvatar(scope.row.avatar)" :alt="scope.row.username"></el-avatar>
                <span>{{scope.row.username}}</span>
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350">
            <template slot-scope="scope">
              <el-button
                type="primary"
                plain
                @click.native.prevent="judgeApplication(scope.$index, scope.row.id, true)"
              >通过</el-button>

              <el-button
                type="warning"
                plain
                @click.native.prevent="judgeApplication(scope.$index, scope.row.id, false)"
              >拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import {
  GetTeamMember,
  generateUserUrl,
  SetAdmin,
  CancelAdmin,
  GetAllApplication,
  JudgeApplication,
  KickOff,
  GetUserInfo,
} from "../../main";

export default {
  data() {
    return {
      dialogTableVisible: false,
      aboutTeam: {
        // teamName: "Topaz Team", // for test
        // teamId: "123",
        // creatorId: "19260817",
        // teamInfo: "955团队",
      },
      userId: "",
      userTypeInTeam: 2, //  0 创建者，1 管理员，2 成员
      applicationInfo: [],
      memberInfo: [
        // {
        //   memberId: "1",
        //   memberUrl: "https://www.google.com",
        //   memberUsername: "谷歌",
        //   memberType: 0,
        //   memberAvatar: "https://i.loli.net/2020/08/11/qSLd3msVgwRlZaj.png",
        // },
        // {
        //   memberId: "2",
        //   memberUrl: "https://www.bing.com",
        //   memberUsername: "必应",
        //   memberType: 1,
        //   memberAvatar: "https://i.loli.net/2020/08/11/RgaFXCAEDI62mfP.png",
        // },
        // {
        //   memberId: "3",
        //   memberUrl: "https://www.duckduckgo.com",
        //   memberUsername: "鸭鸭走",
        //   memberType: 1,
        //   memberAvatar: "https://i.loli.net/2020/08/11/UnM3fR6DxVG4ATo.png",
        // },
        // {
        //   memberId: "5",
        //   memberUrl: "https://www.sogou.com",
        //   memberUsername: "搜狗",
        //   memberType: 2,
        //   memberAvatar: "https://i.loli.net/2020/08/11/wTIekN52t1xEqQc.png",
        // },
        // {
        //   memberId: "4",
        //   memberUrl: "https://www.baidu.com",
        //   memberUsername: "百度",
        //   memberType: 2,
        //   memberAvatar: "https://i.loli.net/2020/08/11/sqywvkrAh9JY5od.png",
        // },
      ], // memberType: 0 创建者，1 管理员，2 成员
    };
  },
  methods: {
    getAvatar(avatar) {
      return avatar || "https://ftp.bmp.ovh/imgs/2020/08/182a2651f9696ab4.png";
    },

    getAllApplication() {
      this.dialogTableVisible = true;
      let params = {
        teamId: this.aboutTeam.teamId,
      };
      GetAllApplication(params).then((res) => {
        console.log(res.data);
        if (res.data.result == true) {
          this.applicationInfo.splice(0, this.applicationInfo.length);
          var length = res.data.application.length;
          for (var i = 0; i < length; i++) {
            var tmp = res.data.application[i];
            this.applicationInfo.push({
              id: tmp.id,
              url: generateUserUrl(tmp.id),
              username: tmp.username,
              avatar: tmp.avatar,
            });
          }
        } else {
          this.$message.error({
            message: "获取申请失败，请稍后再试",
          });
        }
      });
      // for test
      /*this.applicationInfo.push({
        id: "12",
        url: "www.bilibili.com",
        username: "bilibili",
        avatar: "https://i.loli.net/2020/08/11/8u6PdLt9vyCaUcX.png",
      });
      this.applicationInfo.push({
        id: "11",
        url: "www.acfun.cn",
        username: "acfun",
        avatar: "https://i.loli.net/2020/08/11/Rqm3hEG6bnHLsd4.png",
      });*/
      // for test
    },

    judgeApplication(index, id, isAccept) {
      let params = {
        teamId: this.aboutTeam.teamId,
        id: id,
        isAccept: isAccept == true ? "true" : "false",
      };
      console.log("JudgeApplication.params: " + params);
      JudgeApplication(params).then((res) => {
        if (res.data.result == true) {
          this.$message({
            type: "success",
            message: "审核成功",
          });
          // this.$router.go(0);
          GetUserInfo({ id: id }).then((res) => {
            this.memberInfo.push({
              memberId: id,
              memberUrl: generateUserUrl(id),
              memberUsername: res.data.username,
              memberType: 2,
              memberAvatar: res.data.avatar,
              buttonType: "primary",
              buttonText: "设为管理员"
            });
          });
          this.applicationInfo.splice(index, 1);
        } else {
          this.$message.error({
            message: "审核失败，请稍后再试",
          });
        }
      });
    },

    changeAdmin(index, row) {
      if (row.memberType == 1) this.cancelAdmin(index, row);
      else this.setAdmin(index, row);
    },

    setAdmin(index, row) {
      console.log(row.memberId + " is set as Admin.");
      let params = {
        teamId: this.aboutTeam.teamId,
        id: row.memberId,
      };
      SetAdmin(params).then((res) => {
        if (res.data.result == true) {
          this.$message({
            type: "success",
            message: "管理员设置成功",
          });
          this.memberInfo.splice(index, 1, {
            memberId: row.memberId,
            memberUrl: row.memberUrl,
            memberUsername: row.memberUsername,
            memberType: 1,
            memberAvatar: row.memberAvatar,
            buttonType: "warning",
            buttonText: "取消管理员",
          });
        } else {
          this.$message.error({
            message: "管理员设置失败，请稍后再试",
          });
        }
      });
    },

    cancelAdmin(index, row) {
      console.log(row.memberId + " is cancelled.");
      let params = {
        teamId: this.aboutTeam.teamId,
        id: row.memberId,
      };
      CancelAdmin(params).then((res) => {
        if (res.data.result == true) {
          this.$message({
            type: "success",
            message: "管理员取消成功",
          });
          this.memberInfo.splice(index, 1, {
            memberId: row.memberId,
            memberUrl: row.memberUrl,
            memberUsername: row.memberUsername,
            memberType: 2,
            memberAvatar: row.memberAvatar,
            buttonType: "primary",
            buttonText: "设为管理员",
          });
        } else {
          this.$message.error({
            message: "管理员取消失败，请稍后再试",
          });
        }
      });
    },

    confirmKickOff(index, id, username) {
      this.$confirm("确定要将" + username + "踢出团队吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.kickOff(index, id);
        })
        .catch(() => {});
    },

    kickOff(index, id) {
      console.log(id + " is kicked off.");
      let params = {
        teamId: this.aboutTeam.teamId,
        id: id,
      };
      KickOff(params).then((res) => {
        if (res.data.result == true) {
          this.$message({
            type: "success",
            message: "踢出成员成功",
          });
          this.memberInfo.splice(index, 1);
        } else {
          this.$message.error({
            message: "踢出成员失败，请稍后再试",
          });
        }
      });
    },
  },

  mounted() {
    this.userId = this.$store.state.userId;
    this.aboutTeam.teamId = this.$store.state.teamId;
    let params = {
      teamId: this.aboutTeam.teamId,
    };
    GetTeamMember(params).then((res) => {
      if (res.data.result == true) {
        for (let i = 0; i < res.data.memberInfo.length; i++) {
          this.memberInfo.push({});
          this.memberInfo[i].memberId = res.data.memberInfo[i].memberId;
          this.memberInfo[i].memberUrl = generateUserUrl(
            this.memberInfo[i].memberId
          );
          this.memberInfo[i].memberUsername =
            res.data.memberInfo[i].memberUsername;
          this.memberInfo[i].memberType = parseInt(
            res.data.memberInfo[i].memberType
          );
          this.memberInfo[i].memberAvatar = res.data.memberInfo[i].memberAvatar;
          if (this.memberInfo[i].memberId === this.$store.state.userId)
            this.userTypeInTeam = this.memberInfo[i].memberType;
        }
        if (this.userTypeInTeam == 0) {
          for (let i = 0; i < this.memberInfo.length; i++) {
            if (this.memberInfo[i].memberType == 1) {
              this.memberInfo[i].buttonText = "取消管理员";
              this.memberInfo[i].buttonType = "warning";
            } else if (this.memberInfo[i].memberType == 2) {
              this.memberInfo[i].buttonText = "设为管理员";
              this.memberInfo[i].buttonType = "primary";
            }
          }
        }
      } else {
        this.$message.error({
          message: "无法获取团队成员",
        });
      }
    });
  },
};
</script>

<style scoped>
.teamMember {
  margin: auto auto;
}

span {
  margin-left: 10px;
  vertical-align: middle;
}
</style>
