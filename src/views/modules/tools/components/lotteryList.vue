/**
 * Created by linlin.zhang on 2017/12/15.
 */
<template>
  <div>
    <el-form
      label-width="80px"
      :inline="true"
    >
      <el-form-item label="活动组:">
        <el-select
          v-model="nowgroup"
          @change="changeGroup"
          value-key="groupId"
        >
          <el-option
            v-for="(item,index) in activityGroup"
            :label="item.title"
            :key="item.groupId"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动:">
        <el-select
          v-model="nowactivity"
          @change="changeActivity"
          value-key="activityBase.actId"
        >
          <el-option
            v-for="(item,index) in activityList"
            :key="item.activityBase.actId"
            :label="item.activityBase.activityName"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公布时间:">
        <el-date-picker
          :clearable="false"
          v-model="publicDate"
          type="datetime"
          placeholder="选择公布时间"
        />
      </el-form-item>
      <el-form-item label="获奖id:">
        <el-input v-model="historyId"></el-input>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col
        :span="12"
        :offset="12"
      >
        <el-form
          :inline="true"
          style="float: right"
        >
          <el-form-item>
            <el-button
              type="primary"
              @click="add_random"
            >随机新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="add"
            >新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="info"
              @click="query"
            >查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="module-content">
      <el-card>
        <div slot="header">
          <span style="line-height: 30px;">中奖用户</span>
          <el-button
            type="warning"
            style="float: right"
            @click="remove"
          >删除</el-button>
        </div>
        <div class="table-content">
          <el-table
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            max-height="600"
            :data="historyList"
            border
            tooltip-effect="dark"
            style="width: 100%;"
          >
            <el-table-column
              type="selection"
              width="55"
            >
            </el-table-column>
            <el-table-column
              type="index"
              width="65"
              label="序号"
            >
            </el-table-column>
            <el-table-column
              label="id"
              width="250"
            >
              <template slot-scope="scope">
                {{scope.row.historyId}}
              </template>
            </el-table-column>
            <el-table-column
              label="活动id"
              width="250"
            >
              <template slot-scope="scope">
                {{scope.row.actId}}
              </template>
            </el-table-column>
            <el-table-column
              label="用户id"
              width="150"
            >
              <template slot-scope="scope">
                {{scope.row.userId}}
              </template>
            </el-table-column>

            <el-table-column
              label="区服id"
              width="150"
            >
              <template slot-scope="scope">
                {{scope.row.thirdGameZoneId}}
              </template>
            </el-table-column>
            <el-table-column
              label="用户名"
              width="150"
            >
              <template slot-scope="scope">
                {{scope.row.userName}}
              </template>
            </el-table-column>
            <el-table-column
              label="奖励id"
              width="250"
            >
              <template slot-scope="scope">
                {{scope.row.rewardId}}
              </template>
            </el-table-column>
            <el-table-column
              label="奖励名"
              width="200"
            >
              <template slot-scope="scope">
                {{scope.row.rewardName}}
              </template>
            </el-table-column>
            <el-table-column
              label="显示时间"
              width="200"
            >
              <template slot-scope="scope">
                {{scope.row.showDate}}
              </template>
            </el-table-column>
            <el-table-column
              v-if="columns.cdKeys"
              label="cdKey"
              width="200"
            >
              <template slot-scope="scope">
                {{scope.row.cdKeys}}
              </template>
            </el-table-column>
            <el-table-column
              v-if="columns.userInfo"
              label="用户信息"
              width="200"
            >
              <template slot-scope="scope">
                {{scope.row.userInfo}}
              </template>
            </el-table-column>

            <el-table-column
              label="获取时间"
              width="230"
            >
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
import moment from 'moment';
import services from "@/services";
export default {
  name: "lotteryUser",
  data() {
    return {
      nowgroup: null,
      nowactivity: null,
      publicDate: "",
      historyId: "",
      historyList: [],
      selectedRow: [],
      columns: {
        "historyId": false,
        "userId": false,
        "userName": false,
        "rewardId": false,
        "rewardName": false,
        "getDate": false,
        "thirdGameZoneId": false,
        "actId": false,
        "userInfo": false,
        "cdKeys": false
      }
    };
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
    this.publicDate = moment().hours(0).minutes(0).seconds(0).toDate();
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
    handleSelectionChange(val) {
      this.selectedRow = val;
    },
    remove() {
      let removeIds = this.selectedRow.map(item => { return item.historyId; }).join(",");
      if (!this.nowgroup || !this.nowactivity || !removeIds) {
        this.$message({
          type: "error",
          message: "缺少参数!"
        });
        return;
      }

      let params = {
        groupId: this.nowgroup.groupId,
        actId: this.nowactivity.activityBase.actId,
        history: removeIds,
        showDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        type: 2
      };
      services.query.editLotteryUser(params).then(data => {
        if (data.code == 200) {
          this.query();
        } else {
          this.$message({
            type: "error",
            message: "发送失败!" + data.state
          });
        }
      });
    },
    add_random() {
      if (!this.nowgroup || !this.nowactivity || !this.publicDate) {
        this.$message({
          type: "error",
          message: "缺少参数!"
        });
        return;
      }
      let params = {
        groupId: this.nowgroup.groupId,
        actId: this.nowactivity.activityBase.actId,
        history: Date.now() + '',
        showDate: moment(this.publicDate).format('YYYY-MM-DD HH:mm:ss'),
        type: 3
      };
      services.query.editLotteryUser(params).then(data => {
        if (data.code == 200) {
          this.query()
        } else {
          this.$message({
            type: "error",
            message: "新增失败!" + data.state
          })
        }
      })
    },
    add() {
      if (!this.nowgroup || !this.nowactivity || !this.historyId || !this.publicDate) {
        this.$message({
          type: "error",
          message: "缺少参数!"
        });
        return;
      }
      let params = {
        groupId: this.nowgroup.groupId,
        actId: this.nowactivity.activityBase.actId,
        history: this.historyId,
        showDate: moment(this.publicDate).format('YYYY-MM-DD HH:mm:ss'),
        type: 1
      };
      services.query.editLotteryUser(params).then(data => {
        if (data.code == 200) {
          this.query();
        } else {
          this.$message({
            type: "error",
            message: "新增失败!" + data.state
          });
        }
      });
    },
    query() {
      if (!this.nowgroup || !this.nowactivity) {
        this.$message({
          type: "error",
          message: "缺少参数!"
        });
        return;
      }
      let params = {
        groupId: this.nowgroup.groupId,
        actId: this.nowactivity.activityBase.actId
      };
      services.query.queryLotteryUser(params).then(data => {
        if (data.code == 200) {
          this.historyList = data.state.map(item => {
            var newItem = item.historyBase;
            newItem.showDate = item.showDate;
            return newItem;
          });
          for (var name in this.columns) {
            this.columns[name] = false;
          }
          this.historyList.forEach((item) => {
            for (var name in item) {
              this.columns[name] = true;
            }
          });
        } else {
          this.$message({
            type: "error",
            message: "查询失败!" + data.state
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
<style lang="scss" scoped>
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
