<template>
  <el-main>
    <el-page-header @back="goBack" :content="teamName"></el-page-header>
  </el-main>
</template>

<script>
export default {
  data() {
    return {
      teamName: "Topaz Team", // for test
    };
  },
  methods: {
    goBack() {
      // 返回到 '我的团队'
      this.$store.dispatch("commitChangeStatus", "0");
      this.$router.push("/home");
    },
  },
};
</script>

<style scoped>
</style>