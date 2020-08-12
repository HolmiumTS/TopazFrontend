<template>
  <el-main>
    <h2>团队文档</h2>
  </el-main>
</template>

<script>
export default {
  data() {
    return {
      teamName: "Topaz Team", // for test
    };
  },
<<<<<<< HEAD
  methods: {
    goBack() {
      // 返回
      this.$store.dispatch("commitChangeStatus", "0");
      this.$router.push("/home");
    },
  },
=======
  methods: {},
>>>>>>> origin/dev
};
</script>

<style scoped>
</style>