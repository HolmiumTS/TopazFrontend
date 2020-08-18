<template>
  <el-container>
    <el-header>
      <el-page-header @back="goBack" content="用户信息"></el-page-header>
    </el-header>
    <el-main class="userinfo">
      <el-container>
        <el-aside style="width:200px">
          <el-avatar
            :src="ava"
            :size="100"
            fit="fill"
            v-bind:username="this.$store.state.username"
            style="margin:50% 20%"
          >{{username}}</el-avatar>
          <p v-if="this.$store.state.userId == this.userId" style="margin: -16% 22%">
            <el-button @click.native.prevent="dis2=true">修改头像</el-button>
          </p>
        </el-aside>
        <div class="tableTitle">
          <span class="midText"></span>
        </div>
        <el-main>
          <h3>用户信息</h3>
          <table border="0" cellspacing="30" style="margin:0 auto;" width="400">
            <tr>
              <td>昵称:</td>
              <td align="left">{{userInfo.username}}</td>
            </tr>
            <tr>
              <td>手机:</td>
              <td align="left">{{userInfo.tel}}</td>
            </tr>
            <tr>
              <td>邮箱:</td>
              <td align="left">{{userInfo.email}}</td>
            </tr>
          </table>
          <span v-if="this.$store.state.userId == this.userId">
            <el-button @click.native.prevent="dis0=true">修改个人信息</el-button>
            <el-button @click.native.prevent="dis1=true">修改密码</el-button>
          </span>
        </el-main>
      </el-container>
      <el-dialog :visible.sync="dis0" title="修改个人信息" width="30%">
        <el-form
          :model="changeUserInfoForm"
          ref="changeUserInfoForm"
          :rules="rule0"
          label-width="80px"
        >
          <el-form-item label="手机" prop="tel">
            <el-input v-model.number="changeUserInfoForm.tel" placeholder="手机"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="changeUserInfoForm.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="username">
            <el-input v-model="changeUserInfoForm.username" placeholder="昵称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="submitting0" @click.native.prevent="submit0">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dis1" title="修改密码" width="30%">
        <el-form
          :model="changeUserPasswordForm"
          ref="changeUserPasswordForm"
          :rules="rule1"
          class="changeform"
          label-width="80px"
        >
          <el-form-item label="旧密码" prop="passwordOld">
            <el-input v-model="changeUserPasswordForm.passwordOld" placeholder="旧密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="changeUserPasswordForm.password" placeholder="新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmpassword">
            <el-input v-model="changeUserPasswordForm.confirmpassword" placeholder="确认密码"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="submitting1" @click.native.prevent="submit1">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dis2" title="上传头像" width="30%">
        <el-upload
          :multiple="false"
          list-type="picture-card"
          :on-remove="handleRemove"
          :action="actionPath"
          accept="image/jpeg, image/png, image/jpg"
          :before-upload="beforeUpload"
          :data="postData"
          :file-list="avatar"
          :on-success="handleSuccess"
          :on-exceed="handleExceed"
          :limit="1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="submitting2" @click.native.prevent="submit2">确认</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { GetUserInfo } from "../main";
