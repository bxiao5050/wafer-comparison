<template>
  <div class="my-dialog">
    <h5 class="form-title" slot="title">添加活动</h5>
    <el-form ref="form" :model="form" label-width="100px" label-position="left" class="my-dialog-form">
      <el-form-item label="活动名称:">
        <el-input v-model="form.activityName" class="form-input" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="活动时间:">
        <!-- <el-date-picker class="form-input" :clearable="false" v-model="form.date" type="datetimerange" placeholder="选择日期范围">
                    </el-date-picker>
                  :picker-options="dateOption"
                 -->
        <el-date-picker :clearable="false" :default-value="defaultDate" v-model="form.date[0]" type="datetime" placeholder="选择开始时间">
        </el-date-picker>
        <el-date-picker :clearable="false" :default-value="defaultDate" v-model="form.date[1]" type="datetime" placeholder="选择结束时间">
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
      <el-form-item label="活动说明:">
        <el-input type="textarea" v-model="form.ActivityDescription" :row="2" placeholder="请输入活动说明" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="addActivity" :disabled="!isPermiss(selectedGroup.createUser)">添加活动</el-button>
      <el-button type="default" size="small" @click="closeModal">取消</el-button>
    </div>
  </div>
</template>
<script>
  import services from '@/services'
  import permiss from '@/services/permiss'
  export default {
    name: 'active-add',
    props: ['groupId'],
    data() {
      return {
        form: {
          activityName: '',
          date: [null, null],
          rewardType: 0,
          state: 0,
          ActivityDescription: ''
        },

        dateOption: {
          disabledDate: (date) => {
            let now = new Date()
            return moment(date) < moment([now.getFullYear(), now.getMonth(), now.getDate()])
          }
        }
      }
    },
    computed: {

      defaultDate() {
        let now = new Date()
        now.setHours(0)
        now.setMinutes(0)
        now.setSeconds(0)
        return now
      },
      userinfo(){
        return this.$store.state.userInfo;
      },
      selectedGroup() {
        return this.$store.state.selectedGroup;
      }
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
    methods: {
      isPermiss(createUser){
        return permiss(createUser);
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
        }
        return true
      },
      addActivity() {
        if (!this.checkParams()) return;
        else {
          let params = {
            groupId: this.groupId,
            conditionInfo: JSON.stringify({
              actName: this.form.activityName, // 活动名称
              start: moment(this.form.date[0]).format('YYYY-MM-DD HH:mm:ss'), // 活动开始时间
              end: moment(this.form.date[1]).format('YYYY-MM-DD HH:mm:ss'), // 活动结束时间
              rewardType: this.form.rewardType, //活动类型
              ActivityDescription: this.form.ActivityDescription, // 活动说明
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
</style>
