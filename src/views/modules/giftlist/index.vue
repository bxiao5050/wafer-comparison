<template>
  <div>
    <transition name="slide-to-left">
       <div v-if="!isShowAdd&&!isShowEdit">
    <div class="filters">
      <div class="filter-item">
        <el-button size="small" type="warning" @click="$router.push({name:'activelist'})">返回活动</el-button>
      </div>
    </div>
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
        <el-button size="small" type="primary" @click="getActivityInfo" icon="el-icon-refresh">刷新</el-button>
        <el-button size="small" type="primary" @click="addGift">添加礼包</el-button>
      </div>
    </div>
    <div class="module-content">
      <el-card>
        <div slot="header">
          <span style="line-height: 30px;">礼包列表</span>

          <el-input style="float:right;width:200px;" v-model="searchKey" placeholder="请输入关键字"></el-input>
        </div>
        <div class="table-content">
          <el-table ref="multipleTable"  max-height="600" :data="giftList" border tooltip-effect="dark" style="width: 100%;">
            <el-table-column type="index" width="65" label="序号">
            </el-table-column>
            <el-table-column label="礼包ID" width="320">
              <template slot-scope="scope">
                {{scope.row.rewardBase.rewardId}}
              </template>
            </el-table-column>
            <el-table-column label="礼包名称">
              <template slot-scope="scope">
                {{scope.row.rewardBase.rewardName}}
              </template>
            </el-table-column>
            <el-table-column prop="giftType" label="礼包类型">
              <template slot-scope="scope">
                {{scope.row.rewardBase.goodsType==1?'cdkey':(scope.row.rewardBase.goodsType==2?'消耗品':(scope.row.rewardBase.goodsType==3?'邮件':'实物'))}}
              </template>
            </el-table-column>
            <el-table-column prop="giftCount" label="礼包数量">
              <template slot-scope="scope">
                {{scope.row.rewardBase.sumCount}}
              </template>
            </el-table-column>
            <el-table-column prop="giftCount" label="当前领取数量">
              <template slot-scope="scope">
                {{scope.row.rewardBase.currentCount}}
              </template>
            </el-table-column>
            <el-table-column label="礼包领取情况">
              <template slot-scope="scope">
                <!-- {{scope.row.rewardBase.sumCount!=0?(scope.row.rewardBase.currentCount/scope.row.rewardBase.sumCount).toFixed(2):0}} -->
                <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.rewardBase.sumCount!=0?Number((scope.row.rewardBase.currentCount/scope.row.rewardBase.sumCount).toFixed(2))*100:0"></el-progress>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="editGift(scope.$index, scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteGift(scope.$index, scope.row)" :disabled="!isPermiss(selectedGroup.createUser)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
       </div>
       </transition>
       <transition name="slide-to-right">
    <giftAdd v-if="isShowAdd" :groupId="nowgroup.groupId" :actId="nowactivity.activityBase.actId" @close="isShowAdd=false" @getActivityInfo="getActivityInfo"></giftAdd>
       </transition>
       <transition name="slide-to-right">
    <giftEdit v-if="isShowEdit" :groupId="nowgroup.groupId" :actId="nowactivity.activityBase.actId" :editData="editData" @close="isShowEdit=false" @getActivityInfo="getActivityInfo"></giftEdit>
       </transition>
  </div>
</template>
<script>
import giftAdd from './components/giftAdd.vue'
import giftEdit from './components/giftEdit.vue'
import services from '@/services'
import permiss from '@/services/permiss'
export default {
  name: 'giftlist',
  components: {
    giftAdd,
    giftEdit
  },
  data() {
    return {
      date: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      isShowAdd: false,
      isShowEdit: false,
      editData: null,
      activeSelect: null,
      tableData: [],

      nowgroup: null,
      nowactivity: null,

      searchKey: ''
    }
  },
  computed: {
    selectedGroup() {
      return this.$store.state.selectedGroup
    },
    userinfo() {
      return this.$store.state.userInfo
    },
    selectedActivity() {
      return this.$store.state.selectedActivity
    },
    activityGroup() {
      return this.$store.state.activityGroup
    },
    activityInfo() {
      return this.$store.state.activityInfo
    },
    activityList() {
      let list =
        this.activityInfo && this.activityInfo.activityDecoratorList
          ? this.activityInfo.activityDecoratorList
          : []
      return list
    },
    giftList() {
      let list = []
      // list = this.nowactivity ? this.nowactivity.rewardDecoratorList : []
      if (this.nowactivity) {
        this.activityList.forEach(item => {
          if (this.nowactivity.activityBase.actId == item.activityBase.actId) {
            list = item.rewardDecoratorList
          }
        })
        list = list.filter(item => {
          return item.rewardBase.rewardName.indexOf(this.searchKey) != -1
        })
      }
      return list
    }
  },
  mounted() {
    this.nowgroup = this.selectedGroup
    this.nowactivity = this.selectedActivity
  },
  methods: {
    isPermiss(createUser) {
      return permiss(createUser)
    },
    changeGroup(item) {
      this.$store.commit('selectGroup', item)
      this.getActivityInfo()
    },
    changeActivity(item) {
      this.$store.commit('selectActivity', item)
      this.getActivityInfo()
    },
    getActivityInfo() {
      if (!this.nowgroup) return
      this.$store.dispatch('getActivityInfo', this.nowgroup.groupId)
    },
    addGift() {
      if (this.nowgroup && this.nowactivity) {
        this.isShowAdd = true
      } else {
        this.$message({
          message: '请选择活动组和活动',
          type: 'warning'
        })
      }
    },
    editGift(index, item) {
      this.editData = item
      this.isShowEdit = true
    },
    deleteGift(index, item) {
      this.$confirm('是否确认删除该礼包?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removerReward(item)
      })
    },
    removerReward(item) {
      let params = {
        groupId: this.nowgroup.groupId,
        actId: this.nowactivity.activityBase.actId,
        rewardId: item.rewardBase.rewardId
      }
      services.activity.rewardRemove(params).then(data => {
        if (data.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getActivityInfo()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    }
  },
  watch: {
    selectedGroup: {
      deep: true,
      handler(v, ov) {
        if (v != ov) {
          this.nowgroup = this.selectedGroup
        }
      }
    },
    selectedActivity: {
      deep: true,
      handler(v, ov) {
        if (v != ov) {
          this.nowactivity = this.selectedActivity
        }
      }
    }
  }
}
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

