<template>
  <el-main>
    <el-table
      :data="files"
      :default-sort="{prop: 'id', order: 'ascending'}"
      style="width:60%;margin: auto auto"
    >
      <el-table-column min-width="10%" label="文档编号" prop="id" sortable></el-table-column>
      <el-table-column min-width="15%" label="文档名" prop="name" sortable></el-table-column>
      <el-table-column min-width="35%" label="操作">
        <el-button type="success" @click.native.prevent size="mini">恢复文档</el-button>
        <el-button type="danger" @click.native.prevent size="mini">彻底删除</el-button>
      </el-table-column>
    </el-table>
  </el-main>
</template>
<script>
import { GetDeletedFile } from "../../main";
export default {
  data() {
    return {
      files: [
        {
          id: "001",
          name: "testfile1",
        },
        {
          id: "002",
          name: "testfile2",
        },
      ],
    };
  },
  methods: {},
  mounted() {
    GetDeletedFile({ userId: this.$store.state.userId }).then((res) => {
      //todo
      this.files = res.files;
    });
  },
};
</script>
<style>
</style>