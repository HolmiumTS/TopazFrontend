<template>
  <el-main>
    <el-table
      :data="files"
      :default-sort="{prop: 'id', order: 'ascending'}"
      style="width:100%;margin: auto auto"
    >
      <el-table-column min-width="10%" label="文档编号" prop="id" sortable></el-table-column>
      <el-table-column min-width="15%" label="文档名" prop="name" sortable></el-table-column>
      <el-table-column min-width="10%" label="收藏" prop="collected" sortable>
        <template slot-scope="scope">
          <!-- <el-tag
            v-if="scope.row.collected =='已收藏'"
            size="medium"
            type="success"
          >{{ scope.row.collected }}</el-tag>
          <el-tag
            v-if="scope.row.collected!='已收藏'"
            size="medium"
            type="info"
          >{{ scope.row.collected }}</el-tag>-->
          <el-button
            v-if="scope.row.collected =='已收藏'"
            type="warning"
            icon="el-icon-star-off"
            @click.native.prevent="handleCollect(scope.row.id)"
            circle
            plain
            size="medium"
          ></el-button>
          <el-button
            v-if="scope.row.collected !='已收藏'"
            icon="el-icon-star-off"
            @click.native.prevent="handleCollect(scope.row.id)"
            circle
            plain
            size="medium"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column min-width="60%" label="操作">
        <template slot-scope="scope">
          <!-- <el-button
            round
            size="mini"
            @click.native.prevent
          >{{scope.row.collected=='已收藏'?'取消收藏':'收藏文档'}}</el-button>-->
          <!-- <el-button @click.native.prevent="browseFile(scope.row.id)" size="mini">浏览</el-button> -->
          <el-button
            icon="el-icon-view"
            type="info"
            @click.native.prevent="browseFile(scope.row.id)"
            round
            size="medium"
            plain
          ></el-button>
          <el-button
            icon="el-icon-s-operation"
            type="primary"
            @click.native.prevent="manageAuthority(scope.row.id)"
            circle
            size="medium"
            plain
          ></el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            @click.native.prevent="deleteFile(scope.row.id)"
            circle
            size="medium"
            plain
          ></el-button>
          <el-button
            icon="el-icon-share"
            type="success"
            @click.native.prevent="shareFile(scope.row.id)"
            circle
            size="medium"
            plain
          ></el-button>
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
  methods: {
    handleCollect(id) {
      console.log("处理收藏" + id);
    },
    browseFile(id) {
      console.log("浏览" + id);
    },
    manageAuthority(id) {
      console.log("管理权限" + id);
    },
    deleteFile(id) {
      console.log("删除文档" + id);
    },
    shareFile(id) {
      console.log("分享文档" + id);
    },
  },
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