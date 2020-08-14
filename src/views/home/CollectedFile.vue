<template>
  <el-main>
    <!--
    <el-table
      :data="files"
      :default-sort="{prop: 'id', order: 'ascending'}"
      style="width:90%;margin: auto auto"
    >
      <el-table-column min-width="10%" label="文档编号" prop="id" sortable></el-table-column>
      <el-table-column min-width="15%" label="文档名" prop="name" sortable></el-table-column>
      <el-table-column min-width="10%" label="创建者" prop="username" sortable></el-table-column>
      <el-table-column min-width="50%" label="操作">
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
    -->
    <table cellspacing="20">
      <tr v-for="(disFiles , index) in displayFiles" :key="index">
        <td v-for="dFile in disFiles" :key="dFile.id">
          <el-card class="cardFile" :dFile="dFile" shadow="hover">
            <p>{{dFile.name}}</p>
            <p>{{dFile.username}}</p>
            <p>{{dFile.time}}</p>
          </el-card>
        </td>
      </tr>
    </table>
  </el-main>
</template>
<script>
import { GetCollectedFile } from "../../main";
export default {
  data() {
    return {
      rowWidth: 5,
      displayFiles: [],
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
        {
          id: "003",
          name: "testfile2",
          username: "王五",
          time: "08-05 12:22",
        },
        {
          id: "004",
          name: "testfile2",
          username: "王五",
          time: "08-05 12:22",
        },
        {
          id: "005",
          name: "testfile2",
          username: "王五",
          time: "08-05 12:22",
        },
        {
          id: "006",
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
      this.files = res.files;
    });
    for (let i = 0; i < this.files.length; ) {
      //console.log("i " + i);
      //console.log(this.displayFiles);
      this.displayFiles[parseInt(i / this.rowWidth)] = [];
      for (let j = 0; j < this.rowWidth && i < this.files.length; j++) {
        //console.log("i " + i + " j " + j + "  " + this.files.length);
        //console.log(parseInt(i / this.rowWidth));
        this.displayFiles[parseInt(i / this.rowWidth)][j] = this.files[i];
        i++;
      }
    }
    console.log("displayFiles");
    /*for (let i = 0; i < this.displayFiles.length; i++) {
      console.log(i);
      console.log(typeof this.displayFiles[i]);
      console.log(this.displayFiles[i]);
    }*/
    console.log(this.displayFiles);
  },
};
</script>
<style>
.cardFile {
}
</style>