import { ChangeUserInfo } from "../main";
import { ChangeUserPassword } from "../main";
import { ChangeUserAvatar } from "../main";
import { genToken } from "../genToken";
import random from "string-random";
export default {
  components: {},
  data() {
    let confirmpasswordCheck = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("确认密码不能为空"));
      } else if (value !== this.changeUserPasswordForm.password) {
        return callback(new Error("密码不一致"));
      } else {
        return callback();
      }
    };
    let telCheck = (rule, value, callback) => {
      if (value === "" || value == undefined) {
        return callback(new Error("手机号不能为空"));
      } else if (!Number.isInteger(value) || value.toString().length !== 11) {
        return callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      actionPath: "https://upload.qiniup.com", // 华东
      photoUrl: "http://qexiy12gt.hd-bkt.clouddn.com/", //外链域名
      dis0: false,
      dis1: false,
      dis2: false,
      submitting0: false,
      submitting1: false,
      submitting2: false,
      rule1: {
        passwordOld: [
          {
            required: true,
            message: "旧密码不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            min: 6,
            message: "新密码不能为空,长度最少6位",
            trigger: "blur",
          },
        ],
        confirmpassword: [
          {
            required: true,
            validator: confirmpasswordCheck,
            trigger: "blur",
          },
        ],
      },
      rule0: {
        tel: [
          {
            required: true,
            validator: telCheck,
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "邮箱格式有误",
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message: "昵称不能为空",
            trigger: "blur",
          },
        ],
      },
      userId: "",
      avatar: [],
      postData: {
        token: "",
        key: "",
      },
      userInfo: {
        username: "",
        tel: null,
        email: "",
        avatar: "",
      },
      changeUserInfoForm: {
        username: "",
        tel: null,
        email: "",
      },
      changeUserPasswordForm: {
        passwordOld: "",
        password: "",
        confirmpassword: "",
      },
    };
  },
  methods: {
    submit0() {
      this.$refs.changeUserInfoForm.validate((valid) => {
        if (valid) {
          this.submitting0 = true;
          let params = this.changeUserInfoForm;
          params.id = this.userId;
          params.tel = params.tel.toString();
          ChangeUserInfo(params).then((res) => {
            if (res.data.result == true) {
              this.$message({
                type: "success",
                message: "信息修改成功",
              });
              this.submitting0 = false;
              this.$store.dispatch("commitLogin", {
                userId: this.userId,
                username: this.changeUserInfoForm.username,
                avatar: this.userInfo.avatar,
              });
              this.dis0 = false;
              this.$router.push({
                path: "/userInfo",
                query: {
                  userId: this.$store.state.userId,
                },
              });
            } else {
              this.submitting0 = false;
              this.$message.error({
                message: "信息修改失败,请稍后再试",
              });
            }
          });
        } else {
          this.$message.error({
            message: "请检查输入信息",
          });
        }
      });
    },
    submit1() {
      this.$refs.changeUserPasswordForm.validate((valid) => {
        if (valid) {
          this.submitting1 = true;
          let changePasswordParams = {
            id: this.userId,
            oldPassword: this.changeUserPasswordForm.PasswordOld,
            newPassword: this.changeUserPasswordForm.password,
          };
          ChangeUserPassword(changePasswordParams).then((res) => {
            if (res.data.result == true) {
              this.$message({
                type: "success",
                message: "密码修改成功",
              });
              this.submitting1 = false;
              this.dis1 = false;
              this.$router.push({
                path: "/userInfo",
                query: {
                  userId: this.$store.state.userId,
                },
              });
            } else {
              this.submitting1 = false;
              this.$message.error({
                message: "旧密码错误",
              });
            }
          });
        } else {
          this.$message.error({
            message: "请检查输入信息",
          });
        }
      });
    },
    submit2() {
      if (this.avatar.length == 1) {
        this.submitting2 = true;
        ChangeUserAvatar({
          id: this.$store.state.userId,
          avatar: this.avatar[0],
        }).then((res) => {
          if (res.data.result == true) {
            this.submitting2 = false;
            this.$message({
              type: "success",
              message: "头像修改成功",
            });
            this.$store.dispatch("commitLogin", {
              userId: this.userId,
              username: this.$store.state.username,
              avatar: this.avatar[0],
            });
            this.dis2 = false;
            this.$router.push({
              path: "/userInfo",
              query: {
                userId: this.$store.state.userId,
              },
            });
          } else {
            this.submitting2 = false;
            this.$message.error("修改头像失败, 请稍后再试");
          }
        });
      } else {
        this.$message.error("请上传新头像");
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    isMyself() {
      return this.$store.state.userId == this.userId;
    },
    beforeUpload(file) {
      const checkFileType =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      const checkFileSize = file.size / 1024 / 1024 < 5;
      if (!checkFileType) {
        this.$message.error("上传图片必须是 jpeg/jpg/png 格式！");
      }
      if (!checkFileSize) {
        this.$message.error("上传图片大小不能超过 5MB！");
      }
      if (checkFileType && checkFileSize) this.postData.key = random(16);
      return checkFileType && checkFileSize;
    },
    handleSuccess(response) {
      this.avatar.push(this.photoUrl + response.key);
      console.log(this.avatar);
    },
    handleRemove(file) {
      Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };

      if (file.url) {
        let removePicture = file.url.substr(file.url.lastIndexOf("/"));
        this.avatar.remove(removePicture);
        if (!this.avatar.length) {
          this.hasFmt = false;
          this.$refs.image.validate();
        }
      }
      if (file.response.key) {
        this.avatar.remove(this.photoUrl + file.response.key);
      }
    },
    handleExceed() {
      this.$message.warning("最多上传 1 张头像");
    },
  },
  computed: {
    ava() {
      return this.$store.state.avatar;
      /*return (
        this.$store.state.avatar ||
        "https://ftp.bmp.ovh/imgs/2020/08/182a2651f9696ab4.png"
      );*/
      //return "https://ftp.bmp.ovh/imgs/2020/08/182a2651f9696ab4.png";
      //return "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
    },
  },
  created() {
    var token;
    var policy = {};
    var bucketName = "domaint";
    var AK = "K96MCAU7eCnSWz4XUbxIBe9Q9PUm_gBHfacmsAEf";
    var SK = "g0eagx-yjztmAo0iVi-Nj8QrsCRGrKhdGKIjpVr9";
    var deadline = 1599840000; // 2020-09-12
    policy.scope = bucketName;
    policy.deadline = deadline;
    token = genToken(AK, SK, policy);
    this.postData.token = token;

    console.log("token = " + token);
  },
  mounted() {
    GetUserInfo({ id: this.$route.query.userId }).then((res) => {
      this.userId = this.$route.query.userId;
      this.userInfo.username = res.data.username;
      this.userInfo.tel = parseInt(res.data.tel);
      this.userInfo.email = res.data.email;
      this.userInfo.avatar = res.data.avatar;
      this.changeUserInfoForm.username = res.data.username;
      this.changeUserInfoForm.tel = parseInt(res.data.tel);
      this.changeUserInfoForm.email = res.data.email;
    });
  },
};
</script>

<style scoped>
.userinfo {
  margin: 2% auto;
  background: #fff;
  box-shadow: 0 0 8px #b4bccc;
  padding: 20px 30px 30px 30px;
  border-radius: 10px;
}
.tableTitle {
  position: relative;
  margin: 0 auto;
  width: 1px;
  background-color: #d4d4d4;
  text-align: center;
  font-size: 16px;
  color: rgba(101, 101, 101, 1);
}
.midText {
  position: absolute;
  left: 50%;
  background-color: #ffffff;
  padding: 0 15px;
  transform: translateX(-50%) translateY(-50%);
}
.el-dialog {
  border-radius: 20px;
}
</style>