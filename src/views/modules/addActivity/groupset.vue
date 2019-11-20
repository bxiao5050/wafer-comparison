<template>
  <div class="group-info">
    <!--操作栏-->
    <div class="operate-group">
      <div><a class="operate-link" href="javascript:void(0)" @click="$router.back()"> &lt; 活动组 </a> / {{selectedGroup?selectedGroup.title:'未定义'}} </div>
    </div>
    <!--活动组内容-->
    <div class="group-content">
      <el-card>
        <div slot="header">{{selectedGroup?selectedGroup.title:'未定义'}}</div>
      <!--活动列表tabs-->
      <div class="activity-tabs">
        <el-tabs class="common-tabs" type="card" v-model="activeType" @tab-add="openActivityAdd" @tab-remove="deleteActivity" addable>
          <el-tab-pane name="0">
            <span slot="label"><i class="icon-info"></i> 活动组信息</span>
          </el-tab-pane>
          <el-tab-pane v-for="(item,index) in activityList" :key="index" closable :name="item.activityBase.actId">
            <span slot="label" :title="getActivityState(item.activityBase).content">
              <i class="icon-circle" :class="getActivityState(item.activityBase).type"></i>
               <!-- {{item.activityBase.activityName}} -->
               活动{{'-'+item.activityBase.index}}
               <!-- ({{getActivityState(item.activityBase).content}}) -->

               <!-- <el-tag :type="getActivityState(item.activityBase).type">
                 {{getActivityState(item.activityBase).content}}
               </el-tag> -->
               </span>
          </el-tab-pane>

          <!--添加新活动-->
          <el-tab-pane closable name="new" v-if="isShowActivityAdd">
            <span slot="label"><i class="icon-activity"></i> 新活动</span>
          </el-tab-pane>
        </el-tabs>
        <!-- <el-button class="add-btn" icon="el-icon-plus" size="mini" @click="openActivityAdd">添加活动</el-button> -->
      </div>
      <el-card class="activity-card">
        <!--某个活动组的内容配置-->
      <div v-if="activeType==='0'">
        <!--活动组配置-->
        <groupInfo v-if="isShowGroup" :selectedGroup="selectedGroup" :editData="selectedGroup" @getActivityGroup="getActivityGroup"></groupInfo>
        <activityTable :groupId="groupId" :activityList="activityList"></activityTable>
        </div>
      <div class="gift-tabs" v-else>
         <el-tabs type="card" class="common-tabs" v-model="giftType" @tab-add="openGiftAdd" @tab-remove="deleteGift" addable>
          <el-tab-pane name="0">
            <span slot="label"><i class="icon-info"></i> 活动信息</span>
          </el-tab-pane>
          <el-tab-pane v-for="(item,index) in giftList" :key="index" closable :name="item.rewardBase.rewardId">
            <span slot="label">
              <i class="icon-gift"></i> 
              <!-- {{item.rewardBase.rewardName}} -->
              礼包{{'-'+item.rewardBase.index}}
              </span>
          </el-tab-pane>

          <!--添加新礼包-->
          <el-tab-pane closable name="new" v-if="isShowGiftAdd">
            <span slot="label"><i class="icon-gift"></i> 新礼包</span>
          </el-tab-pane>
        </el-tabs>
        <!-- <el-button class="add-btn" icon="el-icon-plus" size="mini" @click="openGiftAdd">添加礼包</el-button> -->
      </div>
      <!--添加活动表单-->
      <div v-if="activeType==='new'">
        <activityInfoAdd v-if="isShowActivity" :selectedGroup="selectedGroup" @close="closeActivityAdd" @getActivityInfo="getActivityInfo" @formchange="isEditing=true"></activityInfoAdd>
      </div>
      <!--某个活动的活动内容配置-->
      <div v-if="activeType!=='0'&&activeType!=='new'&&giftType==='0'">
        <!--活动配置-->
        <activityInfo v-if="isShowActivity" :selectedGroup="selectedGroup" :editData="selectedActivity" @getActivityInfo="getActivityInfo" @formchange="isEditing=true"></activityInfo>
        <giftTable :giftList="giftList"></giftTable>
      </div>
      <!--某个活动的礼包内容配置-->
      <div class="config-panel" v-if="activeType!='0'&&activeType!=='new'&&giftType!='0'&&giftType!='new'">
        <!--礼包配置-->
        <giftInfo v-if="isShowGift" :activityInfo="activityInfo" :selectedGroup="selectedGroup" :selectedActivity="selectedActivity" :actId="activeType" :editData="selectedGift" @getActivityInfo="getActivityInfo" @formchange="isEditing=true"></giftInfo>
      </div>
      <!--添加礼包表单-->
      <div v-if="giftType==='new'">
        <giftInfoAdd v-if="isShowGift" :activityInfo="activityInfo" :selectedGroup="selectedGroup" :selectedActivity="selectedActivity" :actId="activeType" @close="closeGiftAdd" @getActivityInfo="getActivityInfo" @formchange="isEditing=true"></giftInfoAdd>
      </div>
      </el-card>
      </el-card>
    </div>
  </div>
