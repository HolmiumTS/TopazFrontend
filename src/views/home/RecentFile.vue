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
                <div
                  align="left"
                  style="font-size: 50%;color:#B3B3B3;margin:0px 0px 5px 0px;"
                >{{"最后编辑于: "+dFile.time}}</div>
              </el-col>
              <el-col :span="1">
                <i v-if="dFile.collected=='已收藏'" class="el-icon-star-on"></i>
                <i
                  v-if="dFile.collected!='已收藏'"
                  class="el-icon-collection-tag"
                  style="color:rgba(255,255,255,0)"
                ></i>
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
                      <i :class="dFile.collected=='已收藏'?'el-icon-star-on':'el-icon-star-off'"></i>
                      <span v-if="dFile.collected=='已收藏'">已收藏</span>
                      <span v-if="dFile.collected!='已收藏'">收藏</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native.prevent="ShowAuthorizeDialog(dFile.id)">
                      <i class="el-icon-s-tools"></i>
                      <span>管理权限</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native.prevent="templateFile(dFile.id)">
                      <i class="el-icon-s-tools" style="color:rgba(255,255,255,0)"></i>
                      <span>存为模板</span>
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
    <el-dialog :visible.sync="showAuthorizeDialog" title="管理文档权限" width="400px">
      <p align="left">
        <span>
          <h4>浏览:</h4>
        </span>
        <el-radio-group v-model="viewAuth">
          <el-radio :label="'0'" v-if="selectFileTeam=='-1'">仅创建者</el-radio>
          <el-radio :label="'0'" v-if="selectFileTeam!='-1'">文档所在团队成员</el-radio>
          <el-radio :label="'1'">所有人</el-radio>
        </el-radio-group>
      </p>
      <p align="left">
        <span>
          <h4>编辑:</h4>
        </span>
        <el-radio-group v-model="editAuth">
          <el-radio :label="'0'" :disabled="editAuthCheck('0')">仅创建者</el-radio>
          <el-radio :label="'1'" :disabled="editAuthCheck('1')">文档所在团队成员</el-radio>
          <el-radio :label="'2'" :disabled="editAuthCheck('2')">所有人</el-radio>
        </el-radio-group>
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native.prevent="authorizeFile">确认</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>
<script>
import { GetRecentFile } from "../../main";
import {
  CollectFile,
  AuthorizeFile,
  DeleteFile,
  TemplateFile,
} from "../../main";
export default {
  data() {
    return {
      fileIcon:
        "http://qexiy12gt.hd-bkt.clouddn.com/%E6%96%87%E6%A1%A3%E5%9B%BE%E6%A0%87.png",
      rowWidth: 4,
      showAuthorizeDialog: false,
      viewAuth: null,
      editAuth: null,
      selectFileId: null,
      selectFileTeam: null,
      displayFiles: [],
      //files:[],
      files: [
        {
          id: "001",
          name: "testfile1",
          username: "张三",
          team: "-1",
          collected: "已收藏",
          time: "08/14 13:23",
          view: "0",
          edit: "0",
        },
        {
          id: "002",
          name: "testfile2",
          username: "张三",
          team: "001",
          collected: "未收藏",
          time: "08/14 13:23",
          view: "1",
          edit: "1",
        },
        {
          id: "003",
          name: "testfile2",
          username: "张三",
          team: "002",
          collected: "已收藏",
          time: "08/14 13:23",
          view: "1",
          edit: "2",
        },
        {
          id: "004",
          name: "testfile2",
          username: "张三",
          team: "-1",
          collected: "已收藏",
          time: "08/14 13:23",
          view: "0",
          edit: "0",
        },
        {
          id: "005",
          name: "testfile2",
          username: "张三",
          team: "-1",
          collected: "未收藏",
          time: "08/14 13:23",
          view: "1",
          edit: "1",
        },
        {
          id: "006",
          name: "testfile2",
          username: "张三",
          team: "-1",
          collected: "未收藏",
          time: "08/14 13:23",
          view: "1",
          edit: "2",
        },
        {
          id: "007",
          name: "testfile2",
          username: "张三",
          team: "-1",
          collected: "已收藏",
          time: "08/14 13:23",
          view: "0",
          edit: "0",
        },
      ],
    };
  },
  computed: {},
  methods: {
    editAuthCheck(edit) {
      if (this.selectFileTeam == "-1") {
        if (this.viewAuth == "0" && edit != "0") {
          this.editAuth = "0";
          return true;
        }
      } else {
        if (this.viewAuth == "0" && edit == "2") {
          if (this.editAuth == "2") {
            this.editAuth = "1";
          }
          return true;
        }
      }
      return false;
    },
    collectFile(id) {
      CollectFile({ userId: this.$store.state.userId, fileId: id }).then(
        (res) => {
          if (res.data.result == true) {
            console.log("collectFile_Succeed: " + id);
            this.$message({
              type: "success",
              message: "收藏成功",
            });
            this.$router.go(0);
          } else {
            console.log("collectFile_Failed: " + id);
            this.$message.error({
              message: "收藏失败",
            });
          }
        }
      );
    },
    browseFile(id) {
      this.$router.push({
        path: "/docBrowse",
        query: {
          docId: id,
        },
      });
    },
    ShowAuthorizeDialog(id) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].id == id) {
          this.viewAuth = this.files[i].view;
          this.editAuth = this.files[i].edit;
          this.selectFileTeam = this.files[i].team;
          this.selectFileId = this.files[i].id;
        }
      }
      this.showAuthorizeDialog = true;
    },
    authorizeFile(id) {
      let params = {
        id: this.selectFileId,
        view: this.viewAuth,
        edit: this.editAuth,
      };
      AuthorizeFile(params).then((res) => {
        if (res.data.result == true) {
          console.log("authFile_Succeed: " + params);
          this.$message({
            type: "success",
            message: "修改成功",
          });
          this.$router.go(0);
        } else {
          console.log("authFile_Failed: " + params);
          this.$message.error({
            message: "收藏失败",
          });
        }
      });
    },
    templateFile(id) {
      TemplateFile({ userId: this.$store.state.userId, fileId: id }).then(
        (res) => {
          if (res.data.result == true) {
            console.log("templateFile_Succeed: " + id);
            this.$message({
              type: "success",
              message: "模板保存成功",
            });
            this.$router.go(0);
          } else {
            console.log("templateFile_Failed: " + id);
            this.$message.error({
              message: "模板保存失败",
            });
          }
        }
      );
    },
    deleteFile(id) {
      DeleteFile({ userId: this.$store.state.userId, fileId: id }).then(
        (res) => {
          if (res.data.result == true) {
            console.log("deleteFile_Succeed: " + id);
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.$router.go(0);
          } else {
            console.log("deleteFile_Failed: " + id);
            this.$message.error({
              message: "删除失败",
            });
          }
        }
      );
    },
  },
  mounted() {
    GetRecentFile({ id: this.$store.state.userId }).then((res) => {
      this.files = res.files;
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
.el-dialog {
  border-radius: 10px;
}
</style>