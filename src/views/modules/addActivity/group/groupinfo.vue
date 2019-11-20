<template>
  <!-- <el-dialog title="活动组修改" custom-class="my-dialog" top="15%" :visible="true" size="tiny" :close-on-click-modal="false" :beforeClose="closeModal" @close="closeModal"> -->
    <div class="page-form" v-if="editData">
      <div class="dialog-footer">
      <el-button type="primary" size="small" @click="editGroup" :disabled="!isPermiss(selectedGroup.createUser)">修改活动组</el-button>
      <!-- <el-button type="default" size="small" @click="closeModal">取消</el-button> -->
    </div>
    <div class="inline-form">
      <div class="inline-form-item first">
    <el-form ref="form"  :model="form" label-width="100px" label-position="left" class="my-dialog-form">
      <el-form-item label="活动组ID:">
        <span>{{form.groupId}}</span>
      </el-form-item>
      <el-form-item label="活动组名称:">
        <el-input v-model="form.title" class="form-input" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="所属游戏:">
        <el-select v-model="form.appId" class="form-input">
          <el-option v-for="(item,index) in appList" :key="index" :label="item.appName" :value="item.appId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    </div>
    <div class="inline-form-item second">
      <el-form ref="form" :model="form" label-width="100px" label-position="left" class="my-dialog-form">
        <el-form-item>
          <span>白名单配置:</span>
        </el-form-item>
         <el-form-item>
           <div style="width:80px;display:inline-block;">
            <span>正式地址:</span>
           </div>
          <el-input class="form-input" v-model="form.url" placeholder="完整url,如http://xxx.com/path"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-input v-model="formData.ip" style="width: 400px" placeholder="多个ip,隔开"></el-input> -->
          <div style="width:80px;display:inline-block;">
            <span>放行IP列表:</span>
          </div>
          <el-input class="form-input" v-model="form.ips" type="textarea" autosize placeholder="多个ip逗号或换行隔开"></el-input>
            <div class="form-item-tip">
              列表为空，则表示完全对外开放；<br/>
              附：公司内部出口IP如下：<br/>
              39.109.124.40<br/>
              202.83.194.92<br/>
              39.109.120.94<br/>
              45.116.80.213<br/>
              42.200.41.60
            </div>
          
        </el-form-item>
      </el-form>
    </div>
    </div>
  <!-- </el-dialog> -->
  </div>
  <div v-else>活动组信息为空</div>
</template>
<script>
import services from '@/services'
import permiss from '@/services/permiss'
export default {
  name: 'active-group-edit',
  props: ['selectedGroup', 'editData'],
  data() {
    return {
      form: {
        title: '',
        appId: null,
        url: '',
        ips: ''
      }
    }
  },
  computed: {
    userinfo() {
      return this.$store.state.userInfo
    },
    appList() {
      return this.$store.state.appList
    }
  },
  mounted() {
    if (this.editData) {
      this.form = {
        title: this.editData.title,
        appId: this.editData.appId,
        groupId: this.editData.groupId,
        url: this.editData.url?this.editData.url:'',
        ips: this.editData.ips && this.editData.ips != ''
                ? this.editData.ips.split(',').join('\n')
                : '',
        activityList: this.editData.activityList || null
      }
    }
  },
  methods: {
    isPermiss(createUser) {
      return permiss(createUser)
    },
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
      if (!this.checkParams()) return
      else {
        let actInfo = {
          title: this.form.title, // 活动组名称
          appId: this.form.appId, // 所属游戏
          groupId: this.form.groupId, // 活动组Id
          url: this.form.url, // 正式地址
          ips: this.form.ips.split('\n').join(',') //放行IP
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
              title: '提示',
              type: 'success'
            })
            // this.$emit('close')
            this.$emit('getActivityGroup')
          } else {
            this.$notify({
              message: data.state,
              title: '提示',
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
          this.form = {
            title: this.editData.title,
            appId: this.editData.appId,
            groupId: this.editData.groupId,
            url: this.editData.url ? this.editData.url : '',
            ips:
              this.editData.ips && this.editData.ips != ''
                ? this.editData.ips.split(',').join('\n')
                : '',
            activityList: this.editData.activityList || null
          }
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
.inline-form {
  white-space: nowrap;
  overflow-x: auto;
  border-bottom: 1px dashed #ddd;
  margin-bottom: 20px;
  // border-left: 1px dashed #ddd;
  // border-right: 1px dashed #ddd;
  .inline-form-item {
    display: inline-block;
    vertical-align: top;
    &.first {
      width: 560px;
    }
    &.second {
      border-left: 1px dashed #ddd;
      min-width: 600px;
    }
  }
}
</style>
