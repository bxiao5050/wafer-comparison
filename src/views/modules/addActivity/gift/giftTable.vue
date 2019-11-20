<template>
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
          </el-table>
</template>
<script>
export default {
  name:'giftTable',
  props:['giftList']
}
</script>
