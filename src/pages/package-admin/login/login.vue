<template>
  <view class="admin-login">
    <view class="content">
      <view class="header">
        <image
          :src="userProfile.avatar"
          :style="{
            width: '158rpx',
            height: '158rpx',
            borderRadius: '100%',
          }"
        />
      </view>
      <view class="form">
        <cl-form
          :model.sync="form.model"
          :rules="form.rules"
          ref="loginForm"
          label-width="0rpx"
        >
          <cl-form-item v-if="!form.needAuthCode" prop="username">
            <cl-input
              type="text"
              placeholder="用户名/邮箱"
              v-model="form.model.username"
            />
          </cl-form-item>
          <cl-form-item v-if="!form.needAuthCode" prop="password">
            <cl-input
              type="password"
              placeholder="密码"
              v-model="form.model.password"
            />
          </cl-form-item>
          <cl-form-item v-if="form.needAuthCode" prop="authcode">
            <cl-input
              type="number"
              placeholder="两步验证码"
              v-model="form.model.authcode"
              :maxlength="6"
            />
          </cl-form-item>
        </cl-form>
      </view>
      <view class="action">
        <cl-button
          :loading="form.logging"
          type="success"
          @click="form.needAuthCode ? handleLogin() : handleLoginClick()"
          fill
        >
          {{ buttonName }}
        </cl-button>
      </view>
      <view class="footer safe-area-inset-bottom">
        <text>仅供管理员使用</text>
      </view>
    </view>
  </view>
</template>
<script>
// apis
import adminApi from "@/apis/admin/admin";

// libs
import { mapGetters, mapActions } from "vuex";
export default {
  name: "AdminLogin",
  data() {
    const authcodeValidate = (rule, value, callback) => {
      if (!value && this.form.needAuthCode) {
        callback(new Error("请输入两步验证码"));
      } else {
        callback();
      }
    };
    return {
      form: {
        model: {
          authcode: null,
          password: null,
          username: null,
        },
        rules: {
          username: [
            {
              required: true,
              message: "用户名/邮箱不能为空",
              trigger: ["change"],
            },
          ],
          password: [
            { required: true, message: "密码不能为空", trigger: ["change"] },
          ],
          authcode: [{ validator: authcodeValidate, trigger: ["change"] }],
        },
        needAuthCode: false,
        logging: false,
      },
    };
  },
  onReady() {
    this.$refs.loginForm.setRules(this.form.rules);
  },
  computed: {
    ...mapGetters(["userProfile"]),
    buttonName() {
      return this.form.needAuthCode ? "验证" : "登录";
    },
  },
  methods: {
    ...mapActions(["login"]),
    handleLoginClick() {
      const _this = this;
      _this.$refs.loginForm.validate((valid) => {
        if (valid) {
          _this.form.logging = true;
          adminApi
            .loginPreCheck(_this.form.model.username, _this.form.model.password)
            .then((response) => {
              const data = response.data.data;
              if (data && data.needMFACode) {
                _this.form.needAuthCode = true;
                _this.form.model.authcode = null;
              } else {
                _this.handleLogin();
              }
            })
            .finally(() => {
              _this.form.logging = false;
            });
        }
      });
    },
    handleLogin() {
      const _this = this;
      _this.$refs.loginForm.validate((valid) => {
        if (valid) {
          _this.form.logging = true;
          _this
            .login(_this.form.model)
            .then(() => {
              uni.switchTab({
                url: "/pages/package-main/tabbar/blogger",
              });
            })
            .finally(() => {
              _this.form.logging = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss">
page {
  background: #f8f8f8;
}
.admin-login {
  .content {
    padding-left: 70rpx;
    padding-right: 70rpx;
  }

  .header {
    margin-top: 128rpx;
    margin-bottom: 72rpx;
    display: flex;
    justify-content: center;
  }

  .action {
    margin-top: 20rpx;
  }

  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: center;
    text {
      color: $uni-text-color-grey;
      font-size: 24rpx;
    }
  }
}
</style>
