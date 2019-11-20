<template>
  <div>
    <transition name="slide-to-left">
     <div v-if="!isShowAdd&&!isShowCopy&&!isShowEdit&&!isShowPublic">
    <div class="filters">
      <div class="filter-item">
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="getActivityGroup">刷新</el-button>
      </div>
      <div class="filter-item">
        <el-button size="small" type="primary" @click="isShowAdd=true">添加活动组</el-button>
        <el-button size="small" v-if="env" type="primary" @click="isShowCopy=true">复制活动组</el-button>
        <el-button size="small" v-if="env" type="success" @click="isShowPublic=true">公布到正式</el-button>
      </div>
    </div>
    <div class="module-content">
      <el-card>
        <div slot="header">
          <span style="line-height: 30px;">活动组列表</span>

          <el-input style="float:right;width:200px;" v-model="searchKey" placeholder="请输入关键字"></el-input>
        </div>
        <div class="table-content">
          <el-table ref="multipleTable"  max-height="600" :data="filterTableData" border tooltip-effect="dark" style="width: 100%">
            <el-table-column type="index" width="65" label="序号">
            </el-table-column>
            <el-table-column prop="groupId" label="活动组ID" width="230">
            </el-table-column>
            <el-table-column prop="title" width="250" label="活动组名称">
            </el-table-column>
            <el-table-column width="160" label="所属游戏">
              <template slot-scope="scope">
                {{getRowGame(scope.row.appId)}}
              </template>
            </el-table-column>
            <el-table-column prop="appId" width="90" label="游戏ID">
            </el-table-column>
            <el-table-column width="95" label="活动数量">
              <template slot-scope="scope">
                {{scope.row.activityList?scope.row.activityList.length:0}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" >
              <template slot-scope="scope">
                <!-- <el-button type="primary" size="small" @click="editGroup(scope.$index, scope.row)" :disabled="!isPermiss(scope.row.createUser)">编辑</el-button> -->
                <!-- <el-button type="primary" size="small" @click="lookActivity(scope.$index, scope.row)">查看活动</el-button> -->
                <el-button type="primary" size="small" @click="editGroup(scope.$index, scope.row)">查看</el-button>
                <!-- <el-button size="small" type="small" @click="showBlackList(scope.$index, scope.row)"  :disabled="!isPermiss(scope.row.createUser)">设置IP白名单</el-button> -->
                <el-button size="small" type="danger" @click="deleteGroupConfirm(scope.$index, scope.row)"  :disabled="!isPermiss(scope.row.createUser)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    </div>
    </transition>
    <transition name="slide-to-right">
      <activeGroupAdd v-if="isShowAdd" @close="isShowAdd=false" @getActivityGroup="getActivityGroup"></activeGroupAdd>
    </transition>
    <transition name="slide-to-right">
    <activeGroupEdit v-if="isShowEdit" :editData="editData" @getActivityGroup="getActivityGroup" @close="isShowEdit=false"></activeGroupEdit>
     </transition>
    <transition name="slide-to-right">
    <activeGroupCopy v-if="isShowCopy" @close="isShowCopy=false" @getActivityGroup="getActivityGroup"></activeGroupCopy>
      </transition>
    <transition name="slide-to-right">
      <activeGroupPublic v-if="isShowPublic" @close="isShowPublic=false" @getActivityGroup="getActivityGroup"></activeGroupPublic>
    </transition>
    <!-- <transition name="slide-to-right"> -->
      <!-- <activityGroupBlackList v-if="isShowBlackList" @close="isShowBlackList=false" :selectedGroup="selectedGroup"></activityGroupBlackList> -->
    <!-- </transition> -->
  </div>
</template>
<script>
import activeGroupAdd from './components/activeGroupAdd.vue'
import activeGroupEdit from './components/activeGroupEdit.vue'
import activeGroupCopy from './components/activeGroupCopy.vue'
import activeGroupPublic from './components/activeGroupPublic.vue'
// import activityGroupBlackList from './components/activityGroupBlackList.vue'
import services from '@/services'
import permiss from '@/services/permiss'
export default {
  name: 'activegroup',
  components: {
    activeGroupAdd,
    activeGroupEdit,
    activeGroupCopy,
    activeGroupPublic,
    // activityGroupBlackList
  },
  data() {
    return {
      isShowAdd: false,
      isShowEdit: false,
      isShowCopy: false,
      isShowPublic: false,
      isShowBlackList: false,
      searchKey: '',
      editData: null,
      tableData: [],
      multipleSelection: [],
      selectedGroup: null
    }
  },
  computed: {
    userinfo() {
      return this.$store.state.userInfo
    },
    appList() {
      return this.$store.state.appList
    },
    activityGroup() {
      return this.$store.state.activityGroup
    },
    env() {
      return this.$store.state.env
    },
    filterTableData() {
      return this.activityGroup.filter(item => {
        return (
          item.title.indexOf(this.searchKey) != -1 ||
          item.appId.toString().indexOf(this.searchKey) != -1 ||
          item.groupId.indexOf(this.searchKey) != -1
        )
      })
    }
  },
  mounted(){
    this.getActivityGroup()
  },
  methods: {
    isPermiss(createUser) {
      return permiss(createUser)
    },
    getActivityGroup() {
      this.$store.dispatch('getActivityGroup')
    },
    getRowGame(appId) {
      for (let i = 0; i < this.appList.length; i++) {
        if (appId == this.appList[i].appId) {
          return this.appList[i].appName
        }
      }
      return ''
    },
    timeFormat(time) {
      return moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
    },
    lookActivity(index, item) {
      this.$store.commit('selectGroup', item)
      this.$router.push({ name: 'activelist' })
    },
    editGroup(index, item) {
      // this.editData = item
      // this.isShowEdit = true
      let routerTo = { name: 'groupset', params: { groupId: item.groupId } }
      this.$router.push(routerTo)
    },
    deleteGroupConfirm(index, item) {
      this.$confirm('是否确认删除该活动组,如活动组下有活动无法删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteGroup(item)
      })
    },
    deleteGroup(item) {
      let params = {
        groupId: item.groupId
      }
      services.activity.groupRemove(params).then(data => {
        if (data.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getActivityGroup()
        } else {
          this.$message({
            type: 'success',
            message: '删除失败!'
          })
        }
      })
    },
    showBlackList(index, item) {
      this.selectedGroup = item
      this.isShowBlackList = true
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


