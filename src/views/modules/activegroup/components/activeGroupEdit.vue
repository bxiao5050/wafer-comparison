<template>
  <!-- <el-dialog title="活动组修改" custom-class="my-dialog" top="15%" :visible="true" size="tiny" :close-on-click-modal="false" :beforeClose="closeModal" @close="closeModal"> -->
    <div class="my-dialog">
    <h5 class="form-title" slot="title">活动组修改</h5>
    <el-form ref="form" :model="form" label-width="100px" label-position="left" class="my-dialog-form">
      <el-form-item label="活动组名称:">
        <el-input v-model="form.title" class="form-input" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="所属游戏:">
        <el-select v-model="form.appId" class="form-input">
          <el-option v-for="(item,index) in appList" :key="index" :label="item.appName" :value="item.appId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="editGroup">修改活动组</el-button>
      <el-button type="default" size="small" @click="closeModal">取消</el-button>
    </div>
  <!-- </el-dialog> -->
  </div>
</template>
<script>
import services from '@/services'
export default {
  name: 'active-group-edit',
  props: ['editData'],
  data() {
    return {

      form: {
        title: '',
        appId: null
      }
    }
  },
  computed: {
    userinfo(){
      return this.$store.state.userInfo;
    },
    appList() {
      return this.$store.state.appList
    }
  },
  mounted() {
    this.form = {
      title: this.editData.title,
      appId: this.editData.appId,
      groupId: this.editData.groupId,
      activityList: this.editData.activityList || null
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    checkParams() {
      if (!this.form.title) {
        this.$message({
          message: '请输入活动名称',
          type: 'warning'
        })
        return false
      } else if (this.form.appId === null) {
        this.$message({
          message: '请选择所属游戏',
          type: 'warning'
        })
        return false
      }
      return true
    },
    editGroup() {
      if (!this.checkParams()) return;
      else {
        let actInfo = {
          title: this.form.title, // 活动组名称
          appId: this.form.appId, // 所属游戏
          groupId: this.form.groupId, // 活动组Id
        }
        if (this.form.activityList) {
          actInfo.activityList = this.form.activityList
        }
        let params = {
          actInfo: JSON.stringify(actInfo)
        }
        services.activity.updateGroup(params).then(data => {
          if (data.code == 200) {
            this.$notify({
              message: '活动组修改成功!',
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
  },
  watch: {
    editData: {
      deep: true,
      handler(v, ov) {
        if (v != ov) {
          this.form = v
        }
      }
    }
  }

}
</script>
<style lang="scss" scoped>
// .form-input {
//    width: 290px;
// }
// .form-num-input {
//   width: 80px;
//   margin-left: 5px;
// }
// .row-item {
//   padding: 5px 0;
//   display: block;
//   margin: 0;
// }
</style>
