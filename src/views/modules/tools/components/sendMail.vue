<template>
  <el-form label-width="100px" label-position="left" class="my-dialog-form">
    <el-form-item label="所属游戏:">
      <el-select v-model="appId" class="form-input">
        <el-option v-for="(item,index) in appList" :key="index" :label="item.appName" :value="item.appId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="活动组:">
    <el-select v-model="nowgroup" @change="changeGroup" value-key="groupId">
      <el-option v-for="(item,index) in activityGroup" :label="item.title" :key="item.groupId" :value="item"></el-option>
    </el-select>
    </el-form-item>
    <el-form-item label="活动:">
      <el-select v-model="nowactivity" @change="changeActivity" value-key="activityBase.actId" >
        <el-option v-for="(item,index) in activityList" :key="item.activityBase.actId" :label="item.activityBase.activityName" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="奖励:">
      <el-select v-model="nowreward" value-key="rewardBase.rewardId" >
        <el-option v-for="(item,index) in giftList" :key="item.rewardBase.rewardId" :label="item.rewardBase.rewardName" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="用户id">
      <el-input v-model="userId"></el-input>
    </el-form-item>
    <el-form-item label="区服id">
      <el-input v-model="gameZoneId"></el-input>
    </el-form-item>
    <el-form-item label="玩家id">
      <el-input v-model="playerId"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">发送到玩家</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import moment from 'moment';
  import services from "@/services";
  export default {
    name: "sendMail",
    data() {
      return {
        nowgroup: null,
        nowactivity: null,
        nowreward:null,
        appId: null,
        userId:null,
        gameZoneId:null,
        playerId:null
      };
    },
    computed: {
      appList() {
        return this.$store.state.appList;
      },
      selectedGroup() {
        return this.$store.state.selectedGroup;
      },
      selectedActivity() {
        return this.$store.state.selectedActivity;
      },
      activityGroup() {
        return this.$store.state.activityGroup;
      },
      activityInfo() {
        return this.$store.state.activityInfo;
      },
      activityList() {
        let list =
          this.activityInfo && this.activityInfo.activityDecoratorList
            ? this.activityInfo.activityDecoratorList
            : [];
        return list;
      },
      giftList() {
        let list = [];
        // list = this.nowactivity ? this.nowactivity.rewardDecoratorList : []
        if (this.nowactivity) {
            return this.nowactivity.rewardDecoratorList;
        }
      }
    },
    mounted() {
      this.nowgroup = this.selectedGroup;
      this.nowactivity = this.selectedActivity;
      this.start = moment().hours(0).minutes(0).seconds(0).toDate();
      this.end = moment().add(1,"days").hours(0).minutes(0).seconds(0).toDate();
    },
    methods: {
      changeGroup(item) {
        this.$store.commit("selectGroup", item);
        this.getActivityInfo();
      },
      changeActivity(item) {
        this.$store.commit("selectActivity", item);
      },
      getActivityInfo() {
        if (!this.nowgroup) return;
        this.$store.dispatch("getActivityInfo", this.nowgroup.groupId);
      },
      onSubmit(){
          if(!this.appId||!this.nowreward||!this.userId||!this.gameZoneId||!this.playerId){
            this.$message({
              type: "error",
              message: "缺少参数!"
            });
            return ;
          }
          console.log(this.nowreward);
          let params = {
            appId:this.appId,
            rewardId:this.nowreward.rewardBase.rewardId,
            userId:this.userId,
            gameZoneId:this.gameZoneId,
            playerId:this.playerId
          };
        services.query.sendMail(params).then(data => {
            if(data.code == 200){
              this.$message({
                type: "success",
                message: "发送成功!"
              });
            }else{
              this.$message({
                type: "error",
                message: "发送失败!" + data.state
              });
            }
        });
      }
    },
    watch: {
      selectedGroup: {
        deep: true,
        handler(v, ov) {
          if (v != ov) {
            this.nowgroup = this.selectedGroup;
          }
        }
      },
      selectedActivity: {
        deep: true,
        handler(v, ov) {
          if (v != ov) {
            this.nowactivity = this.selectedActivity;
          }
        }
      }
    }
  }
</script>
