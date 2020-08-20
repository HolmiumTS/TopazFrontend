<template>
  <div>
    <el-main>
      <el-form
        :model="LoginForm"
        ref="LoginForm"
        :rules="rule"
        label-width="0px"
        class="login-form"
      >
        <h2>登录</h2>
        <el-form-item prop="user">
          <el-input type="text" v-model="LoginForm.user" placeholder="账号、邮箱或手机"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input type="password" v-model="LoginForm.password" placeholder="密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            class="submitBtn"
            round
            @click.native.prevent="submit"
            :loading="loading"
          >登录</el-button>
          <el-button type="primary" class="resetBtn" round @click.native.prevent="toRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>
<script>
import { Login } from "../main";
export default {
  data() {
    return {
      LoginForm: {},
      loading: false,
      rule: {
        user: [
          {
            required: true,
            message: "账号、邮箱或手机不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submit() {
      /*this.$store.dispatch("commitLogin", {
        userId: "123",
        username: this.LoginForm.user,
        avatar: "aaa",
      });
      this.$router.push("/home");*/
      this.$refs.LoginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let params = this.LoginForm;
          Login(params).then((res) => {
            this.loading = false;
            if (res.data.result == true) {
              this.$message({
                type: "success",
                message: "登录成功",
              });
              console.log("logining");
              console.log(res.data.id);
              console.log(res.data.username);
              console.log(res.data.avatar);
              this.$store.dispatch("commitLogin", {
                userId: res.data.id,
                username: res.data.username,
                avatar: res.data.avatar,
              });
              this.$router.push("/home");
            } else if (res.data.result == false) {
              this.$message.error({
                message: "账号、手机号或密码错误",
              });
            } else {
              this.$message.error({
                message: "登录失败，请稍后再试",
              });
            }
          });
        }
      });
    },
    toRegister() {
      this.$router.push("/register");
    },
  },
};
</script>
<style scoped>
.login-form {
  margin: 5% auto;
  width: 310px;
  background: #fff;
  box-shadow: 0 0 8px #b4bccc;
  padding: 20px 30px 30px 30px;
  border-radius: 10px;
}
.submitBtn {
  width: 65%;
}
.plink {
  font-size: 10px;
}
</style>
