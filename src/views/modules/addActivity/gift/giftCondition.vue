<template>
  <div>
    <template v-for="item in config">
      <!--抽奖奖励配置-->
      <div
        v-if="item.conditionId=='cdecc0f8-618e-4ec3-947b-96ab360f6a8b'&&activityType==1"
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
            v-model="item.percent"
            :disabled="checkDisabled(listSelected,item)"
          />%
        </template>
      </div>
      <!--关联消耗品-->
      <div
        v-if="item.conditionId=='29a206ba-59db-4505-b2e2-7a7bc7e1fb5c'"
        class="row-item"
      >
        <el-checkbox
          class="radio"
          v-model="listSelected"
          :label="item.conditionId"
        >{{item.conditionName}}
        </el-checkbox>
        <template v-if="!checkDisabled(listSelected,item)">
          <!-- <el-button type="default">关联活动</el-button> -->
          <div class="row-item">
            关联
            <el-select
              v-model="item.ActivityId"
              placeholder="请选择活动"
              style="width:140px;"
            >
              <el-option
                v-for="(item,index) in activityList"
                :label="item.activityBase.activityName"
                :key="index"
                :value="item.activityBase.actId"
                :title="item.activityBase.activityName"
              ></el-option>
            </el-select>
            <el-select
              v-model="item.type"
              placeholder="请选择类型"
              style="width:140px;"
            >
              <el-option
                label="消耗"
                :value="1"
              ></el-option>
              <el-option
                label="累计达到"
                :value="2"
              ></el-option>
            </el-select>
            <el-input
              class="form-num-input"
              v-model="item.count"
              :disabled="checkDisabled(listSelected,item)"
            /> 积分
          </div>
        </template>
      </div>
      <!--活动到达指定天数可领取-->
      <div
        v-if="item.conditionId=='48d5f4a0-153e-49fd-ac3b-b5d8250714d3'"
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
            活动开始后,第
            <el-input
              class="form-num-input"
              v-model="item.OverDate"
              :disabled="checkDisabled(listSelected,item)"
            />天后可领取
          </div>
        </template>
      </div>
      <!--领取人数到达指定数量可以领取配置-->
      <div
        v-if="item.conditionId=='9b0ad46c-6138-40aa-9a86-ea76c117dac1'"
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
            参与人数大于等于
            <el-input
              class="form-num-input"
              v-model="item.limitCount"
              :disabled="checkDisabled(listSelected,item)"
            />
          </div>
        </template>
      </div>

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
        <el-tag type="danger">如不配置玩家可无限次领取（当活动配置为抽奖时，可以控制是否出现在奖池中）</el-tag>
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
      <!--内定条件配置-->
      <div
        v-if="item.conditionId=='4a71353d-b195-46d4-a5ce-335778fa59fc'"
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
            v-model="item.thirdGameZoneId"
            :disabled="checkDisabled(listSelected,item)"
            placeholder="区服ID"
          />
          <el-input
            class="form-num-input"
            v-model="item.userId"
            :disabled="checkDisabled(listSelected,item)"
            placeholder="用户ID"
          />
        </template>
      </div>
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
            时间内
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
            <template v-if="item.loginType!=1&&item.loginType!=3">
              <el-input
                class="form-num-input"
                v-model="item.LoginCount"
                :disabled="checkDisabled(listSelected,item)"
              />天
            </template>
          </div>
        </template>
      </div>
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
          />级
        </template>
      </div>
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
              label="单日充值达成3"
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
      <!--在线时长 单位秒-->
      <div
        v-if="item.conditionId=='97046173-2b9b-478b-8b4f-f81122150589'"
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
          在线时长
          <el-input
            class="form-num-input"
            v-model="item.onlineTime"
            :disabled="checkDisabled(listSelected,item)"
            placeholder="在线时长"
          /> 秒
        </div>
      </div>
      <!--end-->
      <!--受邀人数量,用于奖励-->
      <div
        v-if="item.conditionId=='bb1963c6-454f-4b6b-b894-71ef9198469c'"
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
          受邀人数量
          <el-input
            class="form-num-input"
            v-model="item.invitedCount"
            :disabled="checkDisabled(listSelected,item)"
            placeholder="在线时长"
          /> 人
        </div>
      </div>
      <!--end-->
      <!--参与人数配置-->
      <div
        v-if="item.conditionId=='66c3e106-f15c-4c1e-8e4b-94d53e66c738'"
        class="row-item"
      >
        <el-checkbox
          class="radio"
          v-model="listSelected"
          :label="item.conditionId"
        >{{item.conditionName}}
        </el-checkbox>
        <template v-if="!checkDisabled(listSelected,item)">
          <div class="row-item child-group">总参与人数达到
            <el-input
              class="form-num-input"
              v-model="item.sumCount"
              :disabled="checkDisabled(listSelected,item)"
            /> 可领取
          </div>
        </template>
      </div>

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
      <div
        v-if="item.conditionId=='0f8323f5-a158-43c6-9931-fcfdcd52d2a6'"
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
            总共只允许指定数量的用户参与活动
            <el-input
              class="form-num-input"
              v-model="item.totalJoinCountLimit"
            ></el-input>
          </div>
        </template>
      </div>
      <!--end-->

      <!--竞猜个数-->
      <div
        v-if="item.conditionId=='6710ab18-e933-411f-abfe-67b404193ba1'"
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
            v-model="item.ticketCount"
          /> 个
        </template>
      </div>

      <!--游戏任务积分条件-->
      <div
        v-if="item.conditionId=='f43bffe8-37af-4f78-bf79-6de2677717af'"
        class="row-item"
      >
        <el-checkbox
          class="radio"
          v-model="listSelected"
          :label="item.conditionId"
        >{{item.conditionName}}
        </el-checkbox>
        <el-tag type="danger">目前仅适用于3DS</el-tag>
        <div
          class="row-item child-group"
          v-if="!checkDisabled(listSelected,item)"
        >
          <div class="row-item">
            <div class="game-task-row-title">操作ID:</div>
            <el-input
              class="form-input"
              v-model="item.operatorId"
              :disabled="checkDisabled(listSelected,item)"
              placeholder="根据研发文档填写"
            />
          </div>
          <div class="row-item">
            <div class="game-task-row-title">道具ID:</div>
            <el-input
              class="form-input"
              v-model="item.toolsId"
              :disabled="checkDisabled(listSelected,item)"
              placeholder="根据研发文档填写"
            />
          </div>
          <div class="row-item">
            <div class="game-task-row-title">类型:</div>
            <el-input
              class="form-input"
              v-model="item.type"
              :disabled="checkDisabled(listSelected,item)"
              placeholder="根据研发文档填写"
            />
          </div>
          <div class="row-item">
            <div class="game-task-row-title">逻辑:</div>
            <el-select v-model="item.logic">
              <el-option
                value=""
                label="空"
              ></el-option>
              <el-option value="="></el-option>
              <el-option value=">"></el-option>
              <el-option value="<"></el-option>
              <el-option value=">="></el-option>
              <el-option value="<="></el-option>
            </el-select>
          </div>
          <div class="row-item">
            <div class="game-task-row-title">变化值:</div>
            <el-input
              class="form-input"
              v-model="item.changev"
              :disabled="checkDisabled(listSelected,item)"
              placeholder="根据研发文档填写,必填"
            />
          </div>
          <div class="row-item">
            <div class="game-task-row-title">达成值:</div>
            <el-input
              class="form-input"
              v-model="item.achieveValue"
              :disabled="checkDisabled(listSelected,item)"
              placeholder="根据研发文档填写,必填"
            />
          </div>
          <div class="row-item">
            <div class="game-task-row-title">计算方式:</div>
            <el-select v-model="item.calcWay">
              <el-option
                label="累计变化值"
                :value="1"
              ></el-option>
              <el-option
                label="日志记录条数"
                :value="2"
              ></el-option>
            </el-select>
            <div class="form-item-tip">
              日志记录条数，如公会捐献次数，每次一条记录，取记录数作为完成任务次数；<br />累计变化值，如消耗钻石数，要求和每条记录的变化值
            </div>
          </div>
          <div class="row-item">
            <div class="game-task-row-title">任务类型:</div>
            <el-select v-model="item.dateType">
              <el-option
                label="每日任务"
                :value="1"
              ></el-option>
              <el-option
                label="循环任务"
                :value="2"
              ></el-option>
            </el-select>
            <div class="form-item-tip">
              每日任务，每天可领取；<br />循环任务则表示达成游戏任务即可参与，不限次数。
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'normal-condition',
  props: ['activityInfo', 'selectedActivity', 'selectedList', 'config'],
  data() {
    return {
      showJoinTimesLimit: true,
      listSelected: [],
      loading: null
    }
  },
  computed: {
    defaultDate() {
      let now = new Date()
      now.setHours(0)
      now.setMinutes(0)
      now.setSeconds(0)
      return now
    },
    // 获取当前活动的活动类型
    activityType() {
      return this.selectedActivity.activityBase.rewardType //this.$store.state.selectedActivity.activityBase.rewardType;
    },
    // 过滤活动为消耗品并且未结束的活动列表
    activityList() {
      let list = this.activityInfo // this.$store.state.activityInfo;
      return list.activityDecoratorList
      // .filter(item => {
      //   let now = moment();
      //   let start = moment(item.startTime);
      //   let end = moment(item.endTime);
      //   return item.activityBase.rewardType == 3 && now <= end;
      // });
    },
    headers() {
      return {
        Authorization: 'Basic ' + this.$store.state.userCode
      }
    },
    requestUrl() {
      return this.$store.state.requestUrl
    }
  },
  mounted() {
    this.listSelected = this.selectedList
  },
  methods: {
    checkDisabled(list, item) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] == item.conditionId) return false
      }
      return true
    }
  },
  watch: {
    selectedList: {
      deep: true,
      handler(v, ov) {
        if (v != ov) {
          this.listSelected = this.selectedList
        }
      }
    },
    listSelected: {
      deep: true,
      handler(v, ov) {
        if (v != ov) {
          this.$emit('changeSelectedList', this.listSelected)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.game-task-row-title {
  width: 70px;
  display: inline-block;
  vertical-align: middle;
}
</style>
