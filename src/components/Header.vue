<template>
  <div>
    <el-row class="header">
      <el-col :span="2" style="margin: 0px 0px">
        <img src="../assets/Topaz.png" alt />
        <!--<h3 style="margin: 12px auto">金刚石文档</h3>-->
      </el-col>
      <!--
      <el-col :span="4" :offset="9">
        <el-input
          style="margin: 10px auto;width:100%;"
          v-model="sFile"
          placeholder="输入文档id以搜索文档"
          clearable
          size="small"
        >
          <el-button slot="append" icon="el-icon-search" circle @click.native.prevent="searchFiles"></el-button>
        </el-input>
      </el-col>-->
      <el-col :span="4" :offset="13">
        <el-input
          style="margin: 10px 15%;width:100%;"
          v-model="sTeam"
          placeholder="输入团队id或团队名以搜索团队"
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
          @click.native.prevent="dis2=true"
        >创建文档</el-button>
      </el-col>
      <!-- todo:消息通知 -->
      <el-col :span="1">
        <el-badge :value="UnreadMessages" style="margin: 18px 85%;" :hidden="UnreadMessages<1">
          <el-popover
            placement="bottom-start"
            trigger="click"
            width="400"
            style="top:60px;positon:fixed;"
          >
            <el-link :underline="false" @click="changeMessageStatus">全部标记为已读</el-link>
            <el-tabs>
              <el-tab-pane label="全部通知" style="overflow:auto;height:400px">
                <div v-for="message in messages" :key="message.id">
                  <el-card shadow="hover" style="margin:0px 0px 5px 0px;height:80px">
                    <p style="font-size:130%;margin:-2% 0px;">{{message.content}}</p>
                    <p style="color:#C0C0C0">{{message.time}}</p>
                  </el-card>
                </div>
              </el-tab-pane>
              <el-tab-pane label="未读">
                <div v-for="message in unReadMessages" :key="message.id">
                  <el-card shadow="hover" style="margin:0px 0px 5px 0px;height:80px">
                    <p style="font-size:130%;margin:-2% 0px;">{{message.content}}</p>
                    <p style="color:#C0C0C0">{{message.time}}</p>
                  </el-card>
                </div>
              </el-tab-pane>
            </el-tabs>
            <i slot="reference" class="el-icon-bell" style="width: 30px;height:30px"></i>
          </el-popover>
        </el-badge>
      </el-col>
      <el-col :span="1">
        <el-dropdown style="margin: -4px 100%">
          <div class="el-dropdown-link">
            <p>
              <el-avatar :src="avatar" :size="30" fit="fill" v-bind:username="username">{{username}}</el-avatar>
            </p>
          </div>
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
    <el-dialog
      :visible.sync="dis1"
      title="团队搜索结果"
      :modal="false"
      style="width:1600px;margin: auto auto"
    >
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
    <el-dialog
      :modal="false"
      style="width: 600px;margin :auto auto;"
      :visible.sync="dis2"
      :title="newFileDialogTitle"
    >
      <el-form :model="newFileForm" ref="newFileForm" :rules="rule" label-width="0px">
        <el-form-item prop="name">
          <el-input type="text" v-model="newFileForm.name" placeholder="文件名"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native.prevent="newFile" size="small">确认创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { SearchTeams } from "../main";
import { ApplyToTeam } from "../main";
import { NewFile } from "../main";
import { GetUserMessage } from "../main";
import { ChangeMessageStatus } from "../main";
import { Message } from "element-ui";
export default {
  data() {
    return {
      dis0: false,
      dis1: false,
      dis2: false,
      sFile: "",
      sTeam: "",
      newFileForm: {},
      /*teams: [
        { id: "001", name: "moyu", info: "955" },
        { id: "002", name: "baogan", info: "996" },
      ],*/
      teams: null,
      messages: [
        {
          id: "001",
          content: "张三 退出了团队 Test",
          time: "8月14日 11:43",
          status: "1",
        },
        {
          id: "002",
          content: "李四 申请加入团队 ff",
          time: "8月13日 12:43",
          status: "0",
        },
        {
          id: "003",
          content: "加入团队 Teee 的申请已被 接受",
          time: "8月13日 12:43",
          status: "0",
        },
        {
          id: "004",
          content: "李四 申请加入团队 ff",
          time: "8月13日 12:43",
          status: "0",
        },
        {
          id: "005",
          content: "李四 申请加入团队 ff",
          time: "8月13日 12:43",
          status: "0",
        },
        {
          id: "006",
          content: "李四 申请加入团队 ff",
          time: "8月13日 12:43",
          status: "0",
        },
        {
          id: "007",
          content: "李四 申请加入团队 ff",
          time: "8月13日 12:43",
          status: "0",
        },
      ],
      //messages: [],
      //unReadMessages: [],
      unReadMessages: [
        {
          id: "001",
          content: "李四 申请加入团队 ff",
          time: "8月13日 12:43",
          status: "0",
        },
      ],
      rule: {
        name: [
          {
            required: true,
            message: "文件名不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    username() {
      return this.$store.state.username;
    },
    avatar() {
      return (
        this.$store.state.avatar ||
        "https://ftp.bmp.ovh/imgs/2020/08/182a2651f9696ab4.png"
      );
      //return "https://ftp.bmp.ovh/imgs/2020/08/182a2651f9696ab4.png";
      //return "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
    },
    UnreadMessages() {
      /*let cnt = 0;
      for (let message of this.messages) {
        if (message.status == "0") cnt++;
      }
      return cnt;*/
      return this.unReadMessages.length;
    },
    newFileDialogTitle() {
      if (this.$store.state.status == "1") {
        return "创建团队文档";
      } else return "创建个人文档";
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
      this.$refs.newFileForm.validate((valid) => {
        if (valid) {
          let params = {
            userId: this.$store.state.userId,
            teamId: "-1",
            name: this.newFileForm.name,
          };
          if (this.$store.state.status == "1") {
            params.teamId = this.$store.state.teamId;
          }
          NewFile(params).then((res) => {
            if (res.data.result == true) {
              this.$message({
                type: "success",
                message: "创建成功",
              });
              this.dis2 = false;
              this.$router.go(0);
            } else {
              this.$message.error({
                message: "创建失败,请稍后再试",
              });
            }
          });
        }
      });
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
    changeMessageStatus() {
      let id = [];
      for (let message in this.unReadMessages) {
        id.push(message.id);
      }
      ChangeMessageStatus({ id: id }).then((res) => {
        if (res.data.result == true) {
          this.unReadMessages = [];
          console.log(changeMessageStatus_Succeed);
        } else {
          this.$message.error("无法标记消息为已读");
          console.log(changeMessageStatus_Failed);
        }
      });
    },
  },
  mounted() {
    GetUserMessage({ id: this.$store.state.userId }).then((res) => {
      this.messages = res.data.messages;
      for (let message in this.messages) {
        if (message.status == "0") {
          this.unReadMessages.push(message);
        }
      }
    });
  },
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