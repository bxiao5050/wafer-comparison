<template>
  <div>
     <transition name="slide-to-left">
       <div v-if="!isShowAdd&&!isShowEdit">
    <div class="filters">
      <div class="filter-item">
        <el-button size="small" type="warning" @click="$router.push({name:'activegroup'})">返回活动组</el-button>
      </div>
    </div>
    <div class="filters">
      <div class="filter-item">
        <div class="filter-label">活动组:</div>
        <el-select v-model="nowgroup" @change="changeGroup" class="filter-content" value-key="groupId">
          <el-option v-for="(item,index) in activityGroup" :label="item.title" :key="item.groupId" :value="item"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-button size="small" type="primary" @click="getActivityInfo" icon="el-icon-refresh">刷新</el-button>
      </div>
      <div class="filter-item">
        <el-button size="small" type="primary" @click="addActivity">添加活动</el-button>
      </div>
    </div>
    <div class="module-content">
      <el-card>
        <div slot="header">
          <span style="line-height: 30px;">活动列表</span>

          <el-input style="float:right;width:200px;" v-model="searchKey" placeholder="请输入关键字"></el-input>
        </div>
        <div class="table-content" >
          <el-table ref="multipleTable" max-height="600" :data="filterTableData"  border tooltip-effect="dark" style="width: 100%;">
            <el-table-column type="index" width="65" label="序号">
            </el-table-column>
            <el-table-column label="活动ID" width="230">
              <template slot-scope="scope">
                {{scope.row.activityBase.actId}}
              </template>
            </el-table-column>
            <el-table-column label="活动名称" width="240">
              <template slot-scope="scope">
                {{scope.row.activityBase.activityName}}
              </template>
            </el-table-column>
            <el-table-column label="活动时间" width="340">
              <template slot-scope="scope">
                <!-- <el-tag type="success"></el-tag> -->
                {{timeFormat(scope.row.activityBase.startTime)}} - {{timeFormat(scope.row.activityBase.endTime)}}
                <!-- <el-tag type="success"></el-tag> -->
              </template>
            </el-table-column>
            <el-table-column label="活动状态" width="100">
              <template slot-scope="scope">
                <el-tag :type="getActivityState(scope.row.activityBase).type">{{getActivityState(scope.row.activityBase).content}}</el-tag>
                <!-- {{getActivityState(scope.row.activityBase)}} -->
              </template>
            </el-table-column>
            <el-table-column label="活动礼包">
              <template slot-scope="scope">
                {{scope.row.rewardDecoratorList.length}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="400">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="editActivity(scope.$index, scope.row)">活动配置</el-button>
                <el-button type="primary" size="small" @click="lookGift(scope.$index, scope.row)">查看礼包</el-button>
                <el-button size="small" v-show="env" type="danger" @click="clearActivityInfo(scope.row)" >清理活动数据</el-button>
                <el-button size="small" type="danger" @click="deleteActivityConfirm(scope.$index, scope.row)" :disabled="!isPermiss(selectedGroup.createUser)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    </div>
     </transition>
     <transition name="slide-to-right">
        <activeAdd v-if="isShowAdd" :groupId="nowgroup.groupId" @close="isShowAdd=false" @getActivityInfo="getActivityInfo"></activeAdd>
     </transition>
     <transition name="slide-to-right">
       <activeEdit v-if="isShowEdit" :groupId="nowgroup.groupId" :editData="editData" @close="isShowEdit=false" @getActivityInfo="getActivityInfo"></activeEdit>
     </transition>
    <!-- <activeEdit v-if="isShowEdit" :groupId="nowgroup.groupId" :editData="editData" @close="isShowEdit=false" @getActivityInfo="getActivityInfo"></activeEdit> -->
  </div>
</template>
<script>
import activeAdd from './components/activeAdd.vue'
import activeEdit from './components/activeEdit.vue'
import permiss from '@/services/permiss'
import services from '@/services'
export default {
  name: 'activelist',
  components: {
    activeAdd,
    activeEdit
  },
  data() {
    return {
      date: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      isShowAdd: false,
      isShowEdit: false,
      searchKey: '',
      env: this.$store.state.env,
      nowgroup: null,

      editData: null

      // activityInfo: null
    }
  },
  computed: {
    userinfo() {
      return this.$store.state.userInfo
    },
    selectedGroup() {
      return this.$store.state.selectedGroup
    },
    activityGroup() {
      return this.$store.state.activityGroup
    },
    filterTableData() {
      let list = []
      list =
        this.activityInfo && this.activityInfo.activityDecoratorList
          ? this.activityInfo.activityDecoratorList
          : []
      list = list.filter(item => {
        return item.activityBase.activityName.indexOf(this.searchKey) != -1
      })
      return list
    },
    activityInfo() {
      return this.$store.state.activityInfo
    }
  },
  mounted() {
    this.nowgroup = this.selectedGroup ? this.selectedGroup : null
    this.getActivityInfo()
  },
  methods: {
    isPermiss(createUser) {
      return permiss(createUser)
    },
    changeGroup(item) {
      this.$store.commit('selectGroup', item)
      this.getActivityInfo()
    },
    timeFormat(time) {
      return moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
    },
    getActivityState(item) {
      let now = moment()
      let start = moment(item.startTime)
      let end = moment(item.endTime)
      if (now < start) {
        if (item.state == 1) {
          return {
            type: 'primary',
            content: '未开始'
          }
        } else {
          return {
            type: 'gray',
            content: '未开启'
          }
        }
      } else if (now > end) {
        return {
          type: 'info',
          content: '已结束'
        }
      } else if (now > start && now < end) {
        if (item.state == 1) {
          return {
            type: 'success',
            content: '进行中'
          }
        } else {
          return {
            type: 'warning',
            content: '暂停中'
          }
        }
      }
    },
    getActivityInfo() {
      if (!this.nowgroup) return
      this.$store.dispatch('getActivityInfo', this.nowgroup.groupId)
    },
    lookGift(index, item) {
      this.$store.commit('selectActivity', item)
      this.$router.push({ name: 'giftlist' })
    },
    addActivity() {
      if (this.nowgroup) {
        this.isShowAdd = true
      } else {
        this.$message({
          message: '请选择活动组',
          type: 'warning'
        })
      }
    },
    editActivity(index, item) {
      this.editData = item
      this.isShowEdit = true
    },
    clearActivityInfo(item) {
      this.$confirm('是否确认清理活动数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          groupId: this.nowgroup.groupId,
          actId: item.activityBase.actId
        }
        services.activity.clearActivityInfo(params).then(data => {
          if (data.code == 200) {
            this.$message({
              type: 'success',
              message: '清理成功!'
            })
          } else {
            this.$message({
              type: 'success',
              message: '清理失败!'
            })
          }
        })
      })
    },
    deleteActivityConfirm(index, item) {
      this.$confirm('是否确认删除该活动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteActivity(item)
      })
    },
    deleteActivity(item) {
      let params = {
        groupId: this.nowgroup.groupId,
        actId: item.activityBase.actId
      }
      services.activity.activityRemove(params).then(data => {
        if (data.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getActivityInfo()
        } else {
          this.$message({
            type: 'success',
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
