<template>
  <div id="main">
    <el-header>
      <el-page-header @back="goBack"></el-page-header>
    </el-header>
    <p align="left">
      <el-input v-model="title" placeholder="文件名" size="medium" style="width: 200px"></el-input>
    </p>
    <mavon-editor v-model="value" />
    <p>
      <el-button @click.native.prevent="test">Test</el-button>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "未命名",
      value: null,
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