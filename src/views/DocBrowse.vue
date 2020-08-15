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

  </el-main>
</template>
<script>
  import {GetFile, GetUserInfo} from "../main";

  export default {
    data() {
      return {
        doc: {
          ownerName: "",
          content: "# Test\n\\\\(>_<)/",
          count: "",
          createTime: "",
          updateTime: "",
          docName: "Wow~",
        },
        comment: [{time: "8/14 11:45", name: "www", content: "123"}],
      };
    },
    methods: {},
    mounted() {
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
</style>
