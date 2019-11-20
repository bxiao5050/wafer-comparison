<template>
  <div>
    <template v-for="item in config">
      <!--受邀人条件-->
      <div
        v-if="item.conditionId=='3e15383b-634b-4e10-b3ff-6da94da573dd'"
        class="row-item"
      >
        <el-checkbox
          class="radio"
          :disabled="activityIsTimeOut"
          v-model="listSelected"
          :label="item.conditionId"
        >{{item.conditionName}}
        </el-checkbox>
        <template v-if="!checkDisabled(listSelected,item)">
          <div class="row-item child-group">
            是否是受邀人:
            <el-switch
              v-model="item.isInvited"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </div>
          <div class="row-item child-group">
            受邀人数量:
            <el-input
              class="form-num-input"
              v-model="item.invitedCount"
              :disabled="checkDisabled(listSelected,item)"
            />
          </div>
        </template>
      </div>
      <!--统计人数数量-->
      <div
        v-if="item.conditionId=='5a13b590-8821-4fb5-a18e-9a10eeaeb2a1'"
        class="row-item"
      >
        <el-checkbox
          class="radio"
          v-model="listSelected"
          :label="item.conditionId"
        >{{item.conditionName}}
        </el-checkbox>
        <template v-if="!checkDisabled(listSelected,item)">
          <div class="row-item child-group">
            <div class="row-item child-group">
              基础参与人数
              <el-input
                class="form-num-input"
                v-model="item.baseCount"
                :disabled="checkDisabled(listSelected,item)"
              />人
            </div>
          </div>
          <div class="row-item child-group">
            <div class="row-item child-group">
              每增加一个参与者，随机增加 1 -
              <el-input
                class="form-num-input"
                v-model="item.randomCount"
                :disabled="checkDisabled(listSelected,item)"
              />人
            </div>
          </div>
        </template>
      </div>
      <!--end-->
      <!--参与人数配置-->
      <!--end-->
      <!--参与次数配置-->
      <div
        v-if="item.conditionId=='4b90b47a-2dbe-4b67-a261-8811a70faeec'"
        class="row-item"
      >
        <el-checkbox
          class="radio"
          v-model="listSelected"
          :label="item.conditionId"
        >{{item.conditionName}}
        </el-checkbox>
        <el-tag type="danger">如不配置玩家可无限次领取</el-tag>
        <template v-if="!checkDisabled(listSelected,item)">
          <div class="row-item child-group">
            <div class="row-item child-group">
              单人每日限制
              <el-input
                class="form-num-input"
                v-model="item.dayTime"
                :disabled="checkDisabled(listSelected,item)"
              />次,限制最多
              <el-input
                class="form-num-input"
                v-model="item.sumTime"
                :disabled="checkDisabled(listSelected,item)"
              />次
            </div>
          </div>
        </template>
      </div>
      <!--end-->
      <!--游戏登录要求-->
      <div
        v-if="item.conditionId=='c89101da-32d5-49aa-8136-421cee9bb822'"
        class="row-item"
      >
        <el-checkbox
          class="radio"
          v-model="listSelected"
          :label="item.conditionId"
        >{{item.conditionName}}
        </el-checkbox>
        <template v-if="!checkDisabled(listSelected,item)">
          <div class="row-item">
            在
            <el-date-picker
              :clearable="false"
              :default-value="defaultDate"
              v-model="item.start"
              type="datetime"
              placeholder="选择开始时间"
            >
            </el-date-picker>
            -
            <el-date-picker
              :clearable="false"
              :default-value="defaultDate"
              v-model="item.end"
              type="datetime"
              placeholder="选择结束时间"
            >
            </el-date-picker>
          </div>
          <div class="row-item">
            时间内,
            <el-select
              v-model="item.loginType"
              style="width:110px"
            >
              <el-option
                :value="1"
                label="每日登录"
              ></el-option>
              <el-option
                :value="2"
                label="累计登录"
              ></el-option>
              <el-option
                :value="3"
                label="不登录"
              ></el-option>
              <el-option
                :value="4"
                label="连续登录"
              ></el-option>
            </el-select>

            <!-- <el-select
              v-model="item.loginType"
              style="width:110px"
            >
              <el-option
                :value="1"
                label="游戏"
              ></el-option>
              <el-option
                :value="2"
                label="活动页"
              ></el-option>
            </el-select> -->

            <template v-if="item.loginType!=1&&item.loginType!=3">
              <el-input
                class="form-num-input"
                v-model="item.LoginCount"
              />天
            </template>
          </div>
        </template>
      </div>
      <!--end-->
      <!--固定玩家资格配置-->
      <div v-if="item.conditionId=='ce59f4f3-75c9-472b-bfe7-0280405df206'">
        <el-checkbox
          class="radio"
          v-model="listSelected"
          :label="item.conditionId"
        >{{item.conditionName}}
        </el-checkbox>
        <template v-if="!checkDisabled(listSelected,item)">
          <a href="javascript:void(0)">模板下载</a>
          <el-upload
            class="upload-demo"
            name="uploadfile"
            :headers="headers"
            :action="requestUrl+'/admin/upload/resource'"
            style="display:inline;margin-left:30px;"
            :show-file-list="false"
            :on-progress="uploadProgress"
            :on-success="uploadSuccess"
            :before-upload="uploadBefore"
            :on-error="uploadError"
          >
            <el-button
              type="primary"
              size="small"
            >上传</el-button>
          </el-upload>
          <el-tag :type="item.importId?'success':'warning'">{{item.importId?'已上传':'未上传'}}</el-tag>
        </template>
      </div>
      <!--end-->
      <!--等级要求-->
      <div
        v-if="item.conditionId=='c9d389b8-e8a2-48a5-ae91-5ef24e8bc8a7'"
        class="row-item"
      >
        <el-checkbox
          class="radio"
          v-model="listSelected"
          :label="item.conditionId"
        >{{item.conditionName}}
        </el-checkbox>
        <template v-if="!checkDisabled(listSelected,item)">
          <el-input
            class="form-num-input"
            v-model="item.level"
            :disabled="checkDisabled(listSelected,item)"
          />
        </template>
      </div>
      <!--end-->
      <!--充值条件-->
      <div
        v-if="item.conditionId=='2d0c5927-53af-4b95-b27e-209b84a4bd72'"
        class="row-item"
      >
        <el-checkbox
          class="radio"
          v-model="listSelected"
          :label="item.conditionId"
        >{{item.conditionName}}
        </el-checkbox>
        <template v-if="!checkDisabled(listSelected,item)">
          <el-select
            v-model="item.changeType"
            style="width:130px;"
          >
            <el-option
              label="总充值达成"
              :value="1"
            ></el-option>
            <el-option
              label="新增充值达成"
              :value="2"
            ></el-option>
            <el-option
              label="单日充值达成1"
              :value="3"
            ></el-option>
          </el-select>
          <el-input
            class="form-num-input"
            v-model="item.chargeMoneny"
          />
          <div class="form-item-tip">1.总充值达成: 活动时间内总充值数量，活动期间只能领取1次</div>
          <div class="form-item-tip">2.新增充值达成: 活动时间内用户充值新增数量，活动期间可以达成多次，例如：配置充值条件300，用户充值600，那么用户可以领取2次，单次不满300无次数</div>
          <div class="form-item-tip">3.单日充值达成: 活动时间内每天用户充值新增数量，活动期间可以达成多次，例如：配置充值条件200，用户充值400，那么用户可以领取2次（未使用次数第二天00:00清空）</div>
          <div class="form-item-tip">4.累计充值达成：活动期间内累计用户充值数量，每满一次额度送一次，例如：配置累计充值100，多次充值达到100，那么用户就可以领一次</div>
        </template>
      </div>
      <!--end-->
      <!--用户绑定配置-->
      <!-- <div v-if="item.conditionId=='a8b8e4cd-92c4-400f-8768-53cc81a9d213'" class="row-item">
            <el-checkbox class="radio"  v-model="listSelected" :label="item.conditionId">{{item.conditionName}}
            </el-checkbox>
            <div class="row-item" v-if="!checkDisabled(listSelected,item)">
              <span>限制绑定数量:</span>
              <el-input class="form-num-input" v-model="item.limitBindCount" :disabled="checkDisabled(listSelected,item)" />
              <span>限制用户等级:</span>
              <el-input class="form-num-input" v-model="item.limitUserLevel" :disabled="checkDisabled(listSelected,item)" />
            </div>
          </div> -->
      <!--end-->
      <!--限制区服-->
      <div
        v-if="item.conditionId=='c5ffb6b3-79b9-4a54-bdfe-d022b98423c3'"
        class="row-item"
      >
        <el-checkbox
          class="radio"
          v-model="listSelected"
          :label="item.conditionId"
        >{{item.conditionName}}
        </el-checkbox>
        <div
          class="row-item"
          v-if="!checkDisabled(listSelected,item)"
        >
          <el-input
            class="form-input"
            v-model="item.gameZoneLimit"
            :disabled="checkDisabled(listSelected,item)"
            placeholder="区服ID"
          />
          <div class="form-item-tip">1. 0-10 表示 0-10区的玩家可以领取</div>
          <div class="form-item-tip">2. >10 表示 10区以上的玩家可以领取 >=
            <
              <=同
              理</div>
              <div
              class="form-item-tip"
            >3. 1,2,3,4 1,2,3,4区可领多个单区服,用逗号","隔开</div>
          <div class="form-item-tip">4. 区服为sdk区服id</div>
        </div>
      </div>
      <!--end-->
      <!--预注册-->
      <div
        v-if="item.conditionId=='5d4b9651-d16d-40d2-a512-7c5c8a7c57a2'"
        class="row-item"
      >
        <el-checkbox
          class="radio"
          v-model="listSelected"
          :label="item.conditionId"
        >{{item.conditionName}}
        </el-checkbox>
        <div
          class="row-item"
          v-if="!checkDisabled(listSelected,item)"
        >
          类型:
          <el-select
            v-model="item.type"
            style="width:130px;"
          >
            <el-option
              label="邮箱"
              :value="1"
            ></el-option>
            <el-option
              label="手机号"
              :value="2"
            ></el-option>
          </el-select>
        </div>
      </div>
      <!--end-->

      <!--消费条件-->
      <div
        v-if="item.conditionId=='cbc307bf-ffc3-4122-978c-05442191f4bf'"
        class="row-item"
      >
        <el-checkbox
          class="radio"
          v-model="listSelected"
          :label="item.conditionId"
        >{{item.conditionName}}
        </el-checkbox>
        <template v-if="!checkDisabled(listSelected,item)">
          <el-select
            v-model="item.changeType"
            style="width:130px;"
          >
            <el-option
              label="总消费达成"
              :value="1"
            ></el-option>
            <el-option
              label="新增消费达成"
              :value="2"
            ></el-option>
            <el-option
              label="单日消费达成"
              :value="3"
            ></el-option>
          </el-select>
          <el-input
            class="form-num-input"
            v-model="item.chargeMoney"
          ></el-input>
          <div class="form-item-tip">1.总消费达成: 活动时间内总消费数量，活动期间只能领取1次</div>
          <div class="form-item-tip">2.新增消费达成: 活动时间内用户消费新增数量，活动期间可以达成多次，例如：配置消费条件300，用户消费600，那么用户可以领取2次，单次不满300无次数</div>
          <div class="form-item-tip">3.单日消费达成: 活动时间内每天用户消费新增数量，活动期间可以达成多次，例如：配置消费条件200，用户消费400，那么用户可以领取2次（未使用次数第二天00:00清空）</div>
          <div class="form-item-tip">4.累计消费达成：活动期间内累计用户消费数量，每满一次额度送一次，例如：配置累计消费100，多次消费达到100，那么用户就可以领一次</div>
        </template>
      </div>
      <!--end-->
      <!--限制参与人数-->
      <!--<div v-if="item.conditionId=='0f8323f5-a158-43c6-9931-fcfdcd52d2a6'" class="row-item">-->
      <!--<el-checkbox class="radio"  v-model="listSelected" :label="item.conditionId">{{item.conditionName}}-->
      <!--</el-checkbox>-->
      <!--<template v-if="!checkDisabled(listSelected,item)">-->
      <!--<div class="row-item">-->
      <!--每日只允许指定数量的用户参与活动<el-input class="form-num-input" v-model="item.dayJoinCountLimit" ></el-input>-->
      <!--</div>-->
      <!--<div class="row-item">-->
      <!--总共只允许指定数量的用户参与活动<el-input class="form-num-input" v-model="item.totalJoinCountLimit" ></el-input>-->
      <!--</div>-->
      <!--</template>-->
      <!--</div>-->
      <!--end-->

      <!--竞猜-->
      <div
        v-if="item.conditionId=='a8888a60-54c4-4307-b68d-8dba3daa36b4'"
        class="row-item"
      >
        <el-checkbox
          class="radio"
          v-model="listSelected"
          :label="item.conditionId"
        >{{item.conditionName}}
        </el-checkbox>
        <template v-if="!checkDisabled(listSelected,item)">

          <el-table
            v-if="item.steps"
            :data="item.steps"
          >
            <el-table-column
              prop="allowCount"
              label="玩家抽取数量"
              width="140"
            >
              <template slot-scope="scope">
                <el-input
                  class="form-num-input"
                  v-model="scope.row.allowCount"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="systemCount"
              label="系统抽取数量"
              width="140"
            >
              <template slot-scope="scope">
                <el-input
                  class="form-num-input"
                  v-model="scope.row.systemCount"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="startTime"
              label="抽取开始时间"
              width="240"
            >
              <template slot-scope="scope">
                <el-date-picker
                  :clearable="false"
                  :default-value="defaultDate"
                  v-model="scope.row.startTime"
                  type="datetime"
                  placeholder="选择竞猜开始时间"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="抽取结束时间"
              width="240"
            >
              <template slot-scope="scope">
                <el-date-picker
                  :clearable="false"
                  :default-value="defaultDate"
                  v-model="scope.row.endTime"
                  type="datetime"
                  placeholder="选择竞猜结束时间"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              prop="publicTime"
              label="系统公布时间"
              width="240"
            >
              <template slot-scope="scope">
                <el-date-picker
                  :clearable="false"
                  :default-value="defaultDate"
                  v-model="scope.row.publicTime"
                  type="datetime"
                  placeholder="选择系统公布时间"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- <a href="javascript:void(0)" @click="item.steps.splice(scope.$index,1)">移除</a> -->
                <el-button
                  type="text"
                  @click="item.steps.splice(scope.$index,1)"
                >移除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="row-item">
            <a
              href="javascript:void(0)"
              @click="$set(item,'steps',item.steps||[]);item.steps.push({allowCount:0,systemCount:0,startTime:'',endTime:'',publicTime:''})"
            >添加竞猜</a>
          </div>
        </template>

      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: "normal-condition",
  props: ["activityIsTimeOut", "selectedList", "config"],
  data() {
    return {
      listSelected: [],
      loading: null
    };
  },
  computed: {
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
    }
  },
  mounted() {
    this.listSelected = this.selectedList;
  },
  methods: {
    checkDisabled(list, item) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] == item.conditionId) return false;
      }
      return true;
    },
    uploadBefore(file) {
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
    //上传成功
    uploadSuccess(res, file) {
      this.loading.close();
      this.$emit("changePercent", 0);
      this.$message({
        message: "上传成功",
        type: "success"
      });
      this.config.forEach(item => {
        if (item.conditionId == "ce59f4f3-75c9-472b-bfe7-0280405df206") {
          //固定玩家资格配置
          item.importId = res.state;
        }
      });
    },
    //上传失败
    uploadError(res, file) {
      this.loading.close();
      this.$emit("changePercent", 0);
      this.$message.error("上传失败");
    },
    //上传进度事件
    uploadProgress(event, file) {
      let load = event.loaded;
      let total = event.total;
      this.$emit("changePercent", Number((load / total * 100).toFixed(0)));
      // this.uploadPercent = Number((load / total * 100).toFixed(0));
    }
  },
  watch: {
    selectedList: {
      deep: true,
      handler(v, ov) {
        if (v != ov) {
          this.listSelected = this.selectedList;
        }
      }
    },
    listSelected: {
      deep: true,
      handler(v, ov) {
        if (v != ov) {
          this.$emit("changeSelectedList", this.listSelected);
        }
      }
    }
  }
};
</script>
