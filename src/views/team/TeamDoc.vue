<!-- 权限相关尚未考虑 -->
<template>
  <el-container>
    <el-main class="teamDoc">
      <!-- <h2>团队文档</h2> -->
      <!-- <el-button
        class="createTeamFile"
        type="primary"
        icon="el-icon-plus"
        @click.native.prevent="showCreateDocDialog=true"
        plain
      >创建团队文档</el-button>-->
      <el-card
        class="cardFile"
        style="margin-bottom: 30px; background-color: #F7F7F7; cursor: pointer;"
        shadow="always"
        @click.native.prevent="showCreateDocDialog=true"
      >
        <div>
          <i class="el-icon-plus"></i>
        </div>
      </el-card>
      <table cellspacing="20" style="margin: -20px">
        <tr v-for="disFiles in displayFiles" :key="disFiles[0].id">
          <td v-for="dFile in disFiles" :key="dFile.id">
            <el-card class="cardFile" :dFile="dFile" shadow="always">
              <el-row class="cardRow">
                <el-col :span="1" style="margin: 0% 10%">
                  <el-image style="width:60px;height:60px" :src="fileIcon"></el-image>
                </el-col>
                <el-col :span="13" style="margin: px">
                  <!--<div
                    align="left"
                    style="color:#777777;font-size: 150%;margin:15px auto;"
                  >{{dFile.name}}</div>-->
                  <div align="left" style="font-size: 100%;margin:20px 0px 5px 0px;">{{dFile.name}}</div>
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
                      <el-dropdown-item
                        @click.native.prevent="ShowAuthorizeDialog(dFile.id)"
                        :disabled="checkAuthority(dFile.owner)"
                      >
                        <i class="el-icon-s-tools"></i>
                        <span>管理权限</span>
                      </el-dropdown-item>
                      <el-dropdown-item @click.native.prevent="templateFile(dFile.id)">
                        <i class="el-icon-s-tools" style="color:rgba(255,255,255,0)"></i>
                        <span>存为模板</span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        divided
                        @click.native.prevent="deleteFile(dFile.id)"
                        :disabled="checkAuthority(dFile.owner)"
                      >
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

      <div v-if="files.length<1" style="margin:13% auto">
        <div style="font-size:500%;color:#999999">無</div>
        <div style="font-size:80%;color:#999999">没有文件</div>
      </div>

      <el-dialog
        :visible.sync="showCreateDocDialog"
        title="创建团队文档"
        style="width: 1000px;margin: auto auto;"
      >
        <el-form :model="newFileForm" ref="newFileForm" :rules="rule" label-width="0px">
          <el-form-item prop="name" align="left">
            <span style="margin:0px 20px;">文件名:</span>
            <el-input type="text" v-model="newFileForm.name" placeholder="文件名" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item prop="templateId" align="left">
            <span style="margin:0px 27px;">模板:</span>
            <el-select style="width: 300px" v-model="newFileForm.templateId" placeholder="选择模板">
              <el-option
                v-for="template in templates"
                :key="template.id"
                :label="template.name"
                :value="template.id"
              >
                <span style="float: left">{{ template.name }}</span>
                <span
                  style="float: right; color: #8492a6; font-size: 10px"
                >{{ template.id!='-1'?template.id:"" }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div align="right">
          <el-button
            type="primary"
            @click.native.prevent="newTeamFile"
            size="medium"
            :loading="submitting"
          >确认创建</el-button>
        </div>
      </el-dialog>

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
  </el-container>
</template>

<script>
import {
  GetTeamFile,
  GetTeamMember,
  NewFile,
  CollectFile,
  AuthorizeFile,
  TemplateFile,
  DeleteFile,
  GetUserTemplate,
} from "../../main";
export default {
  data() {
    return {
      fileIcon:
        "http://qexiy12gt.hd-bkt.clouddn.com/%E6%96%87%E6%A1%A3%E5%9B%BE%E6%A0%87.png",
      rowWidth: 3,
      showAuthorizeDialog: false,
      showCreateDocDialog: false,
      submitting: false,
      viewAuth: null,
      editAuth: null,
      selectFileId: null,
      selectFileTeam: null,
      displayFiles: [],
      rule: {
        name: [
          {
            required: true,
            message: "文件名不能为空,最多20个字",
            max: 18,
            trigger: "blur",
          },
        ],
        templateId: [
          {
            required: true,
            message: "请选择模板",
            trigger: "blur",
          },
        ],
      },
      templates: [
        { id: "-1", name: "无" },
        // { id: "001", name: "模板1" },
        // { id: "002", name: "模板2" },
        // { id: "003", name: "模板3" },
      ],
      newFileForm: { name: null, templateId: "-1" },
      selectTemplateId: null,
      files: [],
      /*files: [
        {
          id: "001",
          name: "testfile1",
          owner: "",
          team: "-1",
          collected: "已收藏",
          view: "0",
          edit: "0",
        },
        {
          id: "002",
          name: "testfile2",
          owner: "",
          team: "001",
          collected: "未收藏",
          view: "1",
          edit: "1",
        },
        {
          id: "003",
          name: "testfile2",
          owner: "",
          team: "002",
          collected: "已收藏",
          view: "1",
          edit: "2",
        },
        {
          id: "004",
          name: "testfile2",
          owner: "123123",
          team: "-1",
          collected: "已收藏",
          view: "0",
          edit: "0",
        },
        {
          id: "005",
          name: "testfile2",
          owner: "2333",
          team: "-1",
          collected: "未收藏",
          view: "1",
          edit: "1",
        },
        {
          id: "006",
          name: "testfile2",
          owner: "",
          team: "-1",
          collected: "未收藏",
          view: "1",
          edit: "2",
        },
        {
          id: "007",
          name: "testfile2",
          owner: "",
          team: "-1",
          collected: "已收藏",
          view: "0",
          edit: "0",
        },
      ],*/
      userTypeInTeam: 2, //  0 创建者，1 管理员，2 成员
      userId: "",
    };
  },
  methods: {
    newTeamFile() {
      this.$refs.newFileForm.validate((valid) => {
        if (valid) {
          let params = {
            userId: this.$store.state.userId,
            teamId: this.$store.state.teamId,
            name: this.newFileForm.name,
            templateId: this.newFileForm.templateId,
          };
          this.submitting = true;
          console.log("newFileForm");
          console.log(params);
          NewFile(params).then((res) => {
            if (res.data.result == true) {
              this.$message({
                type: "success",
                message: "创建成功",
              });
              this.submitting = false;
              this.showCreateDocDialog = false;
              this.$router.go(0);
            } else {
              this.$message.error({
                message: "创建失败,请稍后再试",
              });
            }
          });
        }
      });
    },

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

    checkAuthority(owner) {
      return this.userTypeInTeam == 2 && this.$store.state.userId != owner;
    },

    collectFile(id) {
      let params = {
        userId: this.$store.state.userId,
        fileId: id,
      };
      CollectFile(params).then((res) => {
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
      });
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
      let params = {
        userId: this.$store.state.userId,
        fileId: id,
      };
      TemplateFile(params).then((res) => {
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
      });
    },

    deleteFile(id) {
      let params = {
        userId: this.$store.state.userId,
        fileId: id,
      };
      DeleteFile(params).then((res) => {
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
      });
    },
  },
  mounted() {
    this.userId = this.$store.state.userId;
    GetTeamMember({ teamId: this.$store.state.teamId }).then((res) => {
      let userId = this.$store.state.userId;
      if (res.data.result === true) {
        for (let i = 0; i < res.data.memberInfo.length; i++) {
          let id = res.data.memberInfo[i].memberId;
          let type = res.data.memberInfo[i].memberType;
          if (id === userId) this.userTypeInTeam = parseInt(type);
        }
      }
    });

    GetUserTemplate({ id: this.$store.state.userId }).then((res) => {
      this.templates = res.data.templates;
      this.templates.unshift({ id: "-1", name: "无" });
    });

    let params = {
      id: this.$store.state.userId,
      teamId: this.$store.state.teamId,
    };
    GetTeamFile(params).then((res) => {
      // let tmpFiles = res.files;
      res.data.files.forEach(
        (item) => item.isDel != "true" && this.files.push(item)
      );
      console.log("this.files = ");
      console.log(this.files);
      for (let i = 0; i < this.files.length; ) {
        // this.displayFiles[parseInt(i / this.rowWidth)] = [];
        this.$set(this.displayFiles, parseInt(i / this.rowWidth), []);
        for (let j = 0; j < this.rowWidth && i < this.files.length; j++) {
          // this.displayFiles[parseInt(i / this.rowWidth)][j] = this.files[i];
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
    });
    /*for (let i = 0; i < this.files.length; ) {
      // this.displayFiles[parseInt(i / this.rowWidth)] = [];
      this.$set(this.displayFiles, parseInt(i / this.rowWidth), []);
      for (let j = 0; j < this.rowWidth && i < this.files.length; j++) {
        // this.displayFiles[parseInt(i / this.rowWidth)][j] = this.files[i];
        this.$set(
          this.displayFiles[parseInt(i / this.rowWidth)],
          j,
          this.files[i]
        );
        i++;
      }
    }*/
  },
};
</script>

<style>
.teamDoc {
  min-height: 300px;
}
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
.el-icon-plus {
  color: #777777;
  margin: 15px auto;
  transform: scale(2);
}
</style>