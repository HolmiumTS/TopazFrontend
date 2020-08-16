<template>
  <el-main>
    <!--Title-->
    <el-row>
      <el-col :span="8" :offset="8">
        <div class="title">
          {{doc.docName}}
        </div>
      </el-col>
    </el-row>
    <p></p>
    <el-row>
      <el-col :span="8" :offset="8">
        <el-button type="success" icon="el-icon-edit-outline" circle plain @click="toEdit"></el-button><!--edit-->
        <el-button type="warning" icon="el-icon-share" circle plain></el-button><!--share todo-->
        <el-button type="info" icon="el-icon-setting" circle plain></el-button><!--authority todo-->
      </el-col>
    </el-row>
    <!--Info-->
    <el-row>
      <el-col :span="4" :offset="4">
        <div class="info info-left">
          创建者：{{doc.ownerName}}
        </div>
      </el-col>
      <el-col :span="4">
        <div class="info info-left">
          创建时间：{{doc.createTime}}
        </div>
      </el-col>
      <el-col :span="4">
        <div class="info info-right">
          上次修改时间：{{doc.updateTime}}
        </div>
      </el-col>
      <el-col :span="4" :offset="0">
        <div class="info info-right">
          历史修改次数：{{doc.count}}
        </div>
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
            :src="'https://ftp.bmp.ovh/imgs/2020/08/182a2651f9696ab4.png'"
            :size="30"
            fit="fill"
          >{{c.name}}<!--todo-->
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
        >我<!--todo-->
        </el-avatar>
      </el-col>
      <el-col :span="2" class="comment-info">
        <el-row>
          <div class="comment-name">ddd<!--todo--></div>
        </el-row>
        <el-row>
          <div class="comment-name"><!--todo--></div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" :offset="6">
        <div>
          <mavon-editor
            :toolbars="toolbars"
            style="min-height: 300px"
            :subfield="false"
            defaultOpen="edit"
            :toolbarsFlag="true"
            :editable="true"
            :scrollStyle="true"
            :ishljs="true"
            previewBackground="#eeffff"
          ></mavon-editor>
        </div>
      </el-col>
    </el-row>
  </el-main>
</template>
<script>
  import {BrowseFile, GetFile, GetUserInfo} from "../main";

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
        comment: [{time: "2020-08-14 11:45", name: "www", content: "123"},
          {time: "2020-08-14 11:45", name: "ss", content: "ff"}],
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
      }
    },
    mounted() {
      BrowseFile({
        id: this.$store.userId.toString(),
        did: this.$route.query.docId.toString()
      }).then((res) => {
        if (res.data.result === false) {
          this.$message.error("文档不存在或无权查看")
          return
        }
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
