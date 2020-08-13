<template>
  <el-main>
    <el-table
      :data="files"
      :default-sort="{prop: 'id', order: 'ascending'}"
      style="width:90%;margin: auto auto"
    >
      <el-table-column min-width="10%" label="文档编号" prop="id" sortable></el-table-column>
      <el-table-column min-width="15%" label="文档名" prop="name" sortable></el-table-column>
      <el-table-column min-width="10%" label="创建者" prop="username" sortable></el-table-column>
      <el-table-column min-width="50%" label="操作">
        <template>
          <el-button round size="mini" @click.native.prevent>取消收藏</el-button>
          <el-button @click.native.prevent="browseFile" size="mini">浏览</el-button>
          <el-button type="warning" @click.native.prevent size="mini">管理权限</el-button>
          <el-button type="danger" @click.native.prevent size="mini">删除</el-button>
          <el-button type="primary" @click.native.prevent size="mini">分享</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template>
<script>
import { GetCollectedFile } from "../../main";
export default {
  data() {
    return {
      files: [
        {
          id: "001",
          name: "testfile1",
          username: "张三",
          time: "08-14 11:45",
        },
        {
          id: "002",
          name: "testfile2",
          username: "王五",
          time: "08-05 12:22",
        },
      ],
    };
  },
  methods: {},
  mounted() {
    GetCollectedFile({ userId: this.$store.state.userId }).then((res) => {
      //todo
      this.files = res.files;
    });
  },
};
</script>
<style>
</style>