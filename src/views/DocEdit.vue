<template>
  <div id="main">
    <el-header>
      <el-page-header @back="goBack"></el-page-header>
      <el-button @click.native.prevent="test" style="margin: -10% 50%;" type="success" plain>Test</el-button>
    </el-header>
    <p align="left">
      <el-input v-model="title" placeholder="文件名" size="medium" style="width: 200px"></el-input>
    </p>
    <quill-editor ref="myTextEditor" v-model="value" :options="editorOption" style="height:600px;"></quill-editor>
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
  mounted() {},
};
</script>
<style>
.back {
  width: 100%;
  height: 50px;
  position: fixed;
}
</style>