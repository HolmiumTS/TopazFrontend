<template>
  <el-main>
    <!--Title-->
    <el-row>
      <el-col :span="7" :offset="6">
        <div class="tt">{{doc.docName}}</div>
      </el-col>
      <el-col :span="8" :offset="0">
        <el-button
          v-if="auth.edit===true"
          type="success"
          icon="el-icon-edit-outline"
          circle
          plain
          @click="toEdit"
        ></el-button>
        <!--edit-->
        <el-button type="warning" icon="el-icon-share" circle plain @click="share"></el-button>
        <!--share todo-->
        <el-button
          v-if="auth.admin===true"
          type="info"
          icon="el-icon-setting"
          circle
          plain
          @click="show"
        ></el-button>
      </el-col>
    </el-row>
    <p></p>
    <!--Settings of auth-->
    <!-- 改不动 -->
    <div v-if="showSettings">
      <el-row style="width: 70%;margin: auto auto;">
        <el-col :span="9" :offset="3">
          编辑权限：
          <el-radio-group v-model="setting.edit" @change="updateSettings">
            <el-radio label="0">仅创建者</el-radio>
            <el-radio label="1">仅团队内</el-radio>
            <el-radio label="2">所有人</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="9" :offset="0">
          查看、分享、评论权限：
          <el-radio-group v-model="setting.view">
            <el-radio :disabled="this.setting.edit==='2'" label="0">仅团队内</el-radio>
            <el-radio label="1">所有人</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <p></p>
      <el-row>
        <el-col :span="13" :offset="6" class="info-right">
          <el-button
            type="success"
            circle
            plain
            icon="el-icon-check"
            :disabled="this.setting.edit===''||this.setting.view===''"
            @click="commitAuth"
          ></el-button>
        </el-col>
      </el-row>
    </div>
    <!--Info-->
    <el-row style="width: 75%;margin: auto auto">
      <!--todo 优化显示-->
      <el-col :span="3" :offset="4">
        <div class="info info-left">创建者：{{doc.ownerName}}</div>
      </el-col>
      <el-col :span="5">
        <div class="info info-left">创建时间：{{doc.createTime}}</div>
      </el-col>
      <el-col :span="5">
        <div class="info info-right">上次修改时间：{{doc.updateTime}}</div>
      </el-col>
      <el-col :span="3" :offset="0">
        <div class="info info-right">历史修改次数：{{doc.count}}</div>
      </el-col>
    </el-row>
    <!--Content-->
    <div style="width: 50%;margin: auto auto">
      <el-divider></el-divider>
    </div>
    <el-row v-if="this.showContent===true">
      <el-col :span="12" :offset="6">
        <mavon-editor
          :value="doc.content"
          :subfield="false"
          defaultOpen="preview"
          :toolbarsFlag="false"
          :editable="false"
          :scrollStyle="true"
          :ishljs="true"
          previewBackground="#e9ece5"
          style="min-height: 800px;"
        ></mavon-editor>
        <!-- #eeeeff -->
      </el-col>
    </el-row>
    <!--Comment-->
    <p style="width: 50%;margin: auto auto;">
      <el-divider></el-divider>
    </p>
    <p v-for="(c) in comment" v-bind:key="c">
      <el-row>
        <el-col :span="1" :offset="6" class="comment-info">
          <el-avatar :src="c.avatar" :size="30" fit="fill">{{c.name}}</el-avatar>
        </el-col>
        <el-col :span="6" class="comment-info">
          <el-row>
            <div class="comment-name">{{c.name}}</div>
          </el-row>
          <el-row>
            <div class="comment-name" style="font-size: 60%;color:#888888;">{{c.time}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="6">
          <div>
            <mavon-editor
              style="min-height: 30px;box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.1)"
              :value="c.content"
              :subfield="false"
              defaultOpen="preview"
              :toolbarsFlag="false"
              :editable="false"
              :scrollStyle="true"
              :ishljs="true"
              previewBackground="#F5F5F5"
            ></mavon-editor>
            <!-- style="background:#F5F5F5;" -->
            <!-- #eeffff -->
          </div>
        </el-col>
      </el-row>
    </p>
    <!--Add Comment-->
    <el-row>
      <el-col :span="1" :offset="6" class="comment-info">
        <el-avatar
          :src="this.$store.state.avatar"
          :size="30"
          fit="fill"
        >{{this.$store.state.username}}
        </el-avatar>
      </el-col>
      <el-col :span="2" class="comment-info">
        <el-row>
          <div class="comment-name">{{this.$store.state.username}}</div>
        </el-row>
        <el-row>
          <div class="comment-name">
            <!--空着-->
          </div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" :offset="6">
        <div>
          <mavon-editor
            ref="editor"
            :toolbars="toolbars"
            style="min-height: 200px;border-width:1px;border-color:#E6E6E6;border-style: solid;box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);"
            :subfield="false"
            defaultOpen="edit"
            :toolbarsFlag="true"
            :editable="true"
            :scrollStyle="true"
            :ishljs="true"
            placeholder="说两句呗"
            previewBackground="#ffffff"
            @imgAdd="imgAdd"
            @change="change"
          ></mavon-editor>
        </div>
      </el-col>
    </el-row>
    <p></p>
    <el-row>
      <el-col :span="14" :offset="6" class="info-right">
        <el-button type="success" plain @click="commitComment">发表评论</el-button>
      </el-col>
    </el-row>
  </el-main>
</template>
<script>
  import {
    AuthorizeFile,
    CommitComment,
    GetAuth,
    GetComment,
    GetFile,
    GetUserInfo,
  } from "../main";
  import {genToken} from "../genToken";
  import random from "string-random";
  import axios from "axios";

  export default {
    data() {
      return {
        doc: {
          ownerName: "",
          content: "",
          count: "",
          createTime: "",
          updateTime: "",
          docName: "",
        },
        auth: {
          view: false,
          admin: false,
          edit: false,
          lock: false,
        },
        showContent: false,
        comment: [
          // {
          //   time: "2020-08-14 11:45",
          //   name: "www",
          //   content: "123",
          //   avatar: "https://ftp.bmp.ovh/imgs/2020/08/182a2651f9696ab4.png",
          // },
          // {
          //   time: "2020-08-14 11:45",
          //   name: "ss",
          //   content: "ff",
          //   avatar: "https://ftp.bmp.ovh/imgs/2020/08/182a2651f9696ab4.png",
          // },
        ],
        newComment: "",
        showSettings: false,
        setting: {
          edit: "",
          view: "",
          ctl1: true,
          ctl2: true,
        },
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: false, // 展示html源码
          help: false, // 帮助
          undo: true, // 上一步
          redo: true, // 下一步
          trash: false, // 清空
          save: false, // 保存（触发events中的save事件）
          navigation: true, // 导航目录
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          subfield: false, // 单双栏模式
          preview: true, // 预览
        },
      };
    },
    methods: {
      disableSubmit() {
        return this.setting.edit === "" || this.setting.view === "";
      },

      share() {
        this.$alert(
          "http://60.205.189.66/docBrowse?docId=" + this.$route.query.docId,
          "复制下面的链接来分享吧"
        );
      },

      toEdit() {
        this.$router.push({
          path: "/docEdit",
          query: {docId: this.$route.query.docId},
        });
      },

      beforeUpload(file) {
        const checkFileType =
          file.type === "image/jpeg" ||
          file.type === "image/jpg" ||
          file.type === "image/png";
        const checkFileSize = file.size / 1024 / 1024 < 5;
        if (!checkFileType) {
          this.$message.error("上传图片必须是 jpeg/jpg/png 格式！");
        }
        if (!checkFileSize) {
          this.$message.error("上传图片大小不能超过 5MB！");
        }
        return checkFileType && checkFileSize;
      },

      imgAdd(pos, file) {
        if (!this.beforeUpload(file)) {
          return;
        }
        let token;
        const policy = {};
        const bucketName = "domaint";
        const AK = "K96MCAU7eCnSWz4XUbxIBe9Q9PUm_gBHfacmsAEf";
        const SK = "g0eagx-yjztmAo0iVi-Nj8QrsCRGrKhdGKIjpVr9";
        const deadline = 1599840000; // 2020-09-12
        policy.scope = bucketName;
        policy.deadline = deadline;
        token = genToken(AK, SK, policy);
        let $vm = this.$refs.editor;

        let form = new FormData();
        form.append("file", file);
        form.append("token", token);
        form.append("key", random(16));
        axios.post(this.actionPath, form).then((res) => {
          $vm.$img2Url(pos, this.photoUrl + res.data.key);
        });
      },

      change(value, render) {
        this.newComment = value;
      },

      commitAuth() {
        AuthorizeFile({
          id: this.$route.query.docId,
          edit: this.setting.edit,
          view: this.setting.view,
        });
        // this.$message("修改成功！")
        this.$router.go(0);
      },

      commitComment() {
        console.log("[commitComment]");
        console.log("this.newComment:" + this.newComment);
        CommitComment({
          id: this.$store.userId,
          did: this.$route.query.docId,
          content: this.newComment,
        });
        this.$router.go(0);
      },

      show() {
        console.log("[show]");
        this.showSettings = !this.showSettings;
        console.log(this.showSettings);
      },

      updateSettings(value) {
        if (value === "2") {
          this.setting.view = "1";
        }
      },
    },
    mounted() {
      GetAuth({
        id: this.$store.state.userId.toString(),
        did: this.$route.query.docId.toString(),
      }).then((res) => {
        if (res.data.result === false || res.data.view === false) {
          this.$message.error("文档不存在或无权查看");
          return;
        }
        this.auth.admin = res.data.admin;
        this.auth.edit = res.data.edit;
        if (res.data.lock === true) {
          this.$message.warning(
            "此文件正在被他人编辑中，您看到的可能并不是最新内容"
          );
        }
        GetComment({did: this.$route.query.docId.toString()}).then((res) => {
          this.comment = res.comment;
        });
        GetFile({id: this.$route.query.docId.toString()}).then((res) => {
          let d = res.data;
          if (d.result === false) {
            this.$message.error("请求文档失败！请稍后再试！");
            return;
          }
          GetUserInfo({id: d.owner.toString()}).then((res) => {
            this.doc.ownerName = res.data.username;
          });
          this.doc.createTime = d.createTime;
          this.doc.updateTime = d.updateTime;
          this.doc.content = d.content;
          this.doc.docName = d.name;
          this.doc.count = d.count;
          console.log(this.doc)
          this.showContent = true
        });
      });
    },
  };
</script>
<style>
  .tt {
    /*margin: 1% auto;*/
    padding: 5px 5px 5px 5px;
    border-radius: 10px;
    font-size: xx-large;
    font-weight: bold;
    box-shadow: 0 0 8px #bfbfbf;
    background-color: #e9ece5;
  }

  .info {
    /*padding: 5px 5px 5px 5px;*/
    border-radius: 10px;
    margin: 10px auto;
    /*background-color: #ffffff;*/
  }

  .info-left {
    float: left;
  }

  .info-right {
    float: right;
  }

  .comment-info {
    min-height: 50px;
  }

  .comment-name {
    float: left;
  }
</style>
