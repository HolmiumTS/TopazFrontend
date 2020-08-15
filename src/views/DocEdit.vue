<template>
  <el-main>
    <el-row>
      <el-col :span="12" :offset="6">
        <div class="title">
          {{doc.docName}}
        </div>
      </el-col>
      <el-col :span="3" :offset="0">
        <el-button type="success" icon="el-icon-edit-outline" circle plain></el-button>
        <el-button type="warning" icon="el-icon-share" circle plain></el-button>
        <el-button type="info" icon="el-icon-setting" circle plain></el-button>

      </el-col>
    </el-row>
    <p></p>
    <el-row>
      <el-col :span="18" :offset="3">
        <mavon-editor
          ref="editor"
          :value="doc.content"
          :toolbars="toolbars"
          placeholder="oooooooo"
          defaultOpen="preview"
          :editable="true"
          toolbarsBackground="#66ccff"
          :subfield="true"
          @imgAdd="imgAdd"
          :ishljs="true"
          :scrollStyle="true"
        ></mavon-editor>
      </el-col>
    </el-row>

  </el-main>
</template>

<script>
  import {genToken} from "../genToken";
  import random from "string-random";
  import axios from 'axios';

  export default {
    data() {
      return {
        actionPath: "https://upload.qiniup.com", // 华东
        photoUrl: "http://qexiy12gt.hd-bkt.clouddn.com/", //外链域名
        doc: {
          ownerName: "",
          content: "# Test\n\\\\(>_<)/",
          count: "",
          createTime: "",
          updateTime: "",
          docName: "Wow~",
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
          return
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

    },
    mounted() {
    },
  };
</script>
<style>
  .back {
    width: 100%;
    height: 50px;
    position: fixed;
  }
</style>
