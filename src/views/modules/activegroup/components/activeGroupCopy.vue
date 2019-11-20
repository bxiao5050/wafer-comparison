<template>
  <!-- <el-dialog title="复制活动组" custom-class="my-dialog" top="15%" :visible="true" size="tiny" :close-on-click-modal="false" :beforeClose="closeModal" @close="closeModal"> -->
    <div class="my-dialog">
    <h5 class="form-title" slot="title">复制活动组</h5>
    <el-form ref="form" :model="form" label-width="100px" label-position="left" class="my-dialog-form">
      <el-form-item label="请选择活动组:">
        <el-select v-model="form.groupId" class="form-input">
          <el-option v-for="(item,index) in activityGroup" :key="index" :label="item.title" :value="item.groupId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="copyGroup">复制活动组</el-button>
        <el-button type="default" size="small" @click="closeModal">取消</el-button>
    </div>
  <!-- </el-dialog> -->
  </div>
</template>
<script>
import services from '@/services'
export default {
  name: 'active-group-add',
  data() {
    return {
      form: {
        groupId: ''
      }
    }
  },
  computed:{
    activityGroup() {
      return this.$store.state.activityGroup
    },
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    checkParams() {
      if (!this.form.groupId) {
        this.$message({
          message: '请选择活动组',
          type: 'warning'
        })
        return false
      }
      return true
    },
    copyGroup() {
      if (!this.checkParams()) return;
      else {
        let params = {
          groupId:this.form.groupId
        }
        services.activity.copyGroup(params).then(data => {
          if (data.code == 200) {
            this.$notify({
              message: '复制活动组成功!',
              type: 'success'
            })
            this.$emit('close')
            this.$emit('getActivityGroup')
          } else {
            this.$notify({
              message: data.state,
              type: 'warning'
            })
          }
        })
      }
    }
  }

}
</script>
