/**
 * Created by linlin.zhang on 2017/12/25.
 */
<template>
<el-dialog title="复制活动组" custom-class="my-dialog" top="15%" :visible="true" size="tiny" :close-on-click-modal="false" :beforeClose="closeModal" @close="closeModal">
  <!-- <div class="my-dialog"> -->
  <h5 class="form-title" slot="title">
    <!-- 放行白名单 -->
    设置IP白名单
    </h5>
    <!-- <el-card class="box-card"> -->
      <!-- <div slot="header" class="clearfix">
        <span>添加白名单</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="closeModal">返回</el-button>
      </div> -->
      <el-form :inline="false" :model="formData" class="demo-form-inline">
        <el-form-item label="url:">
          <el-input v-model="formData.path" style="width: 500px" placeholder="相对url"></el-input>
        </el-form-item>
        <el-form-item label="ips:">
          <!-- <el-input v-model="formData.ip" style="width: 400px" placeholder="多个ip,隔开"></el-input> -->
          <el-input type="textarea" v-model="formData.ip" autosize style="width: 500px" placeholder="多个ip逗号或换行隔开"></el-input>
            <!-- <div class="form-item-tip">提示:如设置IP为空,表示完全对外开发,如需要添加公司内部出口IP白名单,使用下方的ip</div>
            <div class="row-item child-group">
            <div class="row-item child-group">
            <div class="form-item-tip">39.109.124.40</div>
            <div class="form-item-tip">202.83.194.92</div>
            <div class="form-item-tip">39.109.120.94</div>
            <div class="form-item-tip">45.116.80.213</div>
            <div class="form-item-tip">42.200.41.60</div>
            </div>
            </div> -->
            <div class="form-item-tip" style="max-width:500px;">
              提示:如设置IP为空,表示完全对外开发,如需要添加公司内部出口IP白名单,使用下方的ip
              <div class="form-item-tip">39.109.124.40</div>
            <div class="form-item-tip">202.83.194.92</div>
            <div class="form-item-tip">39.109.120.94</div>
            <div class="form-item-tip">45.116.80.213</div>
            <div class="form-item-tip">42.200.41.60</div>
            </div>
          
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add">添加</el-button>
        </el-form-item>
      </el-form>
    <!-- </el-card> -->

    <el-card class="box-card" style="margin-top: 30px">
      <div slot="header" class="clearfix">
        <span>放行列表</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="query">查询</el-button>
      </div>
      <el-table :data="list"
                border
                max-height="900"
                style="width: 100%">
        <el-table-column
          fixed
          prop="path"
          label="Path"
          width="400"/>
        <el-table-column
          fixed
          prop="ip"
          label="ip"
          width="400"/>
        <el-table-column label="操作" width="300"  >
          <template slot-scope="scope">
            <el-button type="info" size="small" @click="del(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </el-dialog>
  <!-- </div> -->
</template>
<script>
import services from '@/services'
import permiss from '@/services/permiss'
export default {
  name: 'blackList',
  props: ['selectedGroup'],
  data() {
    return {
      signCode: this.$store.state.signCode,
      list: [],
      formData: {
        gameId: this.selectedGroup.appId,
        path: '',
        ip: '',
        sign: this.$store.state.signCode
      }
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    query() {
      var appId = this.selectedGroup.appId
      var params = { gameId: appId, sign: this.signCode }

      services.blackList.query(params).then(data => {
        if (data.code == 403 || data.code == 404) {
          this.list = []
        } else if (data.code == 200) {
          let result = []
          if (data.data.length == 2) {
            for (var i = 0; i < data.data[1].length; i++) {
              var item = data.data[1][i]
              console.log(item)
              for (var name in item) {
                console.log(name)
                result.push({
                  path: name,
                  ip: item[name].join(',')
                })
              }
            }
          }
          this.list = result
        } else {
          this.$message({
            message: '查询失败',
            type: 'warning'
          })
          return false
        }
      })
    },
    add() {
      if (!this.formData.path || !this.formData.path) {
        this.$message({
          message: '缺少参数',
          type: 'warning'
        })
        return false
      }
      let params = {
        gameId: this.formData.gameId,
        path: this.formData.path,
        ip: this.formData.ip.split('\n').join(','),
        sign: this.formData.sign
      }
      services.blackList.add(params).then(data => {
        if (data.code == 200) {
          this.query()
        } else {
          this.$message({
            message: '查询失败',
            type: 'warning'
          })
          return false
        }
      })
    },
    del(index, item) {
      let params = {
        gameId: this.selectedGroup.appId,
        path: item.path,
        sign: this.$store.state.signCode
      }
      services.blackList.del(params).then(data => {
        if (data.code == 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.query()
        } else {
          this.$message({
            message: '删除失败',
            type: 'warning'
          })
          return false
        }
      })
    }
  }
}
</script>