</template>
<script>
import services from '@/services'
import permiss from '@/services/permiss'
import groupInfo from './group/groupinfo'
import activityTable from './activity/activityTable'
import activityInfo from './activity/activityinfo'
import activityInfoAdd from './activity/activityinfoAdd'
import giftTable from './gift/giftTable'
import giftInfo from './gift/giftinfo'
import giftInfoAdd from './gift/giftinfoAdd'
export default {
  name: 'group-info',
  components: {
    groupInfo,
    activityTable,
    activityInfo,
    activityInfoAdd,
    giftTable,
    giftInfo,
    giftInfoAdd
  },
  props: {
    groupId: {
      type: String
    }
  },
  data() {
    return {
      activeType: '0',
      giftType: '0',

      // nowgroup: null,
      activityGroup: [],
      activityInfo: [],

      isShowGroup: true, // 利用vue的v-if删除和重建组件的dom
      isShowActivity: false, // 利用vue的v-if删除和重建组件的dom
      isShowActivityAdd: false,
      isShowGift: false, // 利用vue的v-if删除和重建组件的dom
      isShowGiftAdd: false,

      isEditing: false // 当前操作的表单是否修改 监听formchange 事件触发
    }
  },
  computed: {
    // 游戏信息列表
    appList() {
      return this.$store.state.appList
    },
    // 选中的活动组信息
    selectedGroup() {
      let group = null
      this.activityGroup.forEach(item => {
        if (item.groupId == this.groupId) {
          group = item
        }
      })
      return group
    },
    selectedActivity() {
      let activity = null
      this.activityList.forEach(item => {
        if (item.activityBase) {
          if (item.activityBase.actId == this.activeType) {
            activity = item
          }
        }
      })
      return activity
    },
    selectedGift() {
      let gift = null
      this.giftList.forEach(item => {
        if (item.rewardBase) {
          if (item.rewardBase.rewardId == this.giftType) {
            gift = item
          }
        }
      })
      return gift
    },
    // 活动的完整信息
    // activityInfo() {
    //   return this.$store.state.activityInfo
    // },
    // 活动基本信息
    activityList() {
      return this.activityInfo && this.activityInfo.activityDecoratorList
        ? this.activityInfo.activityDecoratorList
        : []
    },
    giftList() {
      let list = []
      this.activityList.forEach(item => {
        if (this.activeType == item.activityBase.actId) {
          list = item.rewardDecoratorList
        }
      })
      return list
    }
  },
  mounted() {
    // this.nowgroup = this.selectedGroup ? this.selectedGroup : null
    this.getActivityGroup()
    this.getActivityInfo()
  },
  methods: {
    // 获取活动组列表
    getActivityGroup() {
      services.activity.getAllGroup({}).then(data => {
        if (data.code == 200) {
          this.activityGroup = data.state
        } else {
          this.$notify({
            message: data.message || data,
            type: 'warning'
          })
        }
      })
    },
    // 根据活动组ID获取活动
    getActivityInfo() {
      // this.$store.dispatch('getActivityInfo', this.groupId)
      if (!this.groupId) {
        this.$notify({
          message: '请选择活动组!',
          type: 'warning'
        })
        return
      }
      let params = {
        actId: this.groupId
      }
      services.activity.getGroup(params).then(data => {
        if (data.code == 200) {
          this.activityInfo = data.state
          // commit('setActivityInfo', data.state)
        } else {
          this.$notify({
            message: data.message,
            type: 'warning'
          })
        }
      })
    },
    getRowGame(appId) {
      for (let i = 0; i < this.appList.length; i++) {
        if (appId == this.appList[i].appId) {
          return this.appList[i].appName
        }
      }
      return ''
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
          type: 'default',
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
    // 打开添加活动选项卡
    openActivityAdd() {
      this.isShowActivityAdd = true
      this.activeType = 'new'
    },
    // 删除活动或移除添加活动选项卡
    deleteActivity(tagName) {
      if (tagName === 'new') {
        this.closeActivityAdd()
      } else if (tagName === '0') {
        return
      } else {
        this.$confirm('确认要删除该活动吗?', '提示').then(() => {
          let params = {
            groupId: this.groupId,
            actId: tagName
          }
          services.activity.activityRemove(params).then(data => {
            if (data.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.activeType = '0'
              this.getActivityInfo()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败:' + data.state
              })
            }
          })
        })
      }
    },
    // 关闭添加活动表单选项
    closeActivityAdd() {
      this.isShowActivityAdd = false
      this.activeType = '0' // 切换到活动组信息
    },
    // 打开添加礼包选项卡
    openGiftAdd() {
      this.isShowGiftAdd = true
      this.giftType = 'new'
    },
    // 删除礼包或移除添加礼包选项卡
    deleteGift(tagName) {
      if (tagName === 'new') {
        this.closeGiftAdd()
      } else if (tagName === '0') {
        return
      } else {
        this.$confirm('确认要删除该礼包吗?', '提示').then(() => {
          let params = {
            groupId: this.groupId,
            actId: this.activeType,
            rewardId: tagName
          }
          services.activity.rewardRemove(params).then(data => {
            if (data.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.giftType = '0'
              this.getActivityInfo()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败:' + data.state
              })
            }
          })
        })
      }
    },
    // 关闭添加礼包表单选项
    closeGiftAdd() {
      this.isShowGiftAdd = false
      this.giftType = '0' // 切换到活动信息
    }
  },
  watch: {
    activeType(v, ov) {
      if (v != ov) {
        this.isShowActivity = false
        this.giftType = '0'
        this.$nextTick(function() {
          this.isShowActivity = true
        })
      }
    },
    giftType(v, ov) {
      if (v != ov) {
        this.isShowGift = false
        this.$nextTick(function() {
          this.isShowGift = true
        })
      }
    }
  }
}
</script>
<style lang="scss">
.group-info {
  .group-content {
    .common-tabs {
      .el-tabs__header {
        margin: 0 !important;
      }
      .el-tabs__new-tab {
        background: #66b1ff;
        color: #fff;
      }
    }
    .activity-card {
      border-top: 0;
    }
  }
}
</style>

<style lang="scss" scoped>
.group-info {
  .operate-group {
    padding: 20px 0;
    color: #949494;
    .operate-link {
      color: #329fea; //#949494;
      text-decoration: none;
    }
  }
  .group-content {
    // .el-tabs .el-tabs__header {
    //   margin: 0 !important;
    // }
    // .activity-tabs,.gift-tabs{
    //   display: flex;
    //   justify-content: space-between;
    //   align-items: flex-start;
    //   .add-btn{
    //     margin: 7px 0 7px 10px;
    //   }
    // }
  }
  .icon-circle {
    &.warning {
      color: #e6a23c;
    }
    &.gray {
      color: #909399;
    }
    &.default {
      color: #909399;
    }
    &.success {
      color: #67c23a;
    }
    &.primary {
      color: #409eff;
    }
  }
}
</style>
