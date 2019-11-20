<template>
  <div class="login-page">
    <div label-position="left" label-width="50px" class="login-form">
      <div class="form-header">
        <span>{{title}}</span>
      </div>
      <div class="form-body">
        <div class="form-item">
          <label>帐号:</label>
          <input ref="acc" type="text" class="form-control" @keyup.enter="focusToPwd" v-model="account" placeholder="请输入帐号" />
        </div>
        <div class="form-item">
          <label>密码:</label>
          <input ref="pwd" type="password" class="form-control" @keyup.enter="login" v-model="password" placeholder="请输入密码" />
        </div>
        <div class="form-item" style="justify-content: flex-end;padding:0;padding-left:30px;">
          <!-- <label>记住密码:</label> -->
          <el-checkbox v-model="isRemenber">记住密码</el-checkbox>
        </div>
      </div>
      <div class="form-footer">
        <el-button class="login-btn" type="primary" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>
<script>
// import encryptMethod from '@/services/encryptMethod.js'
import { AES, enc } from 'crypto-js'
export default {
  data: function() {
    let env = this.$store.state.env
    return {
      title: env ? '活动管理平台-测试' : '活动管理平台-正式',
      account: '',
      password: '',
      isRemenber: false
    }
  },
  mounted() {
    this.initLocalUserInfo()
  },
  methods: {
    initLocalUserInfo() {
      try {
        let encryptStr = localStorage.cookieUser || ''
        if (!encryptStr) throw 'local info is null'
        let bytes = AES.decrypt(encryptStr, 'activity')
        let decryptedData = JSON.parse(bytes.toString(enc.Utf8))
        this.account = decryptedData.username
        this.password = decryptedData.password
        this.isRemenber = decryptedData.isRemenber
      } catch (e) {
        console.error(e)
        this.account = ''
        this.password = ''
      }
    },
    focusToPwd: function() {
      this.$refs.pwd.focus()
    },
    saveLocalInfo() {
      if (this.isRemenber) {
        /* 用户信息加密存储到本地 */
        let data = {
          username: this.account,
          password: this.password,
          isRemenber: this.isRemenber
        }
        // Encrypt
        localStorage.cookieUser = AES.encrypt(
          JSON.stringify(data),
          'activity'
        ).toString()
        // Decrypt
        // let bytes = AES.decrypt(ciphertext.toString(), 'activity')
        // let decryptedData = JSON.parse(bytes.toString(enc.Utf8))
      } else {
        localStorage.cookieUser = ''
      }
    },
    login: function() {
      if (!this.account || !this.password) {
        this.$message({
          message: '请输入用户名密码',
          type: 'warning'
        })
        return
      }
      this.saveLocalInfo()
      let code = this.account + ':' + this.password
      this.$store.commit('setUserInfo', {
        username: this.account,
        password: this.password
      })
      this.$store.commit('setLoginCode', code)
      this.$router.push({ name: 'addactivity' })
    }
  }
}
</script>
<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100%;
  background-image: url('~@/assets/images/bg.jpg');
  text-align: left;
  position: relative;
  .login-form {
    // margin:0 auto;
    padding: 20px;
    width: 300px;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.3);
    border: 1px solid #fff;
    .form-header {
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      padding: 0 0 20px 0;
    }
    .form-body {
      padding: 0 0 20px 0;
      .form-item {
        line-height: 30px;
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
        padding: 10px 0;
        label {
          white-space: nowrap;
        }
        .form-control {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-color: #fff;
          background-image: none;
          border-radius: 4px;
          border: 1px solid #bfcbd9;
          box-sizing: border-box;
          color: #1f2d3d;
          font-size: inherit;
          height: 36px;
          line-height: 1;
          outline: 0;
          padding: 3px 10px;
          transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          &:hover {
            border-color: #8391a5;
          }
        }
      }
    }
    .form-footer {
      text-align: center;
      // display: block;
      .login-btn {
        width: 100%;
      }
    }
  }
}
</style>
