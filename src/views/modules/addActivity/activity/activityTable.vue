<template>
  <el-table ref="multipleTable" max-height="600" :data="activityList"  border tooltip-effect="dark" style="width: 100%;">
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
             <el-table-column label="操作" width="140" v-show="env">
              <template slot-scope="scope">
                <el-button size="small" v-show="env" type="danger" @click="clearActivityInfo(scope.row)" >清理活动数据</el-button>
              </template>
            </el-table-column>
          </el-table>
</template>
<script>
import services from '@/services'
export default {
  name: 'activityTable',
  props: ['groupId', 'activityList'],
  data() {
    return {
      env: this.$store.state.env,
    }
  },
  methods: {
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
    clearActivityInfo(item) {
      this.$confirm('是否确认清理活动数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          groupId: this.groupId,
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
              type: 'danger',
              message: '清理失败!'
            })
          }
        })
      })
    }
  }
}
</script>
