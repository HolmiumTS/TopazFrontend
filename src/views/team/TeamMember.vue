<!--
TODO:
<button>
- 审核申请
- 设为管理员
- 取消管理员
- 踢出团队
-->

<template>
  <el-container>
    <el-header>
      <el-page-header @back="goBack" content="团队成员"></el-page-header>
    </el-header>
    <el-main class="teamMember">
      <el-table height="600" :data="memberInfo" stripe style="width: 100%">
        <el-table-column label="昵称" width="400">
          <template slot-scope="scope">
            <el-link :underline="false" :href="scope.row.memberUrl">
              <el-avatar :src="scope.row.memberAvatar" :alt="scope.row.memberUsername"></el-avatar>
              <span>{{scope.row.memberUsername}}</span>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="权限" width="300">
          <template slot-scope="scope">
            <div v-if="scope.row.memberType==0">创建者</div>
            <div v-else-if="scope.row.memberType==1">管理员</div>
            <div v-else>普通成员</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" plain v-if="userTypeInTeam==0&&scope.row.memberType==2">设为管理员</el-button>

            <el-button type="warning" plain v-if="userTypeInTeam==0&&scope.row.memberType==1">取消管理员</el-button>

            <el-button
              type="success"
              plain
              round
              v-if="scope.row.memberType<=1&&userId==scope.row.memberId"
            >审核申请</el-button>

            <el-button type="danger" plain v-if="userTypeInTeam<scope.row.memberType">踢出团队</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { GetTeamMember, generateUserUrl, GetUserInfo } from "../../main";
export default {
  data() {
    return {
      aboutTeam: {
        teamName: "Topaz Team", // for test
        teamId: "123",
        creatorId: "19260817",
        teamInfo: "955团队",
      },
      userId: "1",
      userTypeInTeam: 0, //  0 创建者，1 管理员，2 成员，3 团队外用户
      memberInfo: [
        {
          memberId: "1",
          memberUrl: "https://www.google.com",
          memberUsername: "谷歌",
          memberType: 0,
          memberAvatar: "https://i.loli.net/2020/08/11/qSLd3msVgwRlZaj.png",
        },
        {
          memberId: "2",
          memberUrl: "https://www.bing.com",
          memberUsername: "必应",
          memberType: 1,
          memberAvatar: "https://i.loli.net/2020/08/11/RgaFXCAEDI62mfP.png",
        },
        {
          memberId: "3",
          memberUrl: "https://www.duckduckgo.com",
          memberUsername: "鸭鸭走",
          memberType: 1,
          memberAvatar: "https://i.loli.net/2020/08/11/UnM3fR6DxVG4ATo.png",
        },
        {
          memberId: "5",
          memberUrl: "https://www.sogou.com",
          memberUsername: "搜狗",
          memberType: 2,
          memberAvatar: "https://i.loli.net/2020/08/11/wTIekN52t1xEqQc.png",
        },
        {
          memberId: "4",
          memberUrl: "https://www.baidu.com",
          memberUsername: "百度",
          memberType: 2,
          memberAvatar: "https://i.loli.net/2020/08/11/sqywvkrAh9JY5od.png",
        },
      ], // memberType: 0 创建者，1 管理员，2 成员
    };
  },
  methods: {
    goBack() {
      // 返回到 '我的团队'
      this.$router.push("/home");
    },
  },
  mounted() {
    this.userId = this.$route.query.userId;
    this.teamId = this.$route.query.teamId;
    this.userTypeInTeam = "3";
    let params = {
      teamId: this.teamId,
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

        var tmpObj = { tmpId: "", tmpType: 0 };
        for (tmpObj in idArray) {
          if (tmpObj.tmpId == this.userId) this.userTypeInTeam = tmpObj.tmpType;

          tmpMemberInfo.memberId = tmpObj.tmpId;
          tmpMemberInfo.memberUrl = generateUserUrl(tmpObj.tmpId);
          tmpMemberInfo.memberType = tmpObj.tmpType;
          GetUserInfo(tmpObj.tmpId).then((res2) => {
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