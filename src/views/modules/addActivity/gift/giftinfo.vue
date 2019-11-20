<template>
  <!-- <el-dialog custom-class="my-dialog" top="5%" :visible="true" size="tiny" :close-on-click-modal="false" :beforeClose="closeModal" -->
  <!-- @close="closeModal"> -->
  <div
    class="page-form giftinfo"
    v-if="editData"
  >
    <div
      slot="footer"
      class="dialog-footer"
    >
      <div
        style="float:left;"
        v-if="uploadPercent"
      >
        <span>进度:</span>
        <el-progress
          style="display:inline-block;width:250px;"
          :percentage="uploadPercent"
        ></el-progress>
      </div>
      <el-button
        type="primary"
        size="small"
        @click="editGift"
        :disabled="!isPermiss(selectedGroup.createUser)"
      >修改礼包</el-button>
      <!-- <el-button type="default" size="small" @click="closeModal">取消</el-button> -->
    </div>
    <!-- <h5 class="form-title" slot="title">修改礼包</h5> -->
    <div class="inline-form">
      <div class="inline-form-item first">
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          label-position="left"
          class="my-dialog-form"
        >
          <el-form-item label="礼包ID:">
            <span>{{form.rewardId}}</span>
          </el-form-item>
          <el-form-item label="礼包名称:">
            <el-input
              v-model="form.rewardName"
              class="form-input"
              placeholder="请输入礼包名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="礼包类型:">
            <el-radio-group v-model="form.goodsType">
              <el-radio :label="1">cdkeys</el-radio>
              <el-radio :label="2">消耗品</el-radio>
              <el-radio :label="3">邮件</el-radio>
              <el-radio :label="4">实物</el-radio>
              <el-radio :label="5">奖池钻石</el-radio>
            </el-radio-group>
            <div class="form-item-tip">消耗品：礼包可获取如积分、票数等其他活动依赖的消耗品；邮件：需游戏提供接口支持，可直接发送到游戏内邮箱</div>
          </el-form-item>
          <el-form-item
            label="激活码上传:"
            v-if="form.goodsType==1"
          >
            <div
              v-for="(item,index) in form.goodsList"
              class="row-item"
            >
              <div
                :title="'文件名:'+item.fileName"
                class="active-code-file-name"
              >{{item.fileName?item.fileName.slice(item.fileName.indexOf('_')+1):'文件名不存在'}}</div>
              <div class="active-code-time-list">
                <div title="开始时间">{{item.start}}</div>
                <div title="结束时间">{{item.end}}</div>
              </div>
              <!-- <el-tag :type="item.resource?'success':'warning'" title="状态">{{item.resource?'已上传':'未上传'}}</el-tag> -->
              是否修改重置:
              <el-tooltip
                :content="'isReload:'+item.isReload"
                placement="top"
              >
                <el-switch
                  v-model="item.isReload"
                  :active-value="true"
                  :inactive-value="false"
                > </el-switch>
              </el-tooltip>
              <el-button
                type="default"
                size="small"
                @click="form.goodsList.splice(index,1)"
              >删除</el-button>
            </div>
            <div class="row-item">
              <el-date-picker
                :clearable="false"
                :default-value="defaultDate"
                style="width:200px;"
                v-model="list.start"
                type="datetime"
                placeholder="选择开始时间"
              >
              </el-date-picker>
              <el-date-picker
                :clearable="false"
                :default-value="defaultDate"
                style="width:200px;"
                v-model="list.end"
                type="datetime"
                placeholder="选择结束时间"
              >
              </el-date-picker>
              <el-upload
                class="upload-demo"
                name="uploadfile"
                :headers="headers"
                :action="requestUrl+'/admin/upload/resource'"
                style="display:inline;"
                :show-file-list="false"
                :on-success="uploadCodeSuccess"
                :before-upload="uploadCodeBefore"
                :on-error="uploadCodeError"
                :on-progress="uploadCodeProgress"
              >
                <el-button
                  type="primary"
                  size="small"
                  :disabled="activeCodeUploadCheck()"
                  title="请先选择开始时间和结束时间，且开始时间不能大于结束时间"
                >上传</el-button>
                <div
                  slot="tip"
                  class="form-item-tip"
                >只能上传txt文件</div>
              </el-upload>
            </div>
            <div class="row-item">
              <el-tag
                type="'warning"
                v-if="form.goodsList&&form.goodsList.length==0"
              >未上传</el-tag>
            </div>
          </el-form-item>

          <el-form-item
            label="概率:"
            v-if="activityType!==1"
          >
            <div class="row-item">
              <el-input
                v-model="form.rate"
                class="form-input percentageCls"
                @change="formRateChanged"
              >
                <template slot="append">%</template>
              </el-input>
            </div>
          </el-form-item>

          <el-form-item label="礼包数量:">
            <div class="row-item">
              <el-input
                v-model="form.sumCount"
                class="form-input"
              ></el-input>
            </div>
            <!-- <el-tag type="info">限制礼包产出数量，若活动类型为抽奖，产出完成后不再参与概率计算</el-tag> -->
            <div class="form-item-tip">
              限制礼包产出数量，若活动类型为抽奖，产出完成后不再参与概率计算
            </div>
          </el-form-item>
          <el-form-item
            label="概率基数:"
            v-if="activityType==1"
          >
            <el-input
              class="form-num-input"
              style="margin:0;"
              v-model="form.percent"
            />
            <div class="row-item">
              <!-- <el-tag type="info">活动下该礼包的概率占比-计算公式：总概率=礼包1概率+礼包2概率+礼包3概率..... 总概率可大于100</el-tag> -->
              <div class="form-item-tip">
                抽奖概率：基数须为整数，实际概率 = 概率基数 /（礼包1概率基数+...+礼包N概率基数）;
              </div>
            </div>
          </el-form-item>
          <!-- <el-form-item label="当前数量:">
        <el-input v-model="form.currentCount" class="form-input"></el-input>
      </el-form-item> -->
          <el-form-item label="排序:">
            <el-input
              v-model="form.index"
              class="form-num-input"
              placeholder="序号"
            ></el-input>
            <div class="form-item-tip">排序:排序尽量与页面从上到下的排序或逻辑排序一致，方便一一对应。</div>
          </el-form-item>
          <el-form-item label="礼包ICON:">
            <el-upload
              class="avatar-uploader"
              name="uploadfile"
              :headers="headers"
              :action="requestUrl+'/admin/upload/resource'"
              :show-file-list="false"
              :on-progress="uploadAvtarProgress"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-error="handleAvatarError"
            >
              <img
                v-if="this.form.image"
                :src="requestUrl+'/admin/image/get?resourceId='+this.form.image"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </el-upload>
          </el-form-item>
          <template v-if="form.goodsType===5">
            <!-- 
            <div v-for="(item,index) in editData.rewardBase.contentList">
              <div v-if="index===0"> -->
            <el-form-item label="钻石比例:">
              <el-input
                v-model="goodsType5.diamondPercent"
                class="form-num-input percentageCls"
              >
                <div slot="append">%</div>
              </el-input>
              <!-- <div class="form-item-tip">注意:请按照礼包顺序配置序号</div> -->
            </el-form-item>
            <el-form-item label="奖池初始值:">
              <el-input
                v-model="goodsType5.initCount"
                class="form-num-input"
              ></el-input>
              <!-- <div class="form-item-tip">注意:请按照礼包顺序配置序号</div> -->
            </el-form-item>
            <el-form-item label="奖池增长:">
              <el-input
                v-model="goodsType5.diamondIncrease"
                class="form-num-input"
              ></el-input>
              <!-- <div class="form-item-tip">注意:请按照礼包顺序配置序号</div> -->
            </el-form-item>
            <el-form-item label="奖池上限:">
              <el-input
                v-model="goodsType5.maxCount"
                class="form-num-input"
              ></el-input>
              <!-- <div class="form-item-tip">注意:请按照礼包顺序配置序号</div> -->
            </el-form-item>
            <!-- </div>
            </div> -->

          </template>
          <template v-else-if="form.goodsType!=0">
            <!--当类型为cdkey和邮件时，礼包内容可以为多个-->
            <el-form-item
              label="礼包内容:"
              v-if="form.goodsType==1||form.goodsType==3"
            >
              <div
                v-for="(item,index) in form.contentList"
                class="row-item"
              >
                {{item.name}} * {{item.count}} * {{item.limit}}
                <el-button
                  type="default"
                  size="small"
                  @click="form.contentList.splice(index,1)"
                >删除</el-button>
              </div>
              <div class="row-item">
                <el-input
                  size="small"
                  style="width:70px"
                  class="form-num-input"
                  v-model="content.name"
                  placeholder="物品"
                >
                </el-input>
                <el-input
                  size="small"
                  style="width:70px"
                  class="form-num-input"
                  v-model="content.count"
                  placeholder="数量"
                >
                </el-input>
                <el-input
                  size="small"
                  style="width:100px"
                  class="form-num-input"
                  v-model="content.limit"
                  placeholder="可领取上限"
                >
                </el-input>
                <el-button
                  type="primary"
                  size="small"
                  :disabled="!content.name||!content.count"
                  @click="pushContentList"
                >添加</el-button>
              </div>
            </el-form-item>
            <!--当类型为消耗品时，礼包内容只能配一个-->
            <el-form-item
              label="消耗品数量:"
              v-if="form.goodsType==2"
            >
              <div
                v-for="(item,index) in form.contentList"
                class="row-item"
              >
                {{item.name}} * {{item.count}}
                <el-button
                  type="default"
                  size="small"
                  @click="form.contentList.splice(index,1)"
                >删除</el-button>
              </div>
              <div
                class="row-item"
                v-if="form.contentList.length<1"
              >
                消耗品*
                <el-input
                  class="form-num-input"
                  v-model="content.count"
                  placeholder="数量"
                >
                </el-input>
                <el-button
                  type="primary"
                  size="small"
                  :disabled="!content.count"
                  @click="pushContentList"
                >添加</el-button>
              </div>
            </el-form-item>
            <!--当类型为邮件时显示-->
            <el-form-item
              label="邮件奖励内容:"
              v-if="form.goodsType==3"
            >
              <table
                v-if="form.emailList.length>0"
                style="text-align:center"
              >
                <thead>
                  <tr>
                    <th>奖励id</th>
                    <th>奖励类型</th>
                    <th>奖励名称</th>
                    <th>奖励数量</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in form.emailList">
                    <td>{{item.rewardId}}</td>
                    <td>{{item.type}}</td>
                    <td>{{item.rewardName}}</td>
                    <td>{{item.count}}</td>
                    <td>
                      <el-button
                        type="default"
                        size="small"
                        @click="form.emailList.splice(index,1)"
                      >删除</el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="row-item">
                <el-input
                  class="form-num-input"
                  v-model="emailObj.rewardId"
                  placeholder="奖励id"
                >
                </el-input>
                <el-input
                  class="form-num-input"
                  v-model="emailObj.type"
                  placeholder="奖励类型"
                >
                </el-input>
                <el-input
                  class="form-num-input"
                  v-model="emailObj.rewardName"
                  placeholder="奖励名称"
                >
                </el-input>
                <el-input
                  class="form-num-input"
                  v-model="emailObj.count"
                  placeholder="奖励数量"
                >
                </el-input>
                <el-button
                  type="primary"
                  size="small"
                  :disabled="!emailObj.rewardId||!emailObj.type||!emailObj.rewardName||!emailObj.count"
                  @click="pushEmailList"
                >添加</el-button>
              </div>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <div class="inline-form-item second">
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          label-position="left"
          class="my-dialog-form"
        >
          <el-form-item>
            <span>条件配置:</span>
          </el-form-item>
          <el-form-item>
            <normalCondition
              :activityInfo="activityInfo"
              :selectedActivity="selectedActivity"
              :selectedList="selectedList"
              :config="config"
              @changePercent="changePercent"
              @changeSelectedList="changeSelectedList"
            ></normalCondition>
          </el-form-item>
        </el-form>
      </div>
    </div>

  </div>
  <div v-else>礼包信息为空</div>
  <!-- </el-dialog> -->
