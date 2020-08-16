<template>
  <el-main>
    <!--Title-->
    <el-row>
      <el-col :span="8" :offset="8">
        <div class="title">{{doc.docName}}</div>
      </el-col>
    </el-row>
    <p></p>

    <el-row>
      <el-col :span="8" :offset="8">
        <el-button v-if="auth.edit===true" type="success" icon="el-icon-edit-outline" circle plain
                   @click="toEdit"></el-button><!--edit-->
        <el-button type="warning" icon="el-icon-share" circle plain></el-button><!--share todo-->
        <el-button v-if="auth.admin===true" type="info" icon="el-icon-setting" circle plain
                   @click="show"></el-button>
        <!--authority todo-->
      </el-col>
    </el-row>

    <!--Settings of auth-->
    <el-row v-if="showSettings">

      <el-col :span="8" :offset="8">
        编辑权限：
        <el-radio-group v-model="setting.edit" @change="updateSettings">
          <el-radio label="0">仅创建者</el-radio>
          <el-radio label="1">仅团队内</el-radio>
          <el-radio label="2">所有人</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="8" :offset="8">
        查看、分享、评论权限：
        <el-radio-group v-model="setting.view">
          <el-radio v-if="setting.ctl1" label="0">仅团队内</el-radio>
          <el-radio v-if="setting.ctl2" label="1">所有人</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <!--Info-->
    <el-row>
      <!--todo 优化显示-->
      <el-col :span="4" :offset="4">
        <div class="info info-left">创建者：{{doc.ownerName}}</div>
      </el-col>
      <el-col :span="4">
        <div class="info info-left">创建时间：{{doc.createTime}}</div>
      </el-col>
      <el-col :span="4">
        <div class="info info-right">上次修改时间：{{doc.updateTime}}</div>
      </el-col>
      <el-col :span="4" :offset="0">
        <div class="info info-right">历史修改次数：{{doc.count}}</div>
      </el-col>
    </el-row>
    <!--Content-->
    <el-row>
      <el-col :span="12" :offset="6">
        <mavon-editor
          :value="doc.content"
          :subfield="false"
          defaultOpen="preview"
          :toolbarsFlag="false"
          :editable="false"
          :scrollStyle="true"
          :ishljs="true"
          previewBackground="#eeeeff"
        ></mavon-editor>
      </el-col>
    </el-row>
    <!--Comment-->
    <p v-for="(c) in comment" v-bind:key="c">
      <el-row>
        <el-col :span="1" :offset="6" class="comment-info">
          <el-avatar
            :src="c.avatar"
            :size="30"
            fit="fill"
          >
            {{c.name}}
            <!--todo-->
          </el-avatar>
        </el-col>
        <el-col :span="6" class="comment-info">
          <el-row>
            <div class="comment-name">{{c.name}}</div>
          </el-row>
          <el-row>
            <div class="comment-name">{{c.time}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="6">
          <div>
            <mavon-editor
              style="min-height: 30px"
              :value="c.content"
              :subfield="false"
              defaultOpen="preview"
              :toolbarsFlag="false"
              :editable="false"
              :scrollStyle="true"
              :ishljs="true"
              previewBackground="#eeffff"
            ></mavon-editor>
          </div>
        </el-col>
      </el-row>
    </p>
    <!--Add Comment-->
    <el-row>
      <el-col :span="1" :offset="6" class="comment-info">
        <el-avatar
          :src="'https://ftp.bmp.ovh/imgs/2020/08/182a2651f9696ab4.png'"
          :size="30"
          fit="fill"
        >
          我
          <!--todo 显示用户名-->
        </el-avatar>
      </el-col>
      <el-col :span="2" class="comment-info">
        <el-row>
          <div class="comment-name">
            ddd
            <!--todo 显示用户名-->
          </div>
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
            style="min-height: 200px"
            :subfield="false"
            defaultOpen="edit"
            :toolbarsFlag="true"
            :editable="true"
            :scrollStyle="true"
            :ishljs="true"
            placeholder="说两句呗"
            previewBackground="#eeffff"
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
  import {CommitComment, GetAuth, GetComment, GetFile, GetUserInfo} from "../main";
  import {genToken} from "../genToken";
  import random from "string-random";
  import axios from "axios";

  export default {
    data() {
      return {
        doc: {
          ownerName: "fff",
          content: "# Test\n\\\\(>_<)/",
          count: "2",
          createTime: "2020-08-11 23:59",
          updateTime: "2020-08-11 23:59",
          docName: "Wow~",
        },
        auth: {
          view: false,
          admin: true,
          edit: false,
          lock: false
        },
        comment: [{
          time: "2020-08-14 11:45",
          name: "www",
          content: "123",
          avatar: "https://ftp.bmp.ovh/imgs/2020/08/182a2651f9696ab4.png"
        },
          {
            time: "2020-08-14 11:45",
            name: "ss",
            content: "ff",
            avatar: "https://ftp.bmp.ovh/imgs/2020/08/182a2651f9696ab4.png"
          }],
        newComment: "",
        showSettings: true,
        setting: {
          edit: 0,
          view: 0,
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
          preview: true // 预览
        },
      };
    },
    methods: {
      toEdit() {
        this.$router.push({path: '/docEdit', query: {docId: this.$route.query.docId}})
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
        let $vm = this.$refs.editor

        let form = new FormData()
        form.append("file", file)
        form.append("token", token)
        form.append("key", random(16))
        axios.post(
          this.actionPath,
          form
        ).then((res) => {
          $vm.$img2Url(pos, this.photoUrl + res.data.key)
        })
      },

      change(value, render) {
        this.newComment = value
      },

      commitComment() {
        console.log("[commitComment]")
        console.log("this.newComment:" + this.newComment)
        CommitComment({
          id: this.$store.userId,
          did: this.$route.query.docId,
          content: this.newComment,
        })
      },

      show() {
        console.log("[show]")
        this.showSettings = !this.showSettings
        console.log(this.showSettings)
      },

      updateSettings(value) {
        this.setting.ctl1 = value !== "2";
      },
    },
    mounted() {
      GetAuth({
        id: this.$store.userId.toString(),
        did: this.$route.query.docId.toString()
      }).then((res) => {
        if (res.data.result === false || res.data.view === false) {
          this.$message.error("文档不存在或无权查看")
          return
        }
        this.auth.admin = res.data.admin
        this.auth.edit = res.data.edit
        if (res.data.lock === true) {
          this.$message.warning("此文件正在被他人编辑中，您看到的可能并不是最新内容")
        }
        GetComment({id: this.$route.query.docId.toString()}).then((res) => {
          this.comment = res.comment
        })
        GetFile({id: this.$route.query.docId.toString()}).then((res) => {
          let d = res.data
          if (d.result === false) {
            this.$message.error("请求文档失败！请稍后再试！")
            return
          }
          GetUserInfo({id: d.owner.toString()}).then((res) => {
            this.doc.ownerName = res.data.username
          })
          this.doc.createTime = d.createTime
          this.doc.updateTime = d.updateTime
          this.doc.content = d.content
          this.doc.docName = d.docName
        })
      })

    },
  };
</script>
<style>
  .title {
    /*margin: 1% auto;*/
    padding: 5px 5px 5px 5px;
    border-radius: 10px;
    font-size: xx-large;
    font-weight: bold;
    /*box-shadow: 0 0 8px #eeeeee;*/
    background-color: #eeeeee;
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
