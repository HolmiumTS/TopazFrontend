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
      <el-col :span="4" :offset="12">
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
      <el-col :span="3">
        <el-button
          style="margin: 10px 60%"
          type="info"
          size="small"
          @click.native.prevent="dis2=true"
        >创建文档和管理模板</el-button>
      </el-col>
      <el-col :span="1">
        <el-badge :value="UnreadMessages" style="margin: 18px 125%;" :hidden="UnreadMessages<1">
          <el-popover
            placement="bottom-start"
            trigger="click"
            width="400"
            style="top:60px;positon:fixed;"
          >
            <el-link :underline="false" @click="changeMessageStatus">全部标记为已读</el-link>
            <el-tabs>
              <el-tab-pane label="全部通知" style="overflow:auto;max-height:400px">
                <div v-for="message in messages" :key="message.id">
                  <el-card shadow="hover" style="margin:0px 0px 5px 0px;height:80px">
                    <p style="font-size:100%;margin:-1% 0px;">{{message.content}}</p>
                    <p style="color:#C0C0C0">{{message.time}}</p>
                  </el-card>
                </div>
              </el-tab-pane>
              <el-tab-pane label="未读" style="overflow:auto;max-height:400px">
                <div v-for="message in unReadMessages" :key="message.id">
                  <el-card shadow="hover" style="margin:0px 0px 5px 0px;height:80px">
                    <p style="font-size:100%;margin:-1% 0px;">{{message.content}}</p>
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
    <el-dialog
      :modal="false"
      style="width: 600px;margin :auto auto;"
      :visible.sync="dis0"
      title="模板重命名"
    >
      <el-form
        :model="renameTemplateForm"
        ref="renameTemplateForm"
        :rules="rule0"
        label-width="0px"
      >
        <el-form-item prop="name" align="left">
          <el-input type="text" v-model="renameTemplateForm.name" placeholder="新模板名"></el-input>
        </el-form-item>
      </el-form>
      <div align="right">
        <el-button type="primary" @click.native.prevent="renameTemplate()" size="medium">确认</el-button>
      </div>
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
    <el-dialog :modal="false" style="width: 1000px;margin :auto auto;" :visible.sync="dis2">
      <el-tabs>
        <el-tab-pane :label="newFileDialogTitle">
          <el-form :model="newFileForm" ref="newFileForm" :rules="rule" label-width="0px">
            <el-form-item prop="name" align="left">
              <span style="margin:0px 20px;">文件名:</span>
              <el-input
                type="text"
                v-model="newFileForm.name"
                placeholder="文件名"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-form-item prop="templateId" align="left">
              <span style="margin:0px 27px;">模板:</span>
              <el-select style="width: 300px" v-model="newFileForm.templateId" placeholder="选择模板">
                <el-option
                  v-for="template in templates"
                  :key="template.id"
                  :label="template.name"
                  :value="template.id"
                >
                  <span style="float: left">{{ template.name }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 10px"
                  >{{ template.id!='-1'?template.id:"" }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div align="right">
            <el-button type="primary" @click.native.prevent="newFile" size="medium">确认创建</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="管理模板">
          <el-table :data="templatesData" :default-sort="{prop: 'id', order: 'ascending'}">
            <el-table-column min-width="30%" label="模板编号" prop="id" sortable></el-table-column>
            <el-table-column min-width="35%" label="模板名" prop="name" sortable></el-table-column>
            <el-table-column min-width="35%" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click.native.prevent="showRenameTemplateDialog(scope.row.id,scope.row.name)"
                >重命名</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click.native.prevent="deleteTemplate(scope.row.id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import { SearchTeams } from "../main";
import { ApplyToTeam } from "../main";
import { NewFile } from "../main";
import { GetUserMessage } from "../main";
import { ChangeMessageStatus } from "../main";
import { GetUserTemplate } from "../main";
import { DeleteTemplate } from "../main";
import { RenameTemplate } from "../main";
export default {
  data() {
    return {
      dis0: false,
      dis1: false,
      dis2: false,
      sFile: "",
      sTeam: "",
      selectTemplateId: null,
      newFileForm: { name: null, templateId: "-1" },
      renameTemplateForm: { name: null },
      //templates: [],
      templates: [{ id: "-1", name: "无" }],
      /*teams: [
        { id: "001", name: "moyu", info: "955" },
        { id: "002", name: "baogan", info: "996" },
      ],*/
      teams: null,
      messages: [],
      /*messages: [
        {
          id: "001",
          content: "张三 退出了团队 Testaaaaaaaaaaaaaaa",
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
      ],*/
      unReadMessages: [],
      /*unReadMessages: [
        {
          id: "001",
          content: "李四 申请加入团队 ff",
          time: "8月13日 12:43",
          status: "0",
        },
      ],*/
      rule0: {
        name: [
          {
            required: true,
            message: "新模板名不能为空,最多16个字",
            max: 16,
            trigger: "blur",
          },
        ],
      },
      rule: {
        name: [
          {
            required: true,
            message: "文件名不能为空,最多16个字",
            max: 16,
            trigger: "blur",
          },
        ],
        templateId: [
          {
            required: true,
            message: "请选择模板",
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
    templatesData() {
      let temp = [];
      for (let i = 1; i < this.templates.length; i++) {
        temp[i - 1] = this.templates[i];
      }
      return temp;
    },
    avatar() {
      return this.$store.state.avatar;
      /*return (
        this.$store.state.avatar ||
        "http://qexiy12gt.hd-bkt.clouddn.com/%E9%BB%84%E7%8E%89.png"
      );*/
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
    showRenameTemplateDialog(id, name) {
      this.selectTemplateId = id;
      this.renameTemplateForm.name = name;
      this.dis0 = true;
    },
    renameTemplate() {
      this.$refs.renameTemplateForm.validate((valid) => {
        if (valid) {
          let params = {
            userId: this.$store.state.userId,
            templateId: this.selectTemplateId,
            name: this.renameTemplateForm.name,
          };
          RenameTemplate(params).then((res) => {
            if (res.data.result == true) {
              console.log(
                "renameTemplate_Succeed: " +
                  params.templateId +
                  " " +
                  params.name
              );
              this.$message({
                type: "success",
                message: "模板重命名成功",
              });
              this.dis0 = false;
              this.$router.go(0);
            } else {
              console.log(
                "renameTemplate_Failed: " +
                  params.templateId +
                  " " +
                  params.name
              );
              this.$message.error({
                message: "模板重命名失败",
              });
            }
          });
        }
      });
    },
    deleteTemplate(id) {
      DeleteTemplate({ userId: this.$store.state.userId, templateId: id }).then(
        (res) => {
          if (res.data.result == true) {
            console.log("deleteTemplate_Succeed: " + id);
            this.$message({
              type: "success",
              message: "模板删除成功",
            });
            this.$router.go(0);
          } else {
            console.log("deleteTemplate_Failed: " + id);
            this.$message.error({
              message: "模板删除失败",
            });
          }
        }
      );
    },
    newFile() {
      this.$refs.newFileForm.validate((valid) => {
        if (valid) {
          let params = {
            userId: this.$store.state.userId,
            teamId: "-1",
            name: this.newFileForm.name,
            templateId: this.newFileForm.templateId,
          };
          console.log("newFileForm");
          console.log(params);
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
      //暂时不做
    },
    applyToTeam(index) {
      ApplyToTeam({
        userId: this.$store.state.userId,
        teamId: this.teams[index].id,
      }).then((res) => {
        if (res.data.result == true) {
          this.$message({
            type: "success",
            message: "申请提交成功",
          });
          this.teams = [];
          this.dis1 = false;
        } else {
          this.$message.error("申请提交失败，请稍后再试");
        }
      });
    },
    changeMessageStatus() {
      let id = [];
      for (let message of this.unReadMessages) {
        id.push(message.id);
      }
      ChangeMessageStatus({ id: id }).then((res) => {
        if (res.data.result == true) {
          this.unReadMessages = [];
          console.log("changeMessageStatus_Succeed");
          console.log(id);
        } else {
          this.$message.error("无法标记消息为已读");
          console.log("changeMessageStatus_Failed");
          console.log(id);
        }
      });
    },
  },
  mounted() {
    /*console.log("messages");
    console.log(this.messages);
    for (let message of this.messages) {
      console.log("message");
      console.log(message);
      if (message.status == "0") {
        console.log("unRead!");
        console.log(message);
        this.unReadMessages.push(message);
      }
    }*/
    console.log("unReadMessages");
    console.log(this.unReadMessages);
    GetUserMessage({ id: this.$store.state.userId }).then((res) => {
      this.messages = res.data.messages;
      console.log("messages");
      console.log(this.messages);
      for (let message of this.messages) {
        if (message.status == "0") {
          this.unReadMessages.push(message);
        }
      }
      console.log("unReadMessages");
      console.log(this.unReadMessages);
    });
    GetUserTemplate({ id: this.$store.state.userId }).then((res) => {
      this.templates = res.data.templates;
      this.templates.unshift({ id: "-1", name: "无" });
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
.el-dialog {
  border-radius: 20px;
}
</style>