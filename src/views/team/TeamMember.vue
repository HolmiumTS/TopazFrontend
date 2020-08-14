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
        stripe
        style="width: 100%"
        :default-sort="{prop: 'memberType', order: 'ascending'}"
      >
        <el-table-column label="用户" width="400">
          <template slot-scope="scope">
            <el-link :underline="false" :href="scope.row.memberUrl">
              <el-avatar :src="getAvatar(scope.row.memberAvatar)" :alt="scope.row.memberUsername"></el-avatar>
              <span>{{scope.row.memberUsername}}</span>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="权限" width="300">
          <template slot-scope="scope">
            <div v-if="scope.row.memberType==0">创建者</div>
            <div v-else-if="scope.row.memberType==1">管理员</div>
            <div v-else-if="scope.row.memberType==2">普通成员</div>
            <div v-else>ERROR</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              v-if="userTypeInTeam==0&&scope.row.memberType==2"
              @click.native.prevent="setAdmin(scope.row.memberId)"
            >设为管理员</el-button>

            <el-button
              type="warning"
              plain
              v-if="userTypeInTeam==0&&scope.row.memberType==1"
              @click.native.prevent="cancelAdmin(scope.row.memberId)"
            >取消管理员</el-button>

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
              @click.native.prevent="confirmKickOff(scope.row.memberId, scope.row.memberUsername)"
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
  GetUserInfo,
  SetAdmin,
  CancelAdmin,
  GetAllApplication,
  JudgeApplication,
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
        if (res.data.result == true) {
          this.applicationInfo.splice(0, this.applicationInfo.length);
          for (var tmp in res.data.application) {
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
      // console.log(index);
      JudgeApplication(params).them((res) => {
        if (res.data.result == true) {
          this.$message({
            type: "success",
            message: "审核成功",
          });
          this.applicationInfo.splice(index, 1);
        } else {
          this.$message.error({
            message: "审核失败，请稍后再试",
          });
        }
      });
    },

    setAdmin(id) {
      console.log(id + " is set as Admin.");
      let params = {
        teamId: this.aboutTeam.teamId,
        id: id,
      };
      SetAdmin(params).then((res) => {
        if (res.data.result == true) {
          this.$message({
            type: "success",
            message: "管理员设置成功",
          });
        } else {
          this.$message.error({
            message: "管理员设置失败，请稍后再试",
          });
        }
      });
    },

    cancelAdmin(id) {
      console.log(id + " is cancelled.");
      let params = {
        teamId: this.aboutTeam.teamId,
        id: id,
      };
      CancelAdmin(params).then((res) => {
        if (res.data.result == true) {
          this.$message({
            type: "success",
            message: "管理员取消成功",
          });
        } else {
          this.$message.error({
            message: "管理员取消失败，请稍后再试",
          });
        }
      });
    },

    confirmKickOff(id, username) {
      this.$confirm("确定要将" + username + "踢出团队吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.kickOff(id);
        })
        .catch(() => {});
    },

    kickOff(id) {
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
      var tmpMemberInfo = {
        memberId: "",
        memberUrl: "",
        memberUsername: "",
        memberType: 0,
        memberAvatar: "",
      };
      if (res.data.result == true) {
        var idArray = [{ id: res.data.creatorId, type: 0 }];
        for (var tmpId in res.data.adminId) {
          idArray.push({ id: tmpId, type: 1 });
        }
        for (var tmpId in res.data.memberId) {
          idArray.push({ id: tmpId, type: 2 });
        }

        var tmpObj = { id: "", type: 0 };
        console.log("idArray = " + idArray[0].id);
        var length = idArray.length;
        for (var i = 0; i < length; i++) {
          tmpObj = idArray[i];
          if (tmpObj.id == this.userId) this.userTypeInTeam = tmpObj.type;
          console.log("tmpObj.type = " + tmpObj.id);
          console.log("this.userTypeInTeam = " + this.userTypeInTeam);
          tmpMemberInfo.memberId = tmpObj.id;
          tmpMemberInfo.memberUrl = generateUserUrl(tmpObj.id);
          tmpMemberInfo.memberType = tmpObj.type;
          GetUserInfo({ id: tmpObj.id }).then((res2) => {
            tmpMemberInfo.memberUsername = res2.data.username;
            tmpMemberInfo.memberAvatar = res2.data.avatar;
          });
          this.memberInfo.push(tmpMemberInfo);
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
  /* background: #fff;
  box-shadow: 0 0 8px #b4bccc;
  padding: 20px 30px 30px 30px;
  border-radius: 10px; */
}

span {
  margin-left: 10px;
  vertical-align: middle;
}
</style>
