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
              <el-col :span="1" style="margin: 0% 10%">
                <el-image style="width:60px;height:60px" :src="fileIcon"></el-image>
              </el-col>
              <el-col :span="14" style="margin: px">
                <!--<div
                  align="left"
                  style="color:#777777;font-size: 150%;margin:15px auto;"
                >{{dFile.name}}</div>-->
                <div align="left" style="font-size: 100%;margin:20px 0px 5px 0px;">{{dFile.name}}</div>
              </el-col>
              <el-col :span="1" :offset="1">
                <el-dropdown placement="bottom-end">
                  <i class="el-icon-more"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native.prevent="restoreFile(dFile.id)">
                      <i class="el-icon-success"></i>
                      <span>恢复文档</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native.prevent="showConfirm(dFile.id,dFile.name)">
                      <i class="el-icon-warning"></i>
                      <span>彻底删除</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-card>
        </td>
      </tr>
    </table>
    <div v-if="files.length<1" style="margin:20% auto">
      <div style="font-size:500%;color:#999999">無</div>
      <div style="font-size:80%;color:#999999">没有文件</div>
    </div>
    <el-dialog style="width: 600px;margin: 40px auto;" :visible.sync="dis">
      <div style="font-size:150%;">{{"彻底删除文档 "+ selectedName +"?"}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click.native.prevent="dis = false" size="mini">取消</el-button>
        <el-button type="primary" @click.native.prevent="perishFile" size="mini">确认</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>
<script>
import { GetDeletedFile } from "../../main";
import { RestoreFile, PerishFile } from "../../main";
export default {
  data() {
    return {
      fileIcon:
        "http://qexiy12gt.hd-bkt.clouddn.com/%E6%96%87%E6%A1%A3%E5%9B%BE%E6%A0%87.png",
      rowWidth: 3,
      dis: false,
      selectedId: null,
      selectedName: null,
      displayFiles: [],
      files: [],
      /*files: [
        {
          id: "001",
          name: "testfile1",
        },
        {
          id: "002",
          name: "testfile2",
        },
        {
          id: "003",
          name: "testfile3",
        },
        {
          id: "004",
          name: "testfile4",
        },
        {
          id: "005",
          name: "testfile5",
        },
        {
          id: "006",
          name: "testfile6",
        },
        {
          id: "007",
          name: "testfile2",
        },
      ],*/
    };
  },
  computed: {},
  methods: {
    showConfirm(id, name) {
      this.selectedId = id;
      this.selectedName = name;
      this.dis = true;
    },
    restoreFile(id) {
      //todo
      RestoreFile({ userId: this.$store.state.userId, fileId: id }).then(
        (res) => {
          if (res.data.result == true) {
            console.log("restoreFile_Succeed: " + id);
            this.$message({
              type: "success",
              message: "恢复成功",
            });
            this.$router.go(0);
          } else {
            console.log("restoreFile_Failed: " + id);
            this.$message.error({
              message: "恢复失败",
            });
          }
        }
      );
    },
    perishFile() {
      //todo
      console.log("perishingFile");
      console.log(this.selectedId);
      PerishFile({ id: this.selectedId }).then((res) => {
        if (res.data.result == true) {
          console.log("perishFile_Succeed: " + this.selectedId);
          this.$message({
            type: "success",
            message: "彻底删除成功",
          });
          this.dis = false;
          this.$router.go(0);
        } else {
          console.log("perishFile_Failed: " + this.selectedId);
          this.dis = false;
          this.$message.error({
            message: "彻底删除失败",
          });
        }
      });
    },
  },
  mounted() {
    GetDeletedFile({ id: this.$store.state.userId }).then((res) => {
      this.files = res.data.files;
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
    });
    /*for (let i = 0; i < this.files.length; ) {
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
    }*/
    console.log("displayFiles");
    console.log(this.displayFiles);
  },
};
</script>
<style>
.cardFile {
  height: 80px;
  width: 500px;
  background-color: #fcfcfc;
  border: white;
}
.cardRow {
  margin: -50px;
}
.el-dialog {
  border-radius: 10px;
}
</style>