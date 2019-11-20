<template>
  <header class="header">
    <el-popover
  ref="userinfo"
  placement="bottom-end"
  width="200"
  trigger="hover">
  <div>
    <div class="user-info-panel">
      <i class="icon-usered"></i>
      <div>欢迎使用</div>
      <div>{{userInfo.username}}</div>
    </div>
    <div class="user-info-btn-group" @click="exitSystem">
      <el-button type="text" icon="icon-exit">退出</el-button>
    </div>
    
  </div>
</el-popover>

    <div class="sys-info-group">
      <a href="javascript:void(0)">
        <i class="admin-logo icon-system"></i>
        <!-- <img class="admin-logo" src="~@/assets/images/icon.png" alt=""> -->
        <span class="admin-title">{{title}}</span>
      </a>
    </div>
    <div class="header-content">
      <div class="user-group">
        <!-- <div class="list-item">
          <i class="icon-user"></i>
          <span>{{'weiqiang.yu'}}</span>
        </div>
        <div class="list-item" @click="exitSystem">
          <span class="icon-exit"></span>退出
        </div> -->
        <div class="list-item" v-popover:userinfo>
          <i class="icon-user"></i>
        </div>
        <a class="list-item" href="https://gitee.com/the7throad/DuiWaiWenDang/blob/master/docs/activity_m_useage.md" target="_blank">
        <i class="el-icon-question"></i>
          使用手册
        </a>
        <router-link tag="div" :to="{name:'docs'}" class="list-item">
          <i class="icon-info"></i>
          更新日志
        </router-link>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  name: 'adminHeader',
  computed:{
    userInfo() {
      return this.$store.state.userInfo;
    },
    env(){
      return this.$store.state.env;
    },
    title(){
      var env = this.$store.state.env;
      return env?'活动管理平台-测试':'活动管理平台-正式'
    }
  },
  methods: {
    exitSystem: function() {
      // window.msgBox({
      //   content: '确认退出系统？',
      //   type: 'confirm',
      //   confirm: () => {
      //     this.$router.push({ name: 'login' })
      //   }
      // })
      this.$confirm('确认退出系统？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('setIsLogined',false);
        this.$router.push({ name: 'login' })
      })
    }
  }
}
</script>
