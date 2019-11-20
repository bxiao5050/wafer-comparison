<template>
  <div class="add-activity">
    <div class="category-card">
     <el-card>
        <div slot="header">
          分类
        </div>
        <div class="filter-row">
          <span class="filter-title">游戏:</span>
          <div class="game-list">
          <a class="game-list-item" href="javascript:void(0)" :class="{active:nowgame==-1}" @click="nowgame=-1">全部</a>
          <a class="game-list-item" href="javascript:void(0)" v-for="(item,index) in appList" :key="index" :class="{active:nowgame==item.appId}" @click="nowgame=item.appId">{{item.appName}}</a>
          </div>
        </div>
     </el-card>
     </div>
     <div class="activity-group-card">
     <el-card>
        <div slot="header">
          <span style="line-height: 30px;">活动组列表</span>
          <el-input style="float:right;width:200px;" v-model="searchKey" placeholder="请输入关键字"></el-input>
        </div>
        <div class="activity-group-panel">

          <div class="group-item"  @click="isShowAdd=true">
             <div class="item-icon-group">
               <i class="icon-add-group"></i>
             </div>
             <div class="item-text">添加活动组</div>
             <div class="item-operate"></div>
           </div>

           <div class="group-item"  v-if="isShowAdd">
             <div class="item-remove" @click="cancleAdd">
              <i class="el-icon-close"></i>
            </div>
             <div class="item-icon-group" @mouseover="isShowSubmitBtn=true" @mouseout="isShowSubmitBtn=false">
               <!-- <i class="icon-group" v-if="!isShowSubmitBtn"></i> -->
               <el-button type="primary" size="small" @click="submitAdd" v-if="isShowSubmitBtn||addform.title">提交</el-button>
                <img class="item-image" src="~@/assets/images/group.png" alt="" v-else>
             </div>
             <div class="item-text">
               <div>
                 <el-input type="text" style="width:210px;" v-model="addform.title" placeholder="请在此处输入活动组名称" />
                  <el-select v-model="addform.appId" style="width:210px;" class="form-input" placeholder="请选择游戏">
                    <el-option v-for="(item,index) in appList" :key="index" :label="item.appName" :value="item.appId"></el-option>
                  </el-select>
               </div>
             </div>
           </div>
           
          <div class="group-item" v-for="(item,index) in filterTableData" :key="index">
            <div class="item-remove" @click="deleteGroupConfirm(index,item)" v-if="isPermiss(item.createUser)">
              <i class="el-icon-close"></i>
            </div>
            <div @click="editGroup(item)">
              <div class="item-icon-group">
                 <!-- <i class="icon-group"></i> -->
                 <img class="item-image" src="~@/assets/images/group.png" alt="">
               </div>
               <div class="item-text">
                 <div class="item-name">{{item.title}}</div>
                 <div class="item-game-name">{{getRowGame(item.appId)}}</div>
               </div>
               </div>
             <div class="item-operate">
               <!-- <el-button type="default" size="small" :disabled="!isPermiss(item.createUser)" @click="deleteGroup(item)">白名单</el-button> -->
               <el-button v-if="env" type="primary" size="small" @click="activeGroupCopy(item)">克隆</el-button>
               <el-button v-if="env" type="success" size="small" @click="activeGroupPublic(item)">公布到正式</el-button>
             </div>
          </div>
        </div>
     </el-card>
     </div>
  </div>
