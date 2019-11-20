<template>
  <div class="my-dialog">
    <h5 class="form-title" slot="title">活动配置</h5>
    <el-form ref="form" :model="form" label-width="100px" label-position="left" class="my-dialog-form" v-if="form">
      <el-form-item label="活动名称:">
        <el-input v-model="form.activityName" class="form-input" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="活动时间:">
        <el-date-picker :clearable="false" :default-value="defaultDate"  v-model="form.date[0]" type="datetime"
          placeholder="选择开始时间">
        </el-date-picker>
        <el-date-picker :clearable="false" :default-value="defaultDate"  v-model="form.date[1]" type="datetime"
          placeholder="选择结束时间">
        </el-date-picker>
        <!-- :picker-options="dateOption"-->
      </el-form-item>
      <el-form-item label="活动类别:">
        <el-radio-group v-model="form.rewardType" >
          <el-radio :label="1">抽奖</el-radio>
          <el-radio :label="2">直接领取</el-radio>
          <!-- <el-radio :label="3">消耗品</el-radio> -->
          <el-radio :label="4">邀请/召回</el-radio>
        </el-radio-group>
        <div class="form-item-tip">注意:切换活动类别后需要重新配置条件</div>
      </el-form-item>
      <el-form-item label="活动状态:">
        <el-switch v-model="form.state"  active-text="正常" inactive-text="暂停" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="活动说明:">
        <el-input type="textarea" :row="2" v-model="form.ActivityDescription"  placeholder="请输入活动说明" />
      </el-form-item>
      <el-form-item label="条件配置:">
        <!--活动类型不为邀请召回-->
        <normalCondition v-if="form.rewardType!=4" :selectedList="selectedList"  :config="config" @changePercent="changePercent" @changeSelectedList="changeSelectedList"></normalCondition>
        <!--活动类型为邀请召回-->
        <el-collapse v-model="inviteType" v-if="form.rewardType==4">
          <el-collapse-item title="邀请人" :name="1">
            <normalCondition :selectedList="selectedList1"  :config="specialConfig.config1" @changePercent="changePercent" @changeSelectedList="changeSelectedList1"></normalCondition>
          </el-collapse-item>
          <el-collapse-item title="被邀请人" :name="2">
            <normalCondition :selectedList="selectedList2"  :config="specialConfig.config2" @changePercent="changePercent" @changeSelectedList="changeSelectedList2"></normalCondition>
          </el-collapse-item>
        </el-collapse>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div style="float:left;" v-if="uploadPercent">
        <span>进度:</span>
        <el-progress style="display:inline-block;width:250px;" :percentage="uploadPercent"></el-progress>
      </div>
      <el-button type="primary" size="small" @click="confirmEdit" :disabled="!isPermiss(selectedGroup.createUser)">修改活动</el-button>
      <el-button type="default" size="small" @click="closeModal">取消</el-button>
    </div>
  </div>
