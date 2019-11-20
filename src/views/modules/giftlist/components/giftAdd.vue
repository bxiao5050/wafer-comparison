<template>
  <!-- <el-dialog custom-class="my-dialog" top="5%" :visible="true" size="tiny" :close-on-click-modal="false" :beforeClose="closeModal" -->
    <!-- @close="closeModal"> -->
    <div class="my-dialog">
    <h5 class="form-title" slot="title">添加礼包</h5>
    <el-form ref="form" :model="form" label-width="100px" label-position="left" class="my-dialog-form">
      <el-form-item label="礼包名称:">
        <el-input v-model="form.rewardName" class="form-input" placeholder="请输入礼包名称"></el-input>
        <el-tag type="danger">礼包名称用于展示用户领取的奖励情况，如有需要，须配置本地化语言</el-tag>
      </el-form-item>
      <el-form-item label="礼包类型:">
        <el-radio-group v-model="form.goodsType">
          <el-radio :label="1">cdkeys</el-radio>
          <el-radio :label="2">消耗品</el-radio>
          <el-radio :label="3">邮件</el-radio>
          <el-radio :label="4">实物</el-radio>
        </el-radio-group>
        <div class="form-item-tip">消耗品：礼包可获取如积分、票数等其他活动依赖的消耗品；邮件：需游戏提供接口支持，可直接发送到游戏内邮箱</div>
      </el-form-item>
      <el-form-item label="激活码上传" v-if="form.goodsType==1">
        <div v-for="(item,index) in form.goodsList" class="row-item">
          {{item.start}}~{{item.end}}
          <el-tag :type="item.id?'success':'warning'">{{item.id?'已上传':'未上传'}}</el-tag>
          <el-button type="default" size="small" @click="form.goodsList.splice(index,1)">删除</el-button>
        </div>
        <div class="row-item">
          <el-date-picker :clearable="false" :default-value="defaultDate" v-model="list.start" type="datetime" placeholder="选择开始时间">
          </el-date-picker>
          <el-date-picker :clearable="false" :default-value="defaultDate" v-model="list.end" type="datetime" placeholder="选择结束时间">
          </el-date-picker>
          <el-upload class="upload-demo" name="uploadfile" :headers="headers" :action="requestUrl+'/admin/upload/resource'" style="display:inline;"
            :show-file-list="false" :on-success="uploadCodeSuccess" :before-upload="uploadCodeBefore" :on-error="uploadCodeError"
            :on-progress="uploadCodeProgress">
            <el-button type="primary" size="small" :disabled="activeCodeUploadCheck()" title="请先选择开始时间和结束时间，且开始时间不能大于结束时间">上传</el-button>
            <div slot="tip" class="form-item-tip">只能上传txt文件，且不超过1M</div>
          </el-upload>
        </div>
        <div class="row-item">
          <el-tag type="'warning" v-if="form.goodsList&&form.goodsList.length==0">未上传</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="礼包数量:">
        <el-input v-model="form.sumCount" class="form-input"></el-input>
      </el-form-item>
      <el-form-item label="抽奖概率:" v-if="activityType==1">
        <el-input class="form-num-input" style="margin:0;" v-model="form.percent" /> %
      </el-form-item>
      <!-- <el-form-item label="当前数量:">
        <el-input v-model="form.currentCount" class="form-input"></el-input>
      </el-form-item> -->
      <el-form-item label="礼包ICON:">
        <el-upload class="avatar-uploader" name="uploadfile" :headers="headers" :action="requestUrl+'/admin/upload/resource'" :show-file-list="false"
          :on-progress="uploadAvtarProgress" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :on-error="handleAvatarError">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-if="!imageUrl" class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="条件配置:">
        <normalCondition :selectedList="selectedList" :config="config" @changePercent="changePercent" @changeSelectedList="changeSelectedList"></normalCondition>
      </el-form-item>
      <template v-if="form.goodsType!=0">
        <!--当类型为cdkey和邮件时，礼包内容可以为多个-->
        <el-form-item label="礼包内容:" v-if="form.goodsType==1||form.goodsType==3">
          <div v-for="(item,index) in form.contentList" class="row-item">
            {{item.name}} * {{item.count}}
            <el-button type="default" size="small" @click="form.contentList.splice(index,1)">删除</el-button>
          </div>
          <div class="row-item">
            <el-input class="form-num-input" v-model="content.name" placeholder="物品">
            </el-input>
            <el-input class="form-num-input" v-model="content.count" placeholder="数量">
            </el-input>
            <el-button type="primary" size="small" :disabled="!content.name||!content.count" @click="pushContentList">添加</el-button>
          </div>
        </el-form-item>
        <!--当类型为消耗品时，礼包内容只能配一个-->
        <el-form-item label="消耗品数量:" v-if="form.goodsType==2">
          <div v-for="(item,index) in form.contentList" class="row-item">
            {{item.name}} * {{item.count}}
            <el-button type="default" size="small" @click="form.contentList.splice(index,1)">删除</el-button>
          </div>
          <div class="row-item" v-if="form.contentList.length<1">
            消耗品*
            <el-input class="form-num-input" v-model="content.count" placeholder="数量">
            </el-input>
            <el-button type="primary" size="small" :disabled="!content.count" @click="pushContentList">添加</el-button>
          </div>
        </el-form-item>
        <!--当类型为邮件时显示-->
        <el-form-item label="邮件奖励内容:" v-if="form.goodsType==3">
          <table v-if="form.emailList.length>0" style="text-align:center">
            <thead><tr>
            <th>奖励id</th>
            <th>奖励类型</th>
            <th>奖励名称</th>
            <th>奖励数量</th>
            <th></th></tr></thead>
            <tbody>
          <tr v-for="(item,index) in form.emailList">
            <td>{{item.rewardId}}</td><td>{{item.type}}</td><td>{{item.rewardName}}</td><td>{{item.count}}</td>
            <td><el-button type="default" size="small" @click="form.emailList.splice(index,1)">删除</el-button></td>
          </tr>
          </tbody>
          </table>
          <div class="row-item">
            <el-input class="form-num-input" v-model="emailObj.rewardId" placeholder="奖励id">
            </el-input>
            <el-input class="form-num-input" v-model="emailObj.type" placeholder="奖励类型">
            </el-input>
            <el-input class="form-num-input" v-model="emailObj.rewardName" placeholder="奖励名称">
            </el-input>
            <el-input class="form-num-input" v-model="emailObj.count" placeholder="奖励数量">
            </el-input>
            <el-button type="primary" size="small" :disabled="!emailObj.rewardId||!emailObj.type||!emailObj.rewardName||!emailObj.count" @click="pushEmailList">添加</el-button>
          </div>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div style="float:left;" v-if="uploadPercent">
        <span>进度:</span>
        <el-progress style="display:inline-block;width:250px;" :percentage="uploadPercent"></el-progress>
      </div>
      <el-button type="primary" size="small" @click="addGift" :disabled="!isPermiss(selectedGroup.createUser)">添加礼包</el-button>
      <el-button type="default" size="small" @click="closeModal">取消</el-button>
    </div>
    </div>
  <!-- </el-dialog> -->
