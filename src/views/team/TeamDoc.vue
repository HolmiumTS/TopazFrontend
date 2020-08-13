<!-- 权限相关尚未考虑 -->
<template>
  <el-main>
    <h2>团队文档</h2>
    <el-table
      :data="files"
      :default-sort="{prop: 'time', order: 'descending'}"
      style="width:100%;margin: auto auto;"
    >
      <el-table-column min-width="10%" label="文档编号" prop="id" sortable></el-table-column>
      <el-table-column min-width="15%" label="文档名" prop="name" sortable></el-table-column>
      <el-table-column min-width="10%" label="创建者" prop="authorName" sortable></el-table-column>
      <el-table-column min-width="15%" label="最后浏览时间" prop="time" sortable>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="10%" label="收藏" prop="collected" sortable>
        <template slot-scope="scope">
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
      <el-table-column min-width="40%" label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-view"
            type="info"
            @click.native.prevent="browseFile(scope.row.id)"
            round
            size="medium"
            plain
          ></el-button>
          <el-button
            v-if="userTypeInTeam<=1||scope.row.authorId==userId"
            icon="el-icon-s-operation"
            type="primary"
            @click.native.prevent="manageAuthority(scope.row.id)"
            circle
            size="medium"
            plain
          ></el-button>
          <el-button
            v-if="userTypeInTeam<=1||scope.row.authorId==userId"
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
export default {
  data() {
    return {
      files: [
        {
          id: "001",
          authorId: "23333",
          authorName: "张三",
          name: "testfile1",
          time: "08-14 11:45",
          collected: "已收藏",
        },
        {
          id: "002",
          authorId: "12345",
          authorName: "张三",
          name: "testfile2",
          time: "08-05 12:22",
          collected: "未收藏",
        },
      ],
      userTypeInTeam: 2, //  0 创建者，1 管理员，2 成员
      userId: "",
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
    this.userId = this.$store.state.userId;
    // this.userId = "23333";
  },
};
</script>

<style scoped>
</style>