<template>
<div>
<el-card>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="邮件发送" name="mail"><mail v-if="activeName=='mail'"/></el-tab-pane>
    <el-tab-pane label="指定中奖用户" name="lotterylist"><lotterylist v-if="activeName=='lotterylist'"/></el-tab-pane>
  </el-tabs>
  </el-card>
  </div>
</template>
<script>
import mail from './components/sendMail.vue'
import lotterylist from './components/lotteryList.vue'
export default {
  components: {
    mail,
    lotterylist
  },
  data() {
    return {
      activeName: 'mail'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
