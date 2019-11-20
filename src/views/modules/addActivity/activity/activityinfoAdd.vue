<template>
  <div class="page-form">
    <!-- <h5 class="form-title" slot="title">添加活动</h5> -->
    <div class="dialog-footer">
      <el-button type="primary" size="small" @click="addActivity" :disabled="!isPermiss(selectedGroup.createUser)">添加活动</el-button>
      <!-- <el-button type="default" size="small" @click="closeModal">取消</el-button> -->
    </div>
    <div class="inline-form">
      <div class="inline-form-item first">
    <el-form ref="form" :model="form" label-width="100px" label-position="left" class="my-dialog-form">
      <el-form-item label="活动名称:">
        <el-input v-model="form.activityName" class="form-input" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="活动时间:">
        <!-- <el-date-picker class="form-input" :clearable="false" v-model="form.date" type="datetimerange" placeholder="选择日期范围">
                    </el-date-picker>
                  :picker-options="dateOption"
                 -->
        <el-date-picker :clearable="false" style="width:200px" :default-value="defaultDate" v-model="form.date[0]" type="datetime" placeholder="选择开始时间">
        </el-date-picker>
        <el-date-picker :clearable="false" style="width:200px" :default-value="defaultDate" v-model="form.date[1]" type="datetime" placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动类别:">
        <el-radio-group v-model="form.rewardType">
          <el-radio :label="1">抽奖</el-radio>
          <el-radio :label="2">直接领取</el-radio>
          <!-- <el-radio :label="3">消耗品</el-radio> -->
          <el-radio :label="4">邀请/召回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动状态:">
        <el-switch v-model="form.state" active-text="正常" inactive-text="暂停" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="排序:">
        <el-input v-model="form.index" class="form-num-input" placeholder="序号"></el-input>
        <div class="form-item-tip">注意:请按照活动顺序配置序号</div>
      </el-form-item>
      <el-form-item label="活动说明:">
        <el-input type="textarea" class="form-input" v-model="form.ActivityDescription" :row="2" placeholder="请输入活动说明" />
      </el-form-item>
    </el-form>
    </div>
    </div>
  </div>
</template>
<script>
import services from '@/services'
import permiss from '@/services/permiss'
export default {
  name: 'active-add',
  props: ['selectedGroup'],
  data() {
    return {
      form: {
        activityName: '',
        date: [null, null],
        rewardType: 0,
        state: 0,
        index: 0, //序号
        ActivityDescription: ''
      },

      dateOption: {
        disabledDate: date => {
          let now = new Date()
          return (
            moment(date) <
            moment([now.getFullYear(), now.getMonth(), now.getDate()])
          )
        }
      },
      isLoaded: false
    }
  },
  computed: {
    defaultDate() {
      let now = new Date()
      now.setHours(0)
      now.setMinutes(0)
      now.setSeconds(0)
      return now
    }
    // userinfo(){
    //   return this.$store.state.userInfo;
    // },
    // selectedGroup() {
    //   return this.$store.state.selectedGroup;
    // }
    // activityIsTimeOut() {
    //   if (this.form.date[0] && this.form.date[1]) {
    //     let now = moment()
    //     let start = moment(this.form.date[0])
    //     let end = moment(this.form.date[1])
    //     if (now > end) {
    //       return true
    //     }
    //     return false
    //   }
    //   return true
    // }
  },
  mounted() {
    setTimeout(() => {
      this.isLoaded = true
    })
  },
  methods: {
    isPermiss(createUser) {
      return permiss(createUser)
    },
    closeModal() {
      this.$emit('close')
    },
    checkParams() {
      if (!this.form.activityName) {
        this.$message({
          message: '请输入活动名称',
          type: 'warning'
        })
        return false
      } else if (!this.form.date[0] || !this.form.date[1]) {
        this.$message({
          message: '请选择活动时间',
          type: 'warning'
        })
        return false
      } else if (moment(this.form.date[0]) > moment(this.form.date[1])) {
        this.$message({
          message: '开始时间不能大于结束时间',
          type: 'warning'
        })
        return false
      } else if (this.form.index === '') {
        this.$message({
          message: '请输入活动序号',
          type: 'warning'
        })
        return false
      }
      return true
    },
    addActivity() {
      if (!this.checkParams()) return
      else {
        let params = {
          groupId: this.selectedGroup.groupId,
          conditionInfo: JSON.stringify({
            actName: this.form.activityName, // 活动名称
            start: moment(this.form.date[0]).format('YYYY-MM-DD HH:mm:ss'), // 活动开始时间
            end: moment(this.form.date[1]).format('YYYY-MM-DD HH:mm:ss'), // 活动结束时间
            rewardType: this.form.rewardType, //活动类型
            ActivityDescription: this.form.ActivityDescription, // 活动说明
            index: this.form.index,
            state: this.form.state
          })
        }
        services.activity.updateActivity(params).then(data => {
          if (data.code == 200) {
            this.$notify({
              message: '活动添加成功!',
              type: 'success'
            })
            this.$emit('close')
            this.$emit('getActivityInfo')
          } else {
            this.$notify({
              message: data.state || '请求失败!',
              type: 'warning'
            })
          }
        })
      }
    }
  },
  watch: {
    form: {
      deep: true,
      handler(v, ov) {
        if (this.isLoaded) {
          this.$emit('formchange')
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// .form-input {
//   width: 290px;
// }
// .form-num-input {
//   width: 80px;
//   margin-left: 5px;
// }
// .form-tip-desc {
//   font-size: 10px;
//   color: #bbb;
//   display: block;
//   line-height: 20px;
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
    }
  }
}
</style>
