<template>
  <el-main>
    <el-table
      :data="files"
      :default-sort="{prop: 'id', order: 'ascending'}"
      style="width:100%;margin: auto auto"
    >
      <el-table-column min-width="10%" label="文档编号" prop="id" sortable></el-table-column>
      <el-table-column min-width="15%" label="文档名" prop="name" sortable></el-table-column>
      <el-table-column min-width="10%" label="是否已收藏" prop="collected" sortable>
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.collected =='已收藏'"
            size="medium"
            type="success"
          >{{ scope.row.collected }}</el-tag>
          <el-tag
            v-if="scope.row.collected!='已收藏'"
            size="medium"
            type="info"
          >{{ scope.row.collected }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="60%" label="操作">
        <template slot-scope="scope">
          <el-button
            round
            size="mini"
            @click.native.prevent
          >{{scope.row.collected=='已收藏'?'取消收藏':'收藏文档'}}</el-button>
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
import { GetMyFile } from "../../main";
export default {
  data() {
    return {
      files: [
        {
          id: "001",
          name: "testfile1",
          collected: "已收藏",
        },
        {
          id: "002",
          name: "testfile2",
          collected: "未收藏",
        },
      ],
    };
  },
  methods: {},
  mounted() {
    GetMyFile({ userId: this.$store.state.userId }).then((res) => {
      //todo
      this.files = res.files;
    });
  },
};
</script>
<style>
</style>