</template>
<script>
import services from '@/services'
import permiss from '@/services/permiss'
import normalCondition from './giftCondition.vue'
import rewardConfig from '@/views/modules/giftlist/components/rewardConfig'
import conditionCheck from '@/services/conditionCheck'
export default {
  name: 'gift-edit',
  props: [
    'activityInfo',
    'selectedGroup',
    'selectedActivity',
    'actId',
    'editData'
  ],
  components: {
    normalCondition
  },
  data() {
    return {
      form: {
        rate: '',
        rewardName: '', // 礼包名称
        goodsType: '', // 礼包类型
        sumCount: 0, // 礼包数量
        // currentCount: 0, //当前数量
        percent: 0, // 抽奖概率
        date: [null, null], //礼包有效时间
        index: 0,
        image: '', //礼包图片地址
        goodsList: [], //激活码列表
        contentList: [], // 物品列表
        emailList: [], // 邮件建立列表
        condition: [],


      },
      goodsType5: {
        diamondPercent: null,
        initCount: null,
        diamondIncrease: null,
        maxCount: null
      },

      list: {
        fileName: '',
        start: '',
        end: '',
        resource: null
      },
      content: {
        name: '',
        count: ''
      },
      emailObj: {
        rewardId: '',
        type: '',
        rewardName: '',
        count: ''
      }, // emailList
      imageUrl: '',

      loading: null,

      selectedList: [],

      config: [],

      // nowgroup: null,  //当前选中的活动组
      // activityList: [], // 当前活动列表

      uploadPercent: 0, // 上传进度
      isLoaded: false
    }
  },
  computed: {
    // userinfo(){
    //   return this.$store.state.userInfo;
    // },
    // selectedGroup() {
    //   return this.$store.state.selectedGroup;
    // },
    defaultDate() {
      let now = new Date()
      now.setHours(0)
      now.setMinutes(0)
      now.setSeconds(0)
      return now
    },
    headers() {
      return {
        Authorization: 'Basic ' + this.$store.state.userCode
      }
    },
    requestUrl() {
      return this.$store.state.requestUrl
    },
    // 获取当前活动的活动类型
    activityType() {
      return this.selectedActivity.activityBase.rewardType //this.$store.state.selectedActivity.activityBase.rewardType
    },
    // 获取当前活动组所属的游戏ID
    activityAppId() {
      return this.selectedGroup.appId //this.$store.state.selectedGroup.appId
    }
    // activityList() {
    //   let list = this.$store.state.activityInfo;
    //   return list.activityDecoratorList.filter(item => {
    //     let now = moment();
    //     let start = moment(item.startTime);
    //     let end = moment(item.endTime);
    //     return item.activityBase.rewardType == 3 && now <= end;
    //   });
    // }
  },
  mounted() {
    if (this.editData) {
      this.config = JSON.parse(JSON.stringify(rewardConfig))
      let goodsList = this.editData.rewardBase.goodsList
        ? this.editData.rewardBase.goodsList.map(item => {
          item.isReload = false
          return item
        })
        : []

      this.form = {
        rewardId: this.editData.rewardBase.rewardId,
        rewardName: this.editData.rewardBase.rewardName,
        goodsType: this.editData.rewardBase.goodsType,
        sumCount: this.editData.rewardBase.sumCount,
        percent: this.editData.rewardBase.percent,
        // currentCount: this.editData.rewardBase.currentCount,
        rate: this.editData.rewardBase.rate ? this.editData.rewardBase.rate * 100 : '',
        index: this.editData.rewardBase.index,
        image: this.editData.rewardBase.image,
        goodsList: this.editData.rewardBase.goodsList
          ? JSON.parse(JSON.stringify(goodsList))
          : [],
        contentList: this.editData.rewardBase.contentList || [],
        emailList: this.editData.rewardBase.rewardList
          ? JSON.parse(JSON.stringify(this.editData.rewardBase.rewardList))
          : []
      }
      if (this.editData.conditionBaseList) {
        this.editData.conditionBaseList.forEach(listitem => {
          this.config.forEach(item => {
            if (item.conditionId == listitem.conditionId) {
              this.replaceObj(item, listitem)
              this.selectedList.push(item.conditionId)
            }
          })
        })
      }

      setTimeout(() => {
        this.isLoaded = true
      })
    }
  },
  methods: {
    formRateChanged(value) {
      value = Math.floor(value) || 0
      // value = Math.min(100, Math.max(0, value))
      this.form.rate = value
    },
    isPermiss(createUser) {
      return permiss(createUser)
    },
    changePercent(percent) {
      this.uploadPercent = percent
    },
    changeSelectedList(list) {
      this.selectedList = list
    },
    closeModal() {
      this.$emit('close')
    },
    replaceObj(obj, rep) {
      for (let i in obj) {
        for (let j in rep) {
          if (i === j) {
            obj[i] = rep[j]
          }
        }
      }
    },
    checkDisabled(list, item) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] == item.conditionId) return false
      }
      return true
    },
    activeCodeUploadCheck() {
      if (
        !this.list.start ||
        !this.list.end ||
        moment(this.list.start) > moment(this.list.end)
      )
        return true
      return false
    },
    pushGoodsList() {
      this.form.goodsList.push({
        fileName: this.list.fileName,
        start: moment(this.list.start).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(this.list.end).format('YYYY-MM-DD HH:mm:ss'),
        resource: this.list.resource, //this.list.id
        isReload: false
      })
      this.list = {
        fileName: '',
        start: '',
        end: '',
        resource: null
      }
    },
    pushContentList() {
      if (this.form.goodsType == 1 || this.form.goodsType == 3) {
        // 当礼包类型为cdkeys或者邮件时
        this.form.contentList.push({
          name: this.content.name,
          count: this.content.count,
          limit: this.content.limit
        })
      } else if (this.form.goodsType == 2) {
        // 当礼包类型为消耗品时
        this.form.contentList.push({
          name: '消耗品',
          count: this.content.count
        })
      }
      this.content = {
        name: '',
        count: ''
      }
    },
    pushEmailList() {
      if (this.form.goodsType == 3) {
        // 当礼包类型为邮件时
        this.form.emailList.push({
          rewardId: this.emailObj.rewardId,
          type: this.emailObj.type,
          rewardName: this.emailObj.rewardName,
          count: this.emailObj.count
        })
      }
      this.emailObj = {
        rewardId: '',
        type: '',
        rewardName: '',
        count: ''
      }
    },
    getRewardParams() {
      let rewardInfo = {
        rewardId: this.form.rewardId, // 礼包ID
        rewardName: this.form.rewardName, // 礼包名称
        goodsType: this.form.goodsType, // 礼包类型
        sumCount: this.form.sumCount, // 礼包数量
        // currentCount: this.form.currentCount, //当前数量
        // start: moment(this.form.date[0]).format('YYYY-MM-DD HH:mm:ss'),
        // end: moment(this.form.date[1]).format('YYYY-MM-DD HH:mm:ss'),
        index: this.form.index,
        image: this.form.image, //礼包图片地址
        rate: this.form.rate / 100,
      }
      // 当活动类型为抽奖时
      if (this.activityType == 1) {
        rewardInfo.percent = this.form.percent // 抽奖概率
      }
      // 当礼包类型为激活码时
      if (
        this.form.goodsType == 1 &&
        this.form.goodsList &&
        this.form.goodsList.length > 0
      ) {
        let list = []
        this.form.goodsList.forEach(item => {
          list.push({
            fileName: item.fileName,
            start: item.start,
            end: item.end,
            resource: item.resource,
            isReload: item.isReload
          })
        })
        rewardInfo.goodsList = list
      }

      let list = []
      if (this.form.goodsType === 5) {
        list = [{
          diamondPercent: this.goodsType5.diamondPercent / 100,
          initCount: this.goodsType5.initCount,
          diamondIncrease: this.goodsType5.diamondIncrease,
          maxCount: this.goodsType5.maxCount
        }]
      } else {
        if (this.form.contentList.length > 0) {
          this.form.contentList.forEach(item => {
            list.push({
              name: item.name,
              count: item.count,
              limit: item.limit || -1
            })
          })
        }
      }
      list.length && (rewardInfo.contentList = list)

      // 邮件奖励内容
      if (this.form.goodsType == 3 && this.form.emailList.length > 0) {
        let list = []
        this.form.emailList.forEach(item => {
          list.push({
            rewardId: item.rewardId,
            type: item.type,
            rewardName: item.rewardName,
            count: item.count
          })
        })
        rewardInfo.emailList = list
      }

      let conditionList = []

      for (let i = 0; i < this.selectedList.length; i++) {
        let itemId = this.selectedList[i]
        for (let j = 0; j < this.config.length; j++) {
          let condition = this.config[j]
          if (condition.conditionId == itemId) {
            let conditionCreate = conditionCheck[itemId]
            if (conditionCreate) {
              let result = conditionCreate.conditionCheck('reward', condition)
              if (result.result) {
                conditionList.push(result.data)
              } else {
                this.$message({
                  message: result.msg,
                  type: 'warning'
                })
                return false
              }
            }
          }
        }
      }
      rewardInfo.condition = conditionList
      return rewardInfo
    },
    checkParams() {
      if (!this.form.rewardName) {
        this.$message({
          message: '请输入礼包名称',
          type: 'warning'
        })
        return false
      } else if (!this.form.goodsType) {
        this.$message({
          message: '请选择礼包类型',
          type: 'warning'
        })
        return false
      } else if (this.form.index === '') {
        this.$message({
          message: '请输入礼包序号',
          type: 'warning'
        })
        return false
      }
      return true
    },
    editGift() {
      if (!this.checkParams()) return
      let rewardInfo = this.getRewardParams()
      if (!rewardInfo) return
      let params = {
        gruopId: this.selectedGroup.groupId,
        actId: this.actId,
        rewardInfo: JSON.stringify(rewardInfo)
      }
      services.activity.updateReward(params).then(data => {
        if (data.code == 200) {
          this.$notify({
            message: '修改礼包成功!',
            type: 'success'
          })
          this.$emit('close')
          this.$emit('getActivityInfo')
        } else {
          this.$notify({
            message: data.message || data,
            type: 'warning'
          })
        }
      })
    },
    //上传图片前验证
    beforeAvatarUpload(file) {
      // const isLt2M = file.size / 1024 / 1024 < 1
      // if (!isLt2M) {
      //   this.$message.error('上传图片大小不能超过 1MB!')
      // } else {
      this.loading = this.$loading({
        fullscreen: true,
        customClass: 'my-loading'
      })
      // }
      return true//isLt2M
    },
    //上传图片成功回调
    handleAvatarSuccess(res, file) {
      this.loading.close()
      this.uploadPercent = 0
      this.$message({
        message: '上传成功',
        type: 'success'
      })
      this.imageUrl = URL.createObjectURL(file.raw)
      this.form.image = res.state
    },
    handleAvatarError(res, file) {
      this.loading.close()
      this.uploadPercent = 0
      this.$message.error('上传失败')
    },
    //上传图标时的进度事件
    uploadAvtarProgress(event, file) {
      let load = event.loaded
      let total = event.total
      this.uploadPercent = Number((load / total * 100).toFixed(0))
    },
    // // 上传激活码前先验证
    uploadCodeBefore(file) {
      // const isLt2M = file.size / 1024 / 1024 < 1
      // if (!isLt2M) {
      //   this.$message.error('上传文件大小不能超过 1MB!')
      // } else {
      this.loading = this.$loading({
        fullscreen: true,
        customClass: 'my-loading'
      })
      // }
      return true//isLt2M
    },
    //上传激活码 成功
    uploadCodeSuccess(res, file) {
      this.loading.close()
      this.uploadPercent = 0
      this.$message({
        message: '上传成功',
        type: 'success'
      })
      this.list.fileName = file.name
      this.list.resource = res.state
      this.pushGoodsList()
    },
    //上传激活码 失败
    uploadCodeError(res, file) {
      this.loading.close()
      this.uploadPercent = 0
      this.$message.error('上传失败')
    },
    //上传激活码时的进度事件
    uploadCodeProgress(event, file) {
      let load = event.loaded
      let total = event.total
      this.uploadPercent = Number((load / total * 100).toFixed(0))
    }
  },
  watch: {
    form: {
      deep: true,
      handler(v, ov) {
        if (this.isLoaded) {
          this.$emit('formchange')
        }
      }
    },
    'form.goodsType': function (v, ov) {
      if (v != ov) {
        if (v === 5) {
          // this.form.contentList = this.editData.rewardBase.contentList
          //   ? (() => {
          //     let list = JSON.parse(JSON.stringify(this.editData.rewardBase.contentList))
          //     list.forEach((item, index, arr) => {
          //       arr[index].diamondPercent *= 100
          //     })
          //     return list
          //   })()
          //   : [{
          //     diamondPercent: 0,
          //     initCount: 0,
          //     maxCount: 0,
          //     diamondIncrease: 0
          //   }]
          if (this.form.contentList.length) {
            this.goodsType5 = {
              diamondPercent: this.form.contentList[0].diamondPercent * 100,
              initCount: this.form.contentList[0].initCount,
              diamondIncrease: this.form.contentList[0].diamondIncrease,
              maxCount: this.form.contentList[0].maxCount,
            }
          }
        }
        else if (v == this.editData.rewardBase.goodsType) {
          this.form.contentList = this.editData.rewardBase.contentList
            ? JSON.parse(JSON.stringify(this.editData.rewardBase.contentList))
            : []
        } else {
          this.form.contentList = []
        }
        this.content = {
          name: '',
          count: ''
        }
      }
    }
  }
}
</script>
<style lang="scss">
.page-form.giftinfo {
  .percentageCls {
    width: 130px;
    .el-input-group__append {
      padding: 0 8px;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border: 1px solid #ddd;
  }

  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }

  .my-dialog-form {
    .el-dropdown-link {
      cursor: pointer;
      color: #20a0ff;
    }
  }

  .active-code-file-name {
    width: 145px;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    display: inline-block;
  }
  .active-code-time-list {
    color: #bbb;
    font-size: 12px;
    line-height: 15px;
    vertical-align: middle;
    display: inline-block;
  }

  // .inline-form {
  //   white-space: nowrap;
  //   overflow-x: auto;
  //   border-bottom: 1px dashed #ddd;
  //   margin-bottom:20px;
  //   // border-left: 1px dashed #ddd;
  //   // border-right: 1px dashed #ddd;
  //   .inline-form-item {
  //     display: inline-block;
  //     vertical-align: top;
  //     &.first {
  //       width: 600px;
  //     }
  //     &.second {
  //       border-left: 1px dashed #ddd;
  //     }
  //   }
  // }
}
</style>