</template>
<script>
import services from "@/services";
import normalCondition from "./normalCondition.vue";
import activityConfig from "./activityConfig";
import conditionCheck from "../../../../services/conditionCheck";
import permiss from '@/services/permiss'
export default {
  name: "active-edit",
  props: ["groupId", "editData"],
  components: {
    normalCondition
  },
  data() {
    return {

      form: null, //固定表单数据

      selectedList: [], // 选中列表
      selectedList1: [], // 选中列表 邀请人
      selectedList2: [], // 选中列表 被邀请人

      config: [], // 常规条件 (抽奖，直接领取，消耗品)
      specialConfig: {
        config1: [], // 邀请
        config2: [] // 召回
      }, // 特殊条件 邀请/召回
      inviteType: [1,2],

      loading: null, // loading
      // dateOption: {
      //   disabledDate: (date) => {
      //     let now = new Date()
      //     return moment(date) < moment([now.getFullYear(), now.getMonth(), now.getDate()])
      //   }
      // },

      uploadPercent: 0 // 上传文件loading状态
    };
  },
  computed: {
    userinfo(){
      return this.$store.state.userInfo;
    },
    selectedGroup() {
      return this.$store.state.selectedGroup;
    },
    defaultDate() {
      let now = new Date();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      return now;
    }
//    ,
//    activityIsTimeOut() {
//      if (
//        this.editData.activityBase.startTime &&
//        this.editData.activityBase.endTime
//      ) {
//        let now = moment();
//        let start = moment(this.editData.activityBase.startTime);
//        let end = moment(this.editData.activityBase.endTime);
//        if (now > end) {
//          this.$notify({
//            type: "warning",
//            customClass: "custom-notify",
//            message: "活动已结束"
//          });
//          return true;
//        }
//        return false;
//      }
//      return true;
//    }
  },
  mounted() {
    this.form = {
      actId: this.editData.activityBase.actId,
      activityName: this.editData.activityBase.activityName,
      state: this.editData.activityBase.state,
      date: [
        this.editData.activityBase.startTime,
        this.editData.activityBase.endTime
        // moment(new Date(this.editData.activityBase.startTime)).format('YYYY-MM-DD HH:mm:ss'),
        // moment(new Date(this.editData.activityBase.endTime)).format('YYYY-MM-DD HH:mm:ss')
      ],
      rewardType: this.editData.activityBase.rewardType || null,
      ActivityDescription: this.editData.activityBase.activityDescription || ""
    };
    // this.config = JSON.parse(JSON.stringify(activityConfig.normal));
    // this.specialConfig = {
    //   config1: JSON.parse(JSON.stringify(activityConfig.special)),
    //   config2: JSON.parse(JSON.stringify(activityConfig.special))
    // };
    this.initConfig();
    // this.initConditionList()
  },
  methods: {
    isPermiss(createUser){
      return permiss(createUser);
    },
    initConfig() {
      this.config = JSON.parse(JSON.stringify(activityConfig.normal));
      this.specialConfig = {
        config1: JSON.parse(JSON.stringify(activityConfig.special)),
        config2: JSON.parse(JSON.stringify(activityConfig.special))
      };
    },
    initConditionList() {
      this.selectedList = [];
      this.selectedList1 = [];
      this.selectedList2 = [];
      if (this.editData.andList) {
        this.editData.andList.forEach(listitem => {
          if (this.form.rewardType == 4) {
            this.specialConfig.config1.forEach(item => {
              // 接口参数替换
              if (item.conditionId == listitem.conditionId) {
                this.replaceObj(item, listitem);
                this.selectedList1.push(item.conditionId);
              }
            });
          } else {
            this.config.forEach(item => {
              // 接口参数替换
              if (item.conditionId == listitem.conditionId) {
                this.replaceObj(item, listitem);
                this.selectedList.push(item.conditionId);
              }
            });
          }
        });
      }
      if (this.editData.inviteList) {
        this.editData.inviteList.forEach(listitem => {
          if (this.form.rewardType == 4) {
          this.specialConfig.config2.forEach(item => {
            // 接口参数替换
            if (item.conditionId == listitem.conditionId) {
                this.replaceObj(item, listitem);
                this.selectedList2.push(item.conditionId);
              }
          });
          }
        });
      }
    },
    changePercent(num) {
      this.uploadPercent = num;
    },
    changeSelectedList(list) {
      this.selectedList = list;
    },
    changeSelectedList1(list) {
      this.selectedList1 = list;
    },
    changeSelectedList2(list) {
      this.selectedList2 = list;
    },
    closeModal() {
      this.$emit("close");
    },
    replaceObj(obj, rep) {
      for (let i in obj) {
        for (let j in rep) {
          if (i === j) {
            obj[i] = rep[j];
          }
        }
      }
    },
    checkDisabled(list, item) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] == item.conditionId) return false;
      }
      return true;
    },
    getConfigParams(selectedList, config) {
        let conditionList = [];
        for(let i = 0;i<selectedList.length;i++){
          let itemId = selectedList[i];
          for(let j = 0 ; j< config.length;j++ ){
            let condition = config[j];
            if(condition.conditionId == itemId){
              let conditionCreate = conditionCheck[itemId];
              if(conditionCreate){
                let result = conditionCreate.conditionCheck("activity",condition);
                if(result.result){
                  conditionList.push(result.data);
                }else{
                  this.$message({
                    message: result.msg,
                    type: "warning"
                  });
                  return false;
                };
              }
            }
          }
      }
      return conditionList;
    },
    checkParams() {
      if (!this.form.activityName) {
        this.$message({
          message: "请输入活动名称",
          type: "warning"
        });
        return false;
      } else if (!this.form.date[0] || !this.form.date[1]) {
        this.$message({
          message: "请选择活动时间",
          type: "warning"
        });
        return false;
      } else if (!this.form.rewardType) {
        this.$message({
          message: "请选择活动类别",
          type: "warning"
        });
        return false;
      }
      return true;
    },
    confirmEdit() {
      if (!this.checkParams()) return;
      let now = moment();
      let start = moment(this.form.date[0]);
      let end = moment(this.form.date[1]);
      if (now > end) {
        this.$confirm("当前活动已结束,继续修改可能导致活动数据重置,是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.editActivity();
        });
      } else if (now > start) {
        this.$confirm("当前活动正在进行中,继续修改可能导致活动异常,是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.editActivity();
        });
      } else {
        this.editActivity();
      }
    },
    getAndList(){
      if(this.form.rewardType == 4){
        return this.getConfigParams(this.selectedList1 , this.specialConfig.config1)
      } else {
        return this.getConfigParams(this.selectedList , this.config)
      }
    },
    getInviteList(){
      if(this.form.rewardType == 4){
        return this.getConfigParams(this.selectedList2 , this.specialConfig.config2)
      } else {
        return []
      }
    },
    editActivity() {
      let andList = this.getAndList()
      let inviteList = this.getInviteList()
      if(!andList||!inviteList) return;

      let params = {
        groupId: this.groupId,
        conditionInfo: JSON.stringify({
          actId: this.form.actId,
          actName: this.form.activityName,
          state: this.form.state,
          start: moment(this.form.date[0]).format("YYYY-MM-DD HH:mm:ss"),
          end: moment(this.form.date[1]).format("YYYY-MM-DD HH:mm:ss"),
          rewardType: this.form.rewardType,
          ActivityDescription: this.form.ActivityDescription, // 活动说明
          andConditions: andList,
          inviteConditions: inviteList
        })
      };
      services.activity.updateActivity(params).then(data => {
        if (data.code == 200) {
          this.$notify({
            message: "活动修改成功!",
            type: "success"
          });
          this.$emit("close");
          this.$emit("getActivityInfo");
        } else {
          this.$notify({
            message: data.state,
            type: "warning"
          });
        }
      });
    },
    // uploadBefore(file) {
    //   const isLt2M = file.size / 1024 / 1024 < 1;
    //   if (!isLt2M) {
    //     this.$message.error("上传文件大小不能超过 1MB!");
    //   } else {
    //     this.loading = this.$loading({
    //       fullscreen: true,
    //       customClass: "my-loading"
    //     });
    //   }
    //   return isLt2M;
    // },
    // //上传成功
    // uploadSuccess(res, file) {
    //   this.loading.close();
    //   this.uploadPercent = 0;
    //   this.$message({
    //     message: "上传成功",
    //     type: "success"
    //   });
    //   this.config.forEach(item => {
    //     if (item.conditionId == "ce59f4f3-75c9-472b-bfe7-0280405df206") {
    //       //固定玩家资格配置
    //       item.importId = res.state;
    //     }
    //   });
    // },
    // //上传失败
    // uploadError(res, file) {
    //   this.loading.close();
    //   this.uploadPercent = 0;
    //   this.$message.error("上传失败");
    // },
    // //上传进度事件
    // uploadProgress(event, file) {
    //   let load = event.loaded;
    //   let total = event.total;
    //   this.uploadPercent = Number((load / total * 100).toFixed(0));
    // }
  },
  watch: {
    editData: {
      deep: true,
      handler(v, ov) {
        if (v != ov) {
          this.form = v;
        }
      }
    },
    "form.rewardType": function(v, ov) {
      if (v != ov) {
        if(!ov){ //当初始化时
        this.initConditionList();
        } else{
          this.selectedList = []
          this.selectedList1 = []
          this.selectedList2 = []
        }
        // this.initConfig()
      }
    }
  }
};
</script>
<style lang="scss" scoped>
// .my-dialog{
//   .dialog-footer{
//     // background-color:#EEE;
//     text-align: right;
//     margin-bottom: 50px;
//   }
// }
.my-dialog-form {
  .el-dropdown-link {
    cursor: pointer;
    color: #20a0ff;
  }
} // .form-input {
//   width: 290px;
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
