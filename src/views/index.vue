<template>
  <div class="main">
    <admin-header></admin-header>
    <div class="content-body">
      <admin-sidebar></admin-sidebar>
      <admin-content></admin-content>
    </div>
  </div>
</template>
<script>
import adminHeader from '@/views/layout/adminHeader.vue'
import adminSidebar from '@/views/layout/adminSidebar.vue'
import adminContent from '@/views/layout/adminContent.vue'

export default {
  name: 'index',
  components: {
    'admin-header': adminHeader,
    'admin-sidebar': adminSidebar,
    'admin-content': adminContent
  },
  data: function() {
    return {
      isCollapse: false
    }
  },
  mounted() {
    if (!this.$store.state.userCode) {
      this.$message.warning('用户未登录!')
      this.$router.push({ name: 'login' })
    }
    this.init()
  },
  methods: {
    setCollapse: function() {
      this.isCollapse = !this.isCollapse
    },
    // 初始化数据
    init() {
      // this.getActivityCondition() // 获取活动元数据
      // this.getRewardCondition() // 获取奖励/礼包元数据
      this.getApps() // 获取游戏列表
      this.getActivityGroup() // 获取活动组
    },
    // 获取活动元数据
    getActivityCondition() {
      this.$store.dispatch('getActivityCondition')
    },
    // 获取奖励/礼包元数据
    getRewardCondition() {
      this.$store.dispatch('getRewardCondition')
    },
    // 获取游戏列表
    getApps() {
      this.$store.dispatch('getApps')
    },
    // 获取活动组数据列表
    getActivityGroup() {
      this.$store.dispatch('getActivityGroup')
    }
  }
}
</script>