</template>
<script>
import services from "@/services";
import permiss from '@/services/permiss'
import normalCondition from "./normalCondition.vue";
import rewardConfig from "./rewardConfig";
import conditionCheck from "../../../../services/conditionCheck";
export default {
  name: "gift-add",
  props: ["groupId", "actId"],
  components: {
    normalCondition
  },
  data() {
    return {
      form: {
        rewardName: "", // 礼包名称
        goodsType: "", // 礼包类型
        sumCount: 0, // 礼包数量
        // currentCount: 0, //当前数量
        percent: 0, // 抽奖概率
        date: [null, null], //礼包有效时间
        image: "", //礼包图片地址
        goodsList: [],
        contentList: [],
        emailList: [],
        condition: []
      },
      list: {
        start: "",
        end: "",
        id: null
      }, // goodsList
      content: {
        name: "",
        count: ""
      }, // contentList
      emailObj: {
        rewardId: "",
        type: "",
        rewardName: "",
        count: ""
      }, // emailList

      imageUrl: "", // 图片地址

      loading: null, // loading对象

      selectedList: [], // 选中的条件

      config: [], // 条件数组

      uploadPercent: 0, // 上传进度
      joinTimeLimit:false , // 确定添加
    };
  },
  computed: {
    userinfo(){
      return this.$store.state.userInfo;
    },
    selectedGroup() {
      return this.$store.state.selectedGroup;
    },
    defaultDate() {
      let now = new Date();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      return now;
    },
    headers() {
      return {
        Authorization: "Basic " + this.$store.state.userCode
      };
    },
    requestUrl() {
      return this.$store.state.requestUrl;
    },
    // 获取当前活动的活动类型
    activityType() {
      return this.$store.state.selectedActivity.activityBase.rewardType;
    },
    // 获取当前活动组所属的游戏ID
    activityAppId() {
      return this.$store.state.selectedGroup.appId;
    },
    // 过滤活动为消耗品并且未结束的活动列表
    activityList() {
      let list = this.$store.state.activityInfo;
      return list.activityDecoratorList.filter(item => {
        let now = moment();
        let start = moment(item.startTime);
        let end = moment(item.endTime);
        return item.activityBase.rewardType == 3 && now <= end;
      });
    }
  },
  mounted() {
    this.config = JSON.parse(JSON.stringify(rewardConfig));
  },
  methods: {
    isPermiss(createUser){
      return permiss(createUser);
    },
    changePercent(percent) {
      this.uploadPercent = percent;
    },
    changeSelectedList(list) {
      this.selectedList = list;
    },
    closeModal() {
      this.$emit("close");
    },
    checkDisabled(list, item) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] == item.conditionId) return false;
      }
      return true;
    },
    activeCodeUploadCheck() {
      if (
        !this.list.start ||
        !this.list.end ||
        moment(this.list.start) > moment(this.list.end)
      )
        return true;
      return false;
    },
    pushGoodsList() {
      this.form.goodsList.push({
        start: moment(this.list.start).format("YYYY-MM-DD HH:mm:ss"),
        end: moment(this.list.end).format("YYYY-MM-DD HH:mm:ss"),
        id: this.list.id //this.list.id
      });
      this.list = {
        start: "",
        end: "",
        id: null
      };
    },
    pushContentList() {
      if (this.form.goodsType == 1 || this.form.goodsType == 3) {
        // 当力保类型为cdkeys或者邮件时
        this.form.contentList.push({
          name: this.content.name,
          count: this.content.count
        });
      } else {
        // 当礼包类型为消耗品时
        this.form.contentList.push({
          name: "消耗品",
          count: this.content.count
        });
      }
      this.content = {
        name: "",
        count: ""
      };
    },
    pushEmailList() {
      if (this.form.goodsType == 3) {
        // 当礼包类型为邮件时
        this.form.emailList.push({
          rewardId: this.emailObj.rewardId,
          type: this.emailObj.type,
          rewardName: this.emailObj.rewardName,
          count: this.emailObj.count
        });
      }
      this.emailObj = {
        rewardId: "",
        type: "",
        rewardName: "",
        count: ""
      };
    },
    getConfigParams(){

    },
    getRewardParams() {
      let rewardInfo = {
        rewardName: this.form.rewardName, // 礼包名称
        goodsType: this.form.goodsType, // 礼包类型
        sumCount: this.form.sumCount, // 礼包数量
        image: this.form.image //礼包图片地址
      };
      // 当活动为抽奖时
      if (this.activityType == 1) {
        rewardInfo.percent = this.form.percent; // 抽奖概率
      }
      if (this.form.goodsList.length > 0) {
        let list = [];
        this.form.goodsList.forEach(item => {
          list.push({
            start: item.start,
            end: item.end,
            resource: item.id
          });
        });
        rewardInfo.goodsList = list;
      }
      // 消耗品数量
      if (this.form.contentList.length > 0) {
        let list = [];
        this.form.contentList.forEach(item => {
          list.push({
            name: item.name,
            count: item.count
          });
        });
        rewardInfo.contentList = list;
      }
      // 邮件奖励内容
      if(this.form.emailList.length > 0){
        let list = [];
        this.form.emailList.forEach(item => {
          list.push({
            rewardId: item.rewardId,
            type: item.type,
            rewardName: item.rewardName,
            count: item.count
          });
        });
        rewardInfo.emailList = list;
      }

      var conditionList = [];


      for(let i = 0;i<this.selectedList.length;i++){
        let itemId = this.selectedList[i];
        if(itemId == "4b90b47a-2dbe-4b67-a261-8811a70faeec"){
            this.joinTimeLimit = true;
        }
        for(let j = 0 ; j< this.config.length;j++ ){
            let condition = this.config[j];
            if(condition.conditionId == itemId){
              let conditionCreate = conditionCheck[itemId];
              if(conditionCreate){
                let result = conditionCreate.conditionCheck("reward",condition);
                  if(result.result){
                    conditionList.push(result.data);
                  }else{
                    this.$message({
                      message: result.msg,
                      type: "warning"
                    });
                    return false;
                  };
              }
            }
        }
      }
      rewardInfo.condition = conditionList;
      return rewardInfo;
    },
    checkParams() {
      if (!this.form.rewardName) {
        this.$message({
          message: "请输入礼包名称",
          type: "warning"
        });
        return false;
      } else if (!this.form.goodsType) {
        this.$message({
          message: "请选择礼包类型",
          type: "warning"
        });
        return false;
      }
      return true;
    },
    addGift() {
      if (!this.checkParams()) return;
      let rewardInfo = this.getRewardParams();
      if (!rewardInfo) return;
      console.log(this.joinTimeLimit);
      if(this.joinTimeLimit == false) {
        this.$confirm('未配置领取次数条件，用户可能不限次数领取，确定要保存奖励吗！'
          , "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(_ => {
            console.log(_);
            let params = {
              gruopId: this.groupId,
              actId: this.actId,
              rewardInfo: JSON.stringify(rewardInfo)
            };
            services.activity.updateReward(params).then(data => {
              if (data.code == 200) {
                this.$notify({
                  message: "添加礼包成功!",
                  type: "success"
                });
                this.$emit("close");
                this.$emit("getActivityInfo");
              } else {
                this.$notify({
                  message: data.message || data,
                  type: "warning"
                });
              }
            });
          }).catch(_ => {});
      }else {
        let params = {
          gruopId: this.groupId,
          actId: this.actId,
          rewardInfo: JSON.stringify(rewardInfo)
        };
        services.activity.updateReward(params).then(data => {
          if (data.code == 200) {
            this.$notify({
              message: "添加礼包成功!",
              type: "success"
            });
            this.$emit("close");
            this.$emit("getActivityInfo");
          } else {
            this.$notify({
              message: data.message || data,
              type: "warning"
            });
          }
        });
      }
