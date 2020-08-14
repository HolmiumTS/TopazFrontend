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
    <table cellspacing="20" style="margin: -20px">
      <tr v-for="disFiles in displayFiles" :key="disFiles[0].id">
        <td v-for="dFile in disFiles" :key="dFile.id">
          <el-card class="cardFile" :dFile="dFile" shadow="always">
            <el-row class="cardRow">
              <el-col :span="2" style="margin: 0% 15%">
                <el-image style="width:60px;height:60px" :src="fileIcon"></el-image>
              </el-col>
              <el-col :span="9" style="margin: px">
                <div align="left" style="font-size: 100%;margin:0px 0px 5px 0px;">{{dFile.name}}</div>
                <div
                  align="left"
                  style="font-size: 60%;margin:0px 0px 5px 0px;"
                >{{"创建者: "+dFile.username}}</div>
                <div align="left" style="font-size: 50%;color:#B3B3B3">{{"最后更新于"+dFile.time}}</div>
              </el-col>
              <el-col :span="1" :offset="1">
                <el-dropdown placement="bottom-end">
                  <i class="el-icon-more"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native.prevent="browseFile(dFile.id)">
                      <i class="el-icon-search"></i>
                      <span>浏览</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native.prevent="collectFile(dFile.id)">
                      <i class="el-icon-star-on"></i>
                      <span>已收藏</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native.prevent="authorizeFile(dFile.id)">
                      <i class="el-icon-s-tools"></i>
                      <span>管理权限</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided @click.native.prevent="deleteFile(dFile.id)">
                      <i class="el-icon-star-off" style="color:rgba(255,255,255,0)"></i>
                      <span>删除</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-card>
        </td>
      </tr>
    </table>
  </el-main>
</template>
<script>
import { GetCollectedFile } from "../../main";
import { CollectFile, authorizeFile, deleteFile } from "../../main";
export default {
  data() {
    return {
      fileIcon:
        "http://qexiy12gt.hd-bkt.clouddn.com/%E6%96%87%E6%A1%A3%E5%9B%BE%E6%A0%87.png",
      rowWidth: 4,
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
        {
          id: "007",
          name: "testfile2",
          username: "王五",
          time: "08-05 12:22",
        },
      ],
    };
  },
  methods: {
    collectFile(id) {
      //todo
    },
    browseFile(id) {
      //todo
    },
    authorizeFile(id) {
      //todo
    },
    deleteFile(id) {
      //todo
    },
  },
  mounted() {
    GetCollectedFile({ userId: this.$store.state.userId }).then((res) => {
      this.files = res.files;
    });
    for (let i = 0; i < this.files.length; ) {
      //this.displayFiles[parseInt(i / this.rowWidth)] = [];
      this.$set(this.displayFiles, parseInt(i / this.rowWidth), []);
      for (let j = 0; j < this.rowWidth && i < this.files.length; j++) {
        //this.displayFiles[parseInt(i / this.rowWidth)][j] = this.files[i];
        this.$set(
          this.displayFiles[parseInt(i / this.rowWidth)],
          j,
          this.files[i]
        );
        i++;
      }
    }
    console.log("displayFiles");
    console.log(this.displayFiles);
  },
};
</script>
<style>
.cardFile {
  height: 80px;
  width: 300px;
  background-color: #fcfcfc;
  border: white;
}
.cardRow {
  margin: -50px;
}
</style>