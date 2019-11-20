<template>
  <div>
    <div class="filters">
      <div class="filter-item">
        <div class="filter-label">活动组:</div>
        <el-select v-model="nowgroup" @change="changeGroup" value-key="groupId" class="filter-content">
          <el-option v-for="(item,index) in activityGroup" :label="item.title" :key="item.groupId" :value="item"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <div class="filter-label">活动:</div>
        <el-select v-model="nowactivity" @change="changeActivity" value-key="activityBase.actId" class="filter-content">
          <el-option v-for="(item,index) in activityList" :key="item.activityBase.actId" :label="item.activityBase.activityName" :value="item"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <div class="filter-label">查询类型:</div>
        <el-select v-model="queryType" style="width:110px">
          <el-option :value="1" label="用户Id"></el-option>
          <el-option :value="2" label="用户名"></el-option>
          <el-option :value="3" label="奖励id"></el-option>
          <el-option :value="4" label="时间"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-input v-model="userInfo" v-if="queryType!=4"></el-input>
        <el-date-picker :clearable="false" v-model="start" v-if="queryType==4" type="datetime" placeholder="选择开始时间">
        </el-date-picker>
        <el-date-picker :clearable="false" v-model="end" v-if="queryType==4" type="datetime" placeholder="选择结束时间">
        </el-date-picker>
        <div class="filter-label"></div>
        <el-button size="small" type="primary" @click="query">查询</el-button>
      </div>
    </div>
    <div class="module-content">
      <el-card>
        <div slot="header">
          <span style="line-height: 30px;">获奖信息</span>
        </div>
        <div class="table-content">
          <el-table ref="multipleTable"  max-height="600" :data="historyList" border tooltip-effect="dark" style="width: 100%;">
            <el-table-column type="index" width="65" label="序号">
            </el-table-column>
            <el-table-column label="id" width="250">
              <template slot-scope="scope">
                {{scope.row.historyId}}
              </template>
            </el-table-column>
            <el-table-column label="活动id" width="250">
              <template slot-scope="scope">
                {{scope.row.actId}}
              </template>
            </el-table-column>
            <el-table-column label="用户id" width="150">
              <template slot-scope="scope">
                {{scope.row.userId}}
              </template>
            </el-table-column>

            <el-table-column label="用户名" width="150">
              <template slot-scope="scope">
                {{scope.row.userName}}
              </template>
            </el-table-column>

            <el-table-column label="奖励id" width="250">
              <template slot-scope="scope">
                {{scope.row.rewardId}}
              </template>
            </el-table-column>
            <el-table-column label="奖励名" width="200">
              <template slot-scope="scope">
                {{scope.row.rewardName}}
              </template>
            </el-table-column>

            <el-table-column v-if="columns.cdKeys" label="cdKey" width="200">
              <template slot-scope="scope">
                {{scope.row.cdKeys}}
              </template>
            </el-table-column>

            <el-table-column v-if="columns.userInfo" label="用户信息" width="200">
              <template slot-scope="scope">
                {{scope.row.userInfo}}
              </template>
            </el-table-column>

            <el-table-column label="获取时间" width="230">
              <template slot-scope="scope">
                {{scope.row.getDate}}
              </template>
            </el-table-column>



          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
  import services from "@/services";
  import moment from "moment";
  export default {
    data(){
      return {
        userInfo: "",
        historyList: [],
        nowgroup: null,
        queryType:1,
        start:null,
        end:null,
        nowactivity: null,
        columns:{
            "historyId":false,
            "userId":false,
            "userName":false,
            "rewardId":false,
            "rewardName":false,
            "getDate":false,
            "thirdGameZoneId":false,
            "actId":false,
            "userInfo":false,
            "cdKeys":false
        }
      }
    },
    computed: {
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
      }
    },
    mounted() {
      this.nowgroup = this.selectedGroup;
      this.nowactivity = this.selectedActivity;
      this.start = moment().hours(0).minutes(0).seconds(0).toDate();
      this.end = moment().add(1,"days").hours(0).minutes(0).seconds(0).toDate();
    },
    methods:{
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
      query(){
        let params = {
          groupId:this.nowgroup.groupId,
          actId: this.nowactivity.activityBase.actId,
          query: this.userInfo,
          type:this.queryType
        };
        if(params.type == 4) {
          params.query = {
            start: moment(this.start).format('YYYY-MM-DD HH:mm:ss'),
            end: moment(this.end).format('YYYY-MM-DD HH:mm:ss')
          };
        }
        services.query.queryGetRewardHistory(params).then(data => {
          if (data.code == 200) {
            this.historyList = data.state;
            if(this.historyList && this.historyList.length > 0){
              for(var name in this.columns){
                this.columns[name] = false;
              }
                this.historyList.forEach((item) =>{
                    for(var name in item){
                      this.columns[name] = true;
                    }
                });
            }
          } else {
            this.$message({
              type: "error",
              message: "查询失败!"
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
  };
</script>
<style lang="scss" scoped>
  .filters {
    padding: 10px 0;
    text-align: left;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    .filter-item {
      padding: 0 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .filter-label {
        max-width: 100px;
        padding: 5px;
        white-space: nowrap;
      }
      .filter-content {
        max-width: 220px;
      }
    }
  }
  .module-content {
    .table-content {
      max-height: 650px;
      .table-expand {
        font-size: 0;
      }
      .table-expand label {
        width: 90px;
        color: #99a9bf;
      }

      .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
      }
    }
  }
  </style>