//      if(!this.confirmAdd) return ;

    },
    //上传图片前验证
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 1MB!");
      } else {
        this.loading = this.$loading({
          fullscreen: true,
          customClass: "my-loading"
        });
      }
      return isLt2M;
    },
    //上传图片成功回调
    handleAvatarSuccess(res, file) {
      this.loading.close();
      this.$message({
        message: "上传成功",
        type: "success"
      });
      this.uploadPercent = 0;
      this.imageUrl = URL.createObjectURL(file.raw);
      this.form.image = res.state;
    },
    // 上传图标时错误回调
    handleAvatarError(res, file) {
      this.loading.close();
      this.uploadPercent = 0;
      this.$message.error("上传失败");
    },
    //上传图标时的进度事件
    uploadAvtarProgress(event, file) {
      let load = event.loaded;
      let total = event.total;
      this.uploadPercent = Number((load / total * 100).toFixed(0));
    },
    // 上传激活码前验证
    uploadCodeBefore(file) {
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 1MB!");
      } else {
        this.loading = this.$loading({
          fullscreen: true,
          customClass: "my-loading"
        });
      }
      return isLt2M;
    },
    //上传激活码 成功
    uploadCodeSuccess(res, file) {
      this.loading.close();
      this.uploadPercent = 0;
      this.$message({
        message: "上传成功",
        type: "success"
      });
      this.list.id = res.state;
      this.pushGoodsList();
    },
    //上传激活码 失败
    uploadCodeError(res, file) {
      this.loading.close();
      this.uploadPercent = 0;
      this.$message.error("上传失败");
    },
    //上传激活码时的进度事件
    uploadCodeProgress(event, file) {
      let load = event.loaded;
      let total = event.total;
      this.uploadPercent = Number((load / total * 100).toFixed(0));
    }
  },
  watch: {
    "form.goodsType": function(v, ov) {
      if (v != ov) {
        this.form.contentList = [];
        this.content = {
          name: "",
          count: ""
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
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
</style>
<!-- <style lang="scss">
  .my-dialog-form .form-date.el-date-editor.el-input{
    width:170px;
  }
</style> -->
