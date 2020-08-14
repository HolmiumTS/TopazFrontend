<template>
  <div id="main">
    <el-header>
      <el-page-header @back="goBack"></el-page-header>
      <el-button @click.native.prevent="test" style="margin: -10% 50%;" type="success" plain>Test</el-button>
    </el-header>
    <p>
      <el-input v-model="title" placeholder="文件名" size="medium" style="width: 200px"></el-input>
    </p>
    <mavon-editor :toolbars="toolbars" placeholder="oooooooo" defaultOpen="edit" toolbarsBackground="#66ccff"
                  subfield="true"/>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        title: "未命名",
        value: "",
        editorOption: {
          placeholder: "编辑文章内容",
        }, toolbars: {
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
          htmlcode: true, // 展示html源码
          help: false, // 帮助
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          navigation: true, // 导航目录
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          subfield: true, // 单双栏模式
          preview: true // 预览
        },
      };
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      test() {
        console.log(this.value);
        console.log(typeof this.value);
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
