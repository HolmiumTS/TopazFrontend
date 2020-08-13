<template>
  <el-main>
    <el-form
      :model="RegisterForm"
      ref="RegisterForm"
      :rules="rule"
      class="regform"
      label-width="80px"
    >
      <h2>注册</h2>
      <el-form-item label="昵称" prop="username">
        <el-input type="text" v-model="RegisterForm.username" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="RegisterForm.password" placeholder="密码"></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmpassword">
        <el-input type="password" v-model="RegisterForm.confirmpassword" placeholder="确认密码"></el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input type="email" v-model="RegisterForm.email" placeholder="邮箱"></el-input>
      </el-form-item>

      <el-form-item label="手机" prop="tel">
        <el-input type="text" v-model.number="RegisterForm.tel" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="success"
          class="submitBtn"
          round
          @click.native.prevent="submit"
          :loading="loading"
        >注册</el-button>
        <el-button type="primary" class="loginBtn" round @click.native.prevent="toLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>
<script>
import { Register } from "../main";
export default {
  data() {
    let confirmpasswordCheck = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("密码不能为空"));
      } else if (value !== this.RegisterForm.password) {
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
      RegisterForm: {
        username: "",
        password: "",
        confirmpassword: "",
        tel: "",
        email: "",
      },
      loading: false,
      rule: {
        username: [
          {
            required: true,
            message: "昵称不可为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            min: 6,
            message: "密码不能为空,长度最少6位",
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
      },
    };
  },
  methods: {
    submit() {
      this.$refs.RegisterForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let params = {
            username: this.RegisterForm.username,
            password: this.RegisterForm.password,
            tel: this.RegisterForm.tel.toString(),
            email: this.RegisterForm.email,
          };
          Register(params).then((res) => {
            this.loading = false;
            if (res.data.result == true) {
              this.$message({
                type: "success",
                message: "注册成功",
              });
              this.$notify({
                title: "您的账号是",
                message: res.data.id,
                duration: 0,
              });
              this.$router.push("/login");
            } else {
              //console.log(res.data);
              this.$message.error({
                message: "注册失败,请检查该邮箱或手机是否已经注册",
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
    toLogin() {
      this.$router.push("/login");
    },
  },
};
</script>
<style>
.regform {
  margin: 20px auto;
  width: 700px;
  background: #fff;
  box-shadow: 0 0 8px #b4bccc;
  padding: 20px 30px 30px 30px;
  border-radius: 10px;
}
.submitBtn {
  width: 65%;
}
.to {
  color: #fa5555;
  cursor: pointer;
}
</style>