</template>
<script>
import services from '@/services'
import permiss from '@/services/permiss'
export default {
  name: 'add-activity-group',
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
      selectedGroup: null,

      isShowSubmitBtn: false,
      addform: {
        title: '',
        appId: null
      },

      nowgame: -1, // -1全部

      activityGroup: []
    }
  },
  computed: {
    userinfo() {
      return this.$store.state.userInfo
    },
    appList() {
      return this.$store.state.appList
    },
    // activityGroup() {
    //   return this.$store.state.activityGroup
    // },
    env() {
      return this.$store.state.env
    },
    filterTableData() {
      // let list = this.activityGroup.filter(item => {
      //   return this.nowgame == item.appId || this.nowgame == -1
      // })
      return this.activityGroup.filter(item => {
        return (
          (this.nowgame == item.appId || this.nowgame == -1) &&
          (item.title.indexOf(this.searchKey) != -1 ||
            item.appId.toString().indexOf(this.searchKey) != -1 ||
            item.groupId.indexOf(this.searchKey) != -1)
        )
      })
    }
  },
  mounted() {
    this.getActivityGroup()
  },
  methods: {
    isPermiss(createUser) {
      return permiss(createUser)
    },
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
    getRowGame(appId) {
      for (let i = 0; i < this.appList.length; i++) {
        if (appId == this.appList[i].appId) {
          return this.appList[i].appName
        }
      }
      return ''
    },
    cancleAdd() {
      this.addform = {
        title: '',
        appId: ''
      }
      this.isShowAdd = false
    },
    checkAddParams() {
      if (!this.addform.title) {
        this.$message({
          message: '请输入活动名称',
          type: 'warning'
        })
        return false
      } else if (this.addform.appId === null) {
        this.$message({
          message: '请选择所属游戏',
          type: 'warning'
        })
        return false
      }
      return true
    },
    submitAdd() {
      if (!this.checkAddParams()) return
      else {
        let params = {
          actInfo: JSON.stringify({
            title: this.addform.title, // 活动组名称
            appId: this.addform.appId // 所属游戏
          })
        }
        services.activity.updateGroup(params).then(data => {
          if (data.code == 200) {
            this.$notify({
              message: '活动组添加成功!',
              type: 'success'
            })
            this.cancleAdd()
            this.getActivityGroup()
          } else {
            this.$notify({
              message: data.state,
              type: 'warning'
            })
          }
        })
      }
    },
    editGroup(item) {
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
            type: 'error',
            message: '删除失败:'+data.state
          })
        }
      })
    },
    showBlackList(index, item) {
      this.selectedGroup = item
      this.isShowBlackList = true
    },
    // 克隆
    activeGroupCopy(item) {
      this.$confirm('确认要克隆活动组 ' + item.title + ' 吗?', '提示').then(() => {
        if (!item.groupId) {
          this.$message.error('活动组ID不存在!')
          return
        }
        let params = {
          groupId: item.groupId
        }
        services.activity.copyGroup(params).then(data => {
          if (data.code == 200) {
            this.$notify({
              message: '复制活动组成功!',
              type: 'success'
            })
            this.getActivityGroup()
          } else {
            this.$notify({
              message: data.state,
              type: 'warning'
            })
          }
        })
      })
    },
    // 公布到正式
    activeGroupPublic(item) {
      this.$confirm('确认要将活动组 ' + item.title + ' 发布到正式吗?', '提示').then(() => {
        if (!item.groupId) {
          this.$message.error('活动组ID不存在!')
          return
        }
        let params = {
          groupId: item.groupId
        }
        services.activity.publicGroup(params).then(data => {
          if (data.code == 200) {
            this.$notify({
              message: '发布活动组成功!',
              type: 'success'
            })
            this.getActivityGroup()
          } else {
            this.$notify({
              message: data.state,
              type: 'warning'
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add-activity {
  .category-card {
    margin-bottom: 20px;
    line-height: 40px;
    .filter-row {
      display: flex;
      .filter-title {
        // float: left;
        padding: 0 20px;
        white-space: nowrap;
      }
      .game-list {
        font-size: 14px;
        // float: left;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        .game-list-item {
          white-space: nowrap;
          color: #949494;
          text-decoration: none;
          padding: 0 10px;
          &:hover,
          &.active {
            color: #329fea;
          }
        }
      }
    }
  }
  .activity-group-card {
    margin-bottom: 20px;
    .activity-group-panel {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      transition: all 0.3s ease;
      .group-item {
        // display: inline-block;
        width: 250px;
        height: 250px;
        border: 1px solid #ddd;
        box-shadow: 1px 1px 5px 1px #ddd;
        border-radius: 5px;
        margin: 20px;
        padding: 15px;
        text-align: center;
        cursor: pointer;
        position: relative;
        transition: all 1s;
        .item-remove {
          position: absolute;
          right: 10px;
          top: 10px;
          z-index: 1;
          &:hover {
            color: red;
          }
        }
        .item-icon-group {
          font-size: 40px;
          padding: 15px;
          box-sizing: border-box;
          width: 100%;
          height: 150px;
          line-height: 150px;
          position: relative;
          .item-image {
            width: 100%;
            height: 100%;
          }
        }
        .item-text {
          font-weight: 700px;
          padding: 10px 0;
          .item-name {
            color: #555;
          }
          .item-game-name {
            color: #aaa;
            font-weight: 700px;
          }
        }
        
        .item-operate {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 0;
        }
        &:hover {
          box-shadow: 1px 2px 10px 2px #aaa;
          // transform: scale(1.01);
          .item-text {
            .item-name {
              color: #329fea;
            }
          }
        }
      }
    }
  }
}
</style>
