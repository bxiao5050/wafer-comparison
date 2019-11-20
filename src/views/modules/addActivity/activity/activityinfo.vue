<template>
  <div
    class="page-form"
    v-if="editData"
  >
    <!-- <h5 class="form-title" slot="title">活动配置</h5> -->
    <div class="dialog-footer">
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
        @click="confirmEdit"
        :disabled="!isPermiss(selectedGroup.createUser)"
      >修改活动</el-button>
      <!-- <el-button type="default" size="small" @click="closeModal">取消</el-button> -->
    </div>
    <div class="inline-form">
      <div class="inline-form-item first">
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          label-position="left"
          class="my-dialog-form"
          v-if="form"
        >
          <el-form-item label="活动ID:">
            <span>{{form.actId}}</span>
          </el-form-item>
          <el-form-item label="活动状态:">
            <el-switch
              v-model="form.state"
              active-text="正常"
              inactive-text="暂停"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="活动名称:">
            <el-input
              v-model="form.activityName"
              class="form-input"
              placeholder="请输入活动名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动时间:">
            <el-date-picker
              :clearable="false"
              style="width:200px"
              :default-value="defaultDate"
              v-model="form.date[0]"
              type="datetime"
              placeholder="选择开始时间"
            >
            </el-date-picker>
            <el-date-picker
              :clearable="false"
              style="width:200px"
              :default-value="defaultDate"
              v-model="form.date[1]"
              type="datetime"
              placeholder="选择结束时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="活动类别:">
            <el-radio-group v-model="form.rewardType">
              <el-row class="reward-type">
                <el-radio :label="1">抽奖</el-radio>
                <el-radio :label="2">直接领取</el-radio>
                <!-- <el-radio :label="3">消耗品</el-radio> -->
                <el-radio :label="4">邀请/召回</el-radio>
                <el-radio :label="5">翻翻乐</el-radio>
              </el-row>
              <el-row class="reward-type">
                <el-radio :label="6">宝箱</el-radio>
              </el-row>

            </el-radio-group>
            <div class="form-item-tip">注意:切换活动类别后需要重新配置条件</div>
          </el-form-item>

          <el-form-item label="排序:">
            <el-input
              v-model="form.index"
              class="form-num-input"
              placeholder="序号"
            ></el-input>
            <div class="form-item-tip">注意:请按照活动顺序配置序号</div>
          </el-form-item>
          <el-form-item label="活动说明:">
            <el-input
              type="textarea"
              class="form-input"
              :row="2"
              v-model="form.ActivityDescription"
              placeholder="请输入活动说明"
            />
          </el-form-item>

        </el-form>
      </div>
      <div class="inline-form-item second">
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          label-position="left"
          class="my-dialog-form"
          v-if="form"
        >
          <el-form-item>
            条件配置:
          </el-form-item>
          <el-form-item>

            <el-collapse
              v-model="inviteType"
              v-if="form.rewardType===4"
            >
              <el-collapse-item
                title="邀请人"
                :name="1"
              >
                <normalCondition
                  :selectedList="selectedList1"
                  :config="specialConfig.config1"
                  @changePercent="changePercent"
                  @changeSelectedList="changeSelectedList1"
                ></normalCondition>
              </el-collapse-item>
              <el-collapse-item
                title="被邀请人"
                :name="2"
              >
                <normalCondition
                  :selectedList="selectedList2"
                  :config="specialConfig.config2"
                  @changePercent="changePercent"
                  @changeSelectedList="changeSelectedList2"
                ></normalCondition>
              </el-collapse-item>
            </el-collapse>

            <el-collapse
              v-model="inviteType"
              v-else-if="form.rewardType===5"
            >

              <el-row class="mb-16">
                <el-input
                  class="wt-240"
                  placeholder="翻牌总数"
                  v-model="extra[form.rewardType].total"
                >
                  <template slot="prepend">翻牌总数</template>
                </el-input>
              </el-row>

              <el-row class="mb-16">
                <el-input
                  class="wt-240"
                  placeholder="炸弹总数"
                  v-model="extra[form.rewardType].empty"
                >
                  <template slot="prepend">炸弹总数</template>
                </el-input>
              </el-row>

              <el-row class="mb-16">
                <el-input
                  class="wt-240"
                  @change="formRateChanged"
                  placeholder="炸弹概率"
                  v-model="extra[form.rewardType].rate"
                >
                  <template slot="prepend">炸弹概率</template>
                  <template slot="append">%</template>
                </el-input>
              </el-row>

              <el-row class="mb-16">
                <el-input
                  class="wt-240"
                  placeholder="炸弹名称"
                  v-model="extra[form.rewardType].rewardName"
                >
                  <template slot="prepend">炸弹名称</template>
                </el-input>
              </el-row>

              <el-form-item label="炸弹图鉴">
                <el-upload
                  class="avatar-uploader"
                  name="uploadfile"
                  :headers="headers"
                  :action="requestUrl+'/admin/upload/resource'"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="uploadBefore"
                  :on-progress="uploadProgress"
                  :on-error="uploadError"
                >
                  <img
                    class="avatar-uploader-icon"
                    v-if="extra[form.rewardType].image"
                    :src="requestUrl+'/admin/image/get?resourceId='+extra.image"
                  >
                  <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                  ></i>
                </el-upload>
              </el-form-item>

              <el-form-item>
                任务:
              </el-form-item>

              <!-- 充值 -->
              <el-row class="mb-16">
                <el-row
                  type="flex"
                  align="middle"
                >
                  <el-checkbox
                    class="radio"
                    v-model="extra[form.rewardType].task.recharge.active"
                  >
                    充值
                  </el-checkbox>
                  <el-dropdown
                    v-if="extra[form.rewardType].task.recharge.active"
                    trigger="click"
                    style="margin-left: 20px"
                    @command="addExtralist"
                  >
                    <el-button
                      type="primary"
                      icon="condition el-icon-plus"
                      circle
                      style="   
                    width: 26px;
                    height: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: center;"
                    >
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="{type:1,name:'recharge'}">充值满 x 钻可以获得 t 次数</el-dropdown-item>
                      <el-dropdown-item :command="{type:2,name:'recharge'}">累计充值满 x 钻获得 t 次数</el-dropdown-item>
                      <el-dropdown-item :command="{type:3,name:'recharge'}">每天充值 x 钻，连续充值满 z 天可以获得 t 次数</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-row>

                <template v-if="extra[form.rewardType].task.recharge.active">
                  <el-row>
                    <el-switch
                      v-model="extra[form.rewardType].task.recharge.reset"
                      active-text="每日重置"
                      inactive-text="每日不重置"
                      @change="extraReset"
                    >
                    </el-switch>
                  </el-row>
                  <el-row
                    v-for="(item, index) in extra[form.rewardType].task.recharge.condition"
                    :key="index"
                  >
                    <el-row
                      type="flex"
                      align="middle"
                      v-if="item.type===1"
                    >
                      <span style="display: inline-block; width: 72px">
                        充值满
                      </span>
                      <el-input
                        class="wt-85"
                        v-model="extra[form.rewardType].task.recharge.condition[index].amount"
                      /> 钻可以获得
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.recharge.condition[index].times"
                      /> 次数
                      <i
                        class="el-icon-remove"
                        style="font-size: 26px; color: #fff; cursor: pointer; margin-left: 10px"
                        @mouseenter="mouseenter"
                        @mouseleave="mouseleave"
                        @click="removeExtralist.call(this, 'recharge', index)"
                      ></i>
                    </el-row>

                    <el-row
                      type="flex"
                      align="middle"
                      v-else-if="item.type===2"
                    >
                      <span style="display: inline-block; width: 72px">
                        累计充值满
                      </span>
                      <el-input
                        class="wt-85"
                        v-model="extra[form.rewardType].task.recharge.condition[index].amount"
                      /> 钻可以获得
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.recharge.condition[index].times"
                      /> 次数
                      <i
                        class="el-icon-remove"
                        style="font-size: 26px; color: #fff; cursor: pointer; margin-left: 10px"
                        @mouseenter="mouseenter"
                        @mouseleave="mouseleave"
                        @click="removeExtralist.call(this, 'recharge', index)"
                      ></i>
                    </el-row>

                    <el-row
                      type="flex"
                      align="middle"
                      v-else-if="item.type===3"
                    >
                      <span style="display: inline-block; width: 72px">
                        每天充值
                      </span>
                      <el-input
                        class="wt-85"
                        v-model="extra[form.rewardType].task.recharge.condition[index].amount"
                      /> 钻，连续充值满
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.recharge.condition[index].days"
                      /> 天可以获得 t 次数
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.recharge.condition[index].times"
                      /> 次数
                      <i
                        class="el-icon-remove"
                        style="font-size: 26px; color: #fff; cursor: pointer; margin-left: 10px"
                        @mouseenter="mouseenter"
                        @mouseleave="mouseleave"
                        @click="removeExtralist.call(this, 'recharge', index)"
                      ></i>
                    </el-row>
                  </el-row>
                </template>
              </el-row>

              <!-- 消费 -->
              <el-row class="mb-16">
                <el-row
                  type="flex"
                  align="middle"
                >
                  <el-checkbox
                    class="radio"
                    v-model="extra[form.rewardType].task.consume.active"
                  >
                    消费
                  </el-checkbox>
                  <el-dropdown
                    v-if="extra[form.rewardType].task.consume.active"
                    trigger="click"
                    style="margin-left: 20px"
                    @command="addExtralist"
                  >
                    <el-button
                      type="primary"
                      icon="condition el-icon-plus"
                      circle
                      style="
                    width: 26px;
                    height: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: center;"
                    >
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="{type:1,name:'consume'}">一次性消费满 x 钻可以获得 t 次数</el-dropdown-item>
                      <el-dropdown-item :command="{type:2,name:'consume'}">累计消费满 x 钻获得 t 次数</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-row>

                <template v-if="extra[form.rewardType].task.consume.active">
                  <el-row>
                    <el-switch
                      v-model="extra[form.rewardType].task.consume.reset"
                      active-text="每日重置"
                      inactive-text="每日不重置"
                      @change="extraReset"
                    >
                    </el-switch>
                  </el-row>
                  <el-row
                    v-for="(item, index) in extra[form.rewardType].task.consume.condition"
                    :key="index"
                  >
                    <el-row
                      type="flex"
                      align="middle"
                      v-if="item.type===1"
                    >
                      <span style="display: inline-block; width: 86px">
                        一次性消费满
                      </span>
                      <el-input
                        class="wt-85"
                        v-model="extra[form.rewardType].task.consume.condition[index].amount"
                      /> 钻可以获得
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.consume.condition[index].times"
                      /> 次数
                      <i
                        class="el-icon-remove"
                        style="font-size: 26px; color: #fff; cursor: pointer; margin-left: 10px"
                        @mouseenter="mouseenter"
                        @mouseleave="mouseleave"
                        @click="removeExtralist.call(this, 'consume', index)"
                      ></i>
                    </el-row>

                    <el-row
                      type="flex"
                      align="middle"
                      v-else-if="item.type===2"
                    >
                      <span style="display: inline-block; width: 86px">
                        累计消费满
                      </span>
                      <el-input
                        class="wt-85"
                        v-model="extra[form.rewardType].task.consume.condition[index].amount"
                      /> 钻可以获得
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.consume.condition[index].times"
                      /> 次数
                      <i
                        class="el-icon-remove"
                        style="font-size: 26px; color: #fff; cursor: pointer; margin-left: 10px"
                        @mouseenter="mouseenter"
                        @mouseleave="mouseleave"
                        @click="removeExtralist.call(this, 'consume', index)"
                      ></i>
                    </el-row>
                  </el-row>
                </template>
              </el-row>

              <!-- 登录 -->
              <el-row class="mb-16">
                <el-row
                  type="flex"
                  align="middle"
                >
                  <el-checkbox
                    class="radio"
                    v-model="extra[form.rewardType].task.login.active"
                  >
                    登录
                  </el-checkbox>

                  <el-dropdown
                    v-if="extra[form.rewardType].task.login.active"
                    trigger="click"
                    style="margin-left: 20px"
                    @command="addExtralist"
                  >
                    <el-button
                      type="primary"
                      icon="condition el-icon-plus"
                      circle
                      style="
                    width: 26px;
                    height: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: center;"
                    >
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="{type:1,name:'login'}">每日登录获得 t 次数</el-dropdown-item>
                      <el-dropdown-item :command="{type:2,name:'login'}">连续登录 x 天可以获得 t 次数</el-dropdown-item>
                      <el-dropdown-item :command="{type:3,name:'login'}">在a时段至b时段登录可以获得 t 次数</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>

                </el-row>

                <template v-if="extra[form.rewardType].task.login.active">
                  <el-row
                    v-for="(item, index) in extra[form.rewardType].task.login.condition"
                    :key="index"
                  >

                    <el-row
                      type="flex"
                      align="middle"
                      v-if="item.type===1"
                    >
                      <span style="display: inline-block; width: 86px">
                        每日登录获得
                      </span>
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.login.condition[index].times"
                      /> 次数
                      <i
                        class="el-icon-remove"
                        style="font-size: 26px; color: #fff; cursor: pointer; margin-left: 10px"
                        @mouseenter="mouseenter"
                        @mouseleave="mouseleave"
                        @click="removeExtralist.call(this, 'login', index)"
                      ></i>
                    </el-row>

                    <el-row
                      type="flex"
                      align="middle"
                      v-else-if="item.type===2"
                    >
                      <span style="display: inline-block; width: 86px">
                        连续登录
                      </span>
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.login.condition[index].days"
                      /> 天可以获得
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.login.condition[index].times"
                      /> 次数
                      <i
                        class="el-icon-remove"
                        style="font-size: 26px; color: #fff; cursor: pointer; margin-left: 10px"
                        @mouseenter="mouseenter"
                        @mouseleave="mouseleave"
                        @click="removeExtralist.call(this, 'login', index)"
                      ></i>
                    </el-row>

                    <el-row
                      type="flex"
                      align="middle"
                      v-else-if="item.type===3"
                    >
                      <span style="display: inline-block; width: 86px">
                        在
                      </span>

                      <el-date-picker
                        v-model="extra[form.rewardType].task.login.condition[index].date"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      >
                      </el-date-picker>
                      时段内登录可以获得
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.login.condition[index].times"
                      /> 次数
                      <i
                        class="el-icon-remove"
                        style="font-size: 26px; color: #fff; cursor: pointer; margin-left: 10px"
                        @mouseenter="mouseenter"
                        @mouseleave="mouseleave"
                        @click="removeExtralist.call(this, 'login', index)"
                      ></i>
                    </el-row>

                  </el-row>
                </template>
              </el-row>

              <!-- 等级 -->
              <el-row class="mb-16">
                <el-row
                  type="flex"
                  align="middle"
                >
                  <el-checkbox
                    class="radio"
                    v-model="extra[form.rewardType].task.level.active"
                  >
                    等级
                  </el-checkbox>

                  <el-button
                    type="primary"
                    v-if="extra[form.rewardType].task.level.active"
                    icon="condition el-icon-plus"
                    circle
                    style="
                    margin-left: 20px;
                    width: 26px;
                    height: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: center;"
                    @click="addExtralist.call(this, {name:'level'})"
                  >
                  </el-button>
                </el-row>

                <template v-if="extra[form.rewardType].task.level.active">
                  <el-row
                    v-for="(item, index) in extra[form.rewardType].task.level.condition"
                    :key="index"
                  >

                    <el-row
                      type="flex"
                      align="middle"
                    >
                      <span style="display: inline-block; width: 56px">
                        等级达到
                      </span>
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.level.condition[index].level"
                      />
                      级，获得
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.level.condition[index].times"
                      />
                      次数
                      <i
                        class="el-icon-remove"
                        style="font-size: 26px; color: #fff; cursor: pointer; margin-left: 10px"
                        @mouseenter="mouseenter"
                        @mouseleave="mouseleave"
                        @click="removeExtralist.call(this, 'level', index)"
                      ></i>
                    </el-row>

                  </el-row>
                </template>
              </el-row>

              <!-- 消耗 -->
              <el-row class="mb-16">
                <el-row
                  type="flex"
                  align="middle"
                >
                  <el-checkbox
                    class="radio"
                    v-model="extra[form.rewardType].task.strength.active"
                  >
                    消耗
                  </el-checkbox>

                  <el-button
                    type="primary"
                    v-if="extra[form.rewardType].task.strength.active"
                    icon="condition el-icon-plus"
                    circle
                    style="
                    margin-left: 20px;
                    width: 26px;
                    height: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: center;"
                    @click="addExtralist.call(this, {name:'strength'})"
                  >
                  </el-button>
                </el-row>

                <template v-if="extra[form.rewardType].task.strength.active">
                  <el-row
                    v-for="(item, index) in extra[form.rewardType].task.strength.condition"
                    :key="index"
                  >

                    <el-row
                      type="flex"
                      align="middle"
                    >
                      <span style="display: inline-block; width: 46px">
                        消耗
                      </span>
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.strength.condition[index].strength"
                      />
                      体力，获得
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.strength.condition[index].times"
                      />
                      次数
                      <i
                        class="el-icon-remove"
                        style="font-size: 26px; color: #fff; cursor: pointer; margin-left: 10px"
                        @mouseenter="mouseenter"
                        @mouseleave="mouseleave"
                        @click="removeExtralist.call(this, 'strength', index)"
                      ></i>
                    </el-row>

                  </el-row>
                </template>
              </el-row>

              <!-- 分享 -->
              <el-row class="mb-16">
                <el-row
                  type="flex"
                  align="middle"
                >
                  <el-checkbox
                    class="radio"
                    v-model="extra[form.rewardType].task.facebook.active"
                  >
                    分享
                  </el-checkbox>
                </el-row>

                <template v-if="extra[form.rewardType].task.facebook.active">
                  <el-row>

                    <el-row
                      type="flex"
                      align="middle"
                    >
                      <span style="display: inline-block; width: 100px">
                        每日分享可获得
                      </span>
                      <el-input
                        class="wt-50"
                        v-model="extra[form.rewardType].task.facebook.times"
                      />
                      次数
                    </el-row>

                  </el-row>
                </template>
              </el-row>

              <el-input
                v-model="extra[form.rewardType].rewardId"
                :value="'-1'"
                v-show="false"
              ></el-input>
            </el-collapse>

            <!-- v-model="inviteType" -->
            <el-collapse v-else-if="form.rewardType===6">
              <el-row>
                每日登陆游戏奖励 增加
                <el-input
                  class="wt-85"
                  v-model="extra[form.rewardType].dayLimit"
                />
                次
              </el-row>
              <el-row
                type="flex"
                align="middle"
              >
                fb分享后奖励 增加
                <el-input
                  class="wt-85"
                  v-model="extra[form.rewardType].fbLimit"
                />
                次
                <el-switch
                  v-model="extra[form.rewardType].fbAdd"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="累计"
                  inactive-text="单次"
                  style="margin-left: 25px"
                >
                </el-switch>
              </el-row>
              <el-row>
                支付
                <el-input
                  class="wt-85"
                  v-model="extra[form.rewardType].payLimit"
                />
                奖励 增加1次
              </el-row>
              <el-row>
                消费
                <el-input
                  class="wt-85"
                  v-model="extra[form.rewardType].consumeLimit"
                />
                奖励 增加1次
              </el-row>
              <el-row>
                许愿后奖励 增加
                <el-input
                  class="wt-85"
                  v-model="extra[form.rewardType].wishLimit"
                />次
              </el-row>

              <el-table
                v-if="rewardDecoratorList.length"
                :data="this.extra[6].condition"
              >
                <el-table-column
                  property="0"
                  label="开启次数"
                  :formatter="formatter_6"
                >
                </el-table-column>
                <el-table-column
                  property="1"
                  label="需要钥匙"
                  :formatter="formatter_6"
                >
                </el-table-column>
                <el-table-column
                  property="2"
                  label="免费赠送钥匙"
                  width="110"
                  :formatter="formatter_6"
                >
                </el-table-column>
                <el-table-column
                  property="3"
                  label="需要消耗"
                  :formatter="formatter_6"
                >
                </el-table-column>
                <el-table-column
                  property="4"
                  label="档位"
                  :formatter="formatter_6"
                >
                </el-table-column>
              </el-table>
            </el-collapse>

            <!--活动类型不为邀请召回-->
            <normalCondition
              v-else
              :selectedList="selectedList"
              :config="config"
              @changePercent="changePercent"
              @changeSelectedList="changeSelectedList"
            ></normalCondition>
            <!--活动类型为邀请召回-->

          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>

  <div v-else>活动信息为空</div>
</template>
<script>
import services from '@/services'
import normalCondition from './activityCondition.vue'
import activityConfig from '@/views/modules/activelist/components/activityConfig'
import conditionCheck from '@/services/conditionCheck'
import permiss from '@/services/permiss'
export default {
  name: 'active-edit',
  props: ['selectedGroup', 'editData'],
  components: {
    normalCondition
  },
  computed: {
    userinfo() {
      return this.$store.state.userInfo
    },
    // extraData() {
    //   if (this.form.rewardType === 5) {
    //     return JSON.parse(this.extra)
    //   }
    //   return null
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
      let Authorization = 'Basic ' + this.$store.state.userCode
      return { Authorization }
    },
    requestUrl() {
      return this.$store.state.requestUrl
    },
    rewardDecoratorList() {
      console.log('rewardDecoratorList')
      let list = this.editData.rewardDecoratorList
      if (list.length) {
        let conditionLen = this.extra[6].condition.length
        if (list.length > conditionLen) {
          for (let i = this.extra[6].condition.length; i < list.length; i++) {
            this.extra[6].condition.push([i + 1, 0, 0, 0, 0])
            this.extra[6].rewardIdList.push(
              list[i].rewardBase.rewardId
            )
          }
        }
        else if (list.length < conditionLen) {
          for (let i = 0; i < conditionLen; i++) {
            let rewardId = list[i] ? list[i].rewardBase.rewardId : -1
            let rewardId2 = this.extra[6].rewardIdList[i]
            if (rewardId !== rewardId2) {
              this.extra[6].rewardIdList.splice(i, 1)
              this.extra[6].condition.splice(i, 1)
              break;
            }
          }
        }
      }
      return this.extra[6].condition
    },
    // activityIsTimeOut() {
    //   if (
    //     this.editData.activityBase.startTime &&
    //     this.editData.activityBase.endTime
    //   ) {
    //     let now = moment();
    //     let start = moment(this.editData.activityBase.startTime);
    //     let end = moment(this.editData.activityBase.endTime);
    //     if (now > end) {
    //       this.$notify({
    //         type: "warning",
    //         customClass: "custom-notify",
    //         message: "活动已结束"
    //       });
    //       return true;
    //     }
    //     return false;
    //   }
    //   return true;
    // }
  },
  data() {
    return {
      imageUrl: null,
      form: {
        activityName: '',
        date: [null, null],
        rewardType: 0,
        state: 0,
        index: 0,
        ActivityDescription: '',
      }, //固定表单数据
      selectedList: [], // 选中列表
      selectedList1: [], // 选中列表 邀请人
      selectedList2: [], // 选中列表 被邀请人
      extra: {
        5: {
          total: '',
          empty: '',
          rate: '',
          rewardName: '',
          rewardId: '-1',
          image: '',
          task: {
            recharge: {
              active: false,
              reset: true,
              condition: []
            },
            consume: {
              active: false,
              reset: true,
              condition: [],
            },
            login: {
              active: false,
              condition: []
            },
            level: {
              active: false,
              condition: []
            },
            strength: {
              active: false,
              condition: []
            },
            facebook: {
              active: false,
              times: ''
            }
          }
        },
        6: {
          dayLimit: 0,
          fbLimit: 0,
          fbAdd: false,
          payLimit: 0,
          consumeLimit: 0,
          wishLimit: 0,
          condition: [],
          rewardIdList: []
        }
      },
      config: [], // 常规条件 (抽奖，直接领取，消耗品)
      specialConfig: {
        config1: [], // 邀请
        config2: [] // 召回
      }, // 特殊条件 邀请/召回
      inviteType: [1, 2],
      loading: null, // loading
      // dateOption: {
      //   disabledDate: (date) => {
      //     let now = new Date()
      //     return moment(date) < moment([now.getFullYear(), now.getMonth(), now.getDate()])
      //   }
      // },
      uploadPercent: 0, // 上传文件loading状态
      isLoaded: false
    }
  },

  methods: {
    formatter_6(row, column, cellValue, index) {
      let i = column.property * 1
      return <el-input value={cellValue} onChange={(v) => {
        this.extra[6].condition[index][i] = Number(v)
        console.log('onChange', this.extra[6].condition)
      }} />
    },
    dataParse_6() {

    },
    dataParse(from, data) {
      if (from === 'server') {
        data.rate *= 100
        Object.keys(data.task).forEach(task => {
          data.task[task].active = Boolean(data.task[task].active)
          data.task[task].reset = Boolean(data.task[task].reset)
          if (data.task[task].active && task === 'login') {
            data.task[task].condition.forEach((item, index) => {
              if (item.type === 3) {
                data.task[task].condition[index].date = [
                  new Date(data.task[task].condition[index].start),
                  new Date(data.task[task].condition[index].end)
                ]
              }
            })
          }
        })
      } else if (from === 'view') {
        this.extra[this.form.rewardType].total *= 1
        if (!this.extra[this.form.rewardType].total) {
          this.$notify({
            message: '翻牌总数需要修改',
            type: 'error'
          })
          this.extra[this.form.rewardType].total = ''
          return false
        }
        if (!this.editData.activityBase.rewards || this.extra[this.form.rewardType].total !== this.editData.activityBase.rewards.length) {
          this.$notify({
            message: '翻牌总数与礼包数不对应',
            type: 'error'
          })
          return false
        }

        this.extra[this.form.rewardType].empty *= 1
        if (!this.extra[this.form.rewardType].empty) {
          this.$notify({
            message: '炸弹总数需要修改',
            type: 'error'
          })
          this.extra[this.form.rewardType].empty = ''
          return false
        }

        data.rate /= 100
        if (!data.rate) {
          this.$notify({
            message: '炸弹概率需要修改',
            type: 'error'
          })
          this.extra[this.form.rewardType].rate = ''
          return false
        }

        if (!this.extra[this.form.rewardType].rewardName) {
          this.$notify({
            message: '炸弹名称不能为空',
            type: 'error'
          })
          return false
        }

        for (var taskName in data.task) {
          data.task[taskName].active = Number(data.task[taskName].active)
          data.task[taskName].reset = Number(data.task[taskName].reset) || 0

          var isActive = data.task[taskName].active && (data.task[taskName].condition ? data.task[taskName].condition.length : true)

          if (isActive) {
            var condition = data.task[taskName].condition || data.task[taskName].times
            if (condition) {
              if (Object.prototype.toString.call(condition) === '[object Array]') {
                var $i = 0
                for (var conditionItem of condition) {
                  for (var taskItem in conditionItem) {

                    if (taskName === 'login' && taskItem === 'date') {
                      var date = data.task[taskName].condition[$i][taskItem]

                      if (!date || !date[0] || !date[1]) {
                        this.$notify({
                          message: '任务条件错误',
                          type: 'error'
                        })
                        this.extra[this.form.rewardType].task[taskName].condition[$i][taskItem] = null
                        return false
                      } else {
                        data.task[taskName].condition[$i].start = moment(date[0]).format('YYYY-MM-DD HH:mm:ss')
                        data.task[taskName].condition[$i].end = moment(date[1]).format('YYYY-MM-DD HH:mm:ss')
                        delete data.task[taskName].condition[$i][taskItem]
                      }
                    } else {
                      conditionItem[taskItem] *= 1
                      if (!conditionItem[taskItem]) {
                        this.$notify({
                          message: '任务条件错误',
                          type: 'error'
                        })
                        this.extra[this.form.rewardType].task[taskName].condition[$i][taskItem] = ''
                        return false
                      }
                    }


                  }
                  $i++
                }
              } else {
                if (condition * 1 < 0) {
                  this.$notify({
                    message: '任务条件错误',
                    type: 'error'
                  })
                  this.extra[this.form.rewardType].task.facebook.times = ''
                  return false
                }
              }
            } else {
              this.$notify({
                message: '任务条件错误',
                type: 'error'
              })
              this.extra[this.form.rewardType].task.facebook.times = ''
              return false
            }

          }
          else {
            delete data.task[taskName]
          }
        }
      }
      return data
    },
    addExtralist(command) {
      switch (command.name) {
        case 'recharge':
          var add = {
            type: command.type,
            amount: 0,
            times: 0,
          }
          if (command.type === 3) {
            add.days = 0
          }
          this.extra[this.form.rewardType].task[command.name].condition.push(add)
          break
        case 'consume':
          var add = {
            type: command.type,
            amount: 0,
            times: 0,
          }
          this.extra[this.form.rewardType].task[command.name].condition.push(add)
          break
        case 'login':
          var add = {
            type: command.type,
            times: 0,
          }
          if (command.type === 2) {
            add.days = 0
          }
          if (command.type === 3) {
            add.date = []
          }
          this.extra[this.form.rewardType].task[command.name].condition.push(add)
          break
        case 'level':
          var add = {
            level: 0,
            times: 0,
          }
          this.extra[this.form.rewardType].task[command.name].condition.push(add)
          break
        case 'strength':
          var add = {
            strength: 0,
            times: 0,
          }
          this.extra[this.form.rewardType].task[command.name].condition.push(add)
          break
      }

    },
    mouseenter({ target }) {
      target.style.color = '#409EFF'
    },
    mouseleave({ target }) {
      target.style.color = '#fff'
    },
    removeExtralist(type, index) {
      this.extra[this.form.rewardType].task[type].condition.splice(index, 1)
    },
    extraReset(value) {
      this.extra[this.form.rewardType].task.recharge.reset = this.extra[this.form.rewardType].task.consume.reset = value
    },
    formRateChanged(value) {
      value = Math.floor(value) || 0
      value = Math.min(100, Math.max(0, value))
      this.extra[this.form.rewardType].rate = value
    },
    isPermiss(createUser) {
      return permiss(createUser)
    },
    initConfig() {
      this.config = JSON.parse(JSON.stringify(activityConfig.normal))
      this.specialConfig = {
        config1: JSON.parse(JSON.stringify(activityConfig.special)),
        config2: JSON.parse(JSON.stringify(activityConfig.special))
      }
    },
    initConditionList() {
      this.selectedList = []
      this.selectedList1 = []
      this.selectedList2 = []
      if (this.editData.andList) {
        this.editData.andList.forEach(listitem => {
          if (this.form.rewardType == 4) {
            this.specialConfig.config1.forEach(item => {
              // 接口参数替换
              if (item.conditionId == listitem.conditionId) {
                this.replaceObj(item, listitem)
                this.selectedList1.push(item.conditionId)
              }
            })
          } else {
            this.config.forEach(item => {
              // 接口参数替换
              if (item.conditionId == listitem.conditionId) {
                this.replaceObj(item, listitem)
                this.selectedList.push(item.conditionId)
              }
            })
          }
        })
      }
      if (this.editData.inviteList) {
        this.editData.inviteList.forEach(listitem => {
          if (this.form.rewardType == 4) {
            this.specialConfig.config2.forEach(item => {
              // 接口参数替换
              if (item.conditionId == listitem.conditionId) {
                this.replaceObj(item, listitem)
                this.selectedList2.push(item.conditionId)
              }
            })
          }
        })
      }
    },
    changePercent(num) {
      this.uploadPercent = num
    },
    changeSelectedList(list) {
      this.selectedList = list
    },
    changeSelectedList1(list) {
      this.selectedList1 = list
    },
    changeSelectedList2(list) {
      this.selectedList2 = list
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
    getConfigParams(selectedList, config) {
      let conditionList = []
      for (let i = 0; i < selectedList.length; i++) {
        let itemId = selectedList[i]
        for (let j = 0; j < config.length; j++) {
          let condition = config[j]
          if (condition.conditionId == itemId) {
            let conditionCreate = conditionCheck[itemId]
            if (conditionCreate) {
              let result = conditionCreate.conditionCheck('activity', condition)
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
      return conditionList
    },
    checkParams() {
      if (!this.form.activityName) {
        this.$message({
          message: '请输入活动名称',
          type: 'warning'
        })
        return false
      } else if (!this.form.date[0] || !this.form.date[1]) {
        this.$message({
          message: '请选择活动时间',
          type: 'warning'
        })
        return false
      } else if (!this.form.rewardType) {
        this.$message({
          message: '请选择活动类别',
          type: 'warning'
        })
        return false
      } else if (this.form.index === '') {
        this.$message({
          message: '请输入活动序号',
          type: 'warning'
        })
        return false
      }
      return true
    },
    confirmEdit() {
      if (!this.checkParams()) return
      let now = moment()
      let start = moment(this.form.date[0])
      let end = moment(this.form.date[1])
      if (now > end) {
        this.$confirm('当前活动已结束,继续修改可能导致活动数据重置,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.editActivity()
        })
      } else if (now > start) {
        this.$confirm('当前活动正在进行中,继续修改可能导致活动异常,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.editActivity()
        })
      } else {
        this.editActivity()
      }
    },
    getAndList() {
      switch (this.form.rewardType) {
        case 4:
          return this.getConfigParams(this.selectedList1, this.specialConfig.config1)
          break;
        case 5: // 翻翻乐
          return this.getConfigParams(this.selectedList1, this.specialConfig.config1)
          break;
        default:
          return this.getConfigParams(this.selectedList, this.config)
          break;
      }
    },
    getInviteList() {
      if (this.form.rewardType == 4) {
        return this.getConfigParams(
          this.selectedList2,
          this.specialConfig.config2
        )
      } else {
        return []
      }
    },
    /** 修改活动 */
    editActivity() {
      let andList = this.getAndList()
      let inviteList = this.getInviteList()
      if (!andList || !inviteList) {
        return
      }
      if (this.form.rewardType === 5) {
        var extra = this.dataParse('view', JSON.parse(JSON.stringify(this.extra[this.form.rewardType])))
        if (!extra) {
          return
        }
      }
      else if (this.form.rewardType === 6) {
        var extra = JSON.parse(JSON.stringify(this.extra[6]))
        if (!extra) {
          return
        }
        extra.condition = extra.condition.map((item) => {
          return item.join(',')
        })
        extra.fbAdd = Number(extra.fbAdd)
      }

      const conditionInfo = {
        actId: this.form.actId,
        actName: this.form.activityName,
        state: this.form.state,
        start: moment(this.form.date[0]).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(this.form.date[1]).format('YYYY-MM-DD HH:mm:ss'),
        rewardType: this.form.rewardType,
        index: this.form.index,
        // 活动说明
        ActivityDescription: this.form.ActivityDescription,
        andConditions: andList,
        inviteConditions: inviteList,
        extra
      }

      let params = {
        groupId: this.selectedGroup.groupId,
        conditionInfo: JSON.stringify(conditionInfo)
      }

      services.activity.updateActivity(params).then(data => {
        if (data.code == 200) {
          this.$notify({
            message: '活动修改成功!',
            type: 'success'
          })
          this.$emit('close')
          this.$emit('getActivityInfo')
        } else {
          this.$notify({
            message: data.state,
            type: 'warning'
          })
        }
      })
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
    //上传失败
    uploadError(res, file) {
      this.loading.close();
      this.uploadPercent = 0;
      this.$message.error("上传失败");
    },
    // //上传进度事件
    uploadProgress(event, file) {
      let load = event.loaded;
      let total = event.total;
      this.uploadPercent = Number((load / total * 100).toFixed(0));
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
      this.extra[this.form.rewardType].image = res.state
    },
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
    'form.rewardType': function (v, ov) {
      if (v != ov) {
        if (!ov) {
          //当初始化时
          this.initConditionList()
        } else {
          this.selectedList = []
          this.selectedList1 = []
          this.selectedList2 = []
        }
        // this.initConfig()
      }
    }
  },
  mounted() {
    if (this.editData) {
      requestAnimationFrame(() => {
        this.isLoaded = true
      })
      this.form = {
        actId: this.editData.activityBase.actId,
        activityName: this.editData.activityBase.activityName,
        state: this.editData.activityBase.state,
        date: [
          this.editData.activityBase.startTime,
          this.editData.activityBase.endTime
          // moment(new Date(this.editData.activityBase.startTime)).format('YYYY-MM-DD HH:mm:ss'),
          // moment(new Date(this.editData.activityBase.endTime)).format('YYYY-MM-DD HH:mm:ss')
        ],
        rewardType: this.editData.activityBase.rewardType || null,
        index: this.editData.activityBase.index,
        ActivityDescription:
          this.editData.activityBase.activityDescription || ''
      }

      var extra_5 = JSON.parse(JSON.stringify(this.extra[5]))
      if (this.editData.activityBase.rewardType === 5) {
        if (this.editData.activityBase.extra) {
          if (Object.prototype.toString.call(this.editData.activityBase.extra.task) === '[object String]') {
            this.editData.activityBase.extra.task = JSON.parse(this.editData.activityBase.extra.task)
          }
          var serverData = this.dataParse('server', this.editData.activityBase.extra)
          serverData.task = Object.assign(extra_5.task, serverData.task)
          this.extra[this.editData.activityBase.rewardType] = serverData
        } else {
          this.extra[this.editData.activityBase.rewardType] = extra_5
        }
      }

      /** extra_6 */
      var extra_6 = JSON.parse(JSON.stringify(this.extra[6]))
      if (this.editData.activityBase.rewardType === 6) {
        /** data parse */
        let ext = JSON.parse(JSON.stringify(this.editData.activityBase.extra))
        ext.fbAdd = Boolean(Number(ext.fbAdd))
        ext.condition = ext.condition.map((item, index, array) => {
          return item.split(',')
        })
        this.extra[this.editData.activityBase.rewardType] = ext
      }
      /** extra_6 */

      // this.config = JSON.parse(JSON.stringify(activityConfig.normal));
      // this.specialConfig = {
      //   config1: JSON.parse(JSON.stringify(activityConfig.special)),
      //   config2: JSON.parse(JSON.stringify(activityConfig.special))
      // };
      this.initConfig()
      // this.initConditionList()
    }
  }
}

</script>
<style lang="scss">
.page-form {
  .reward-type {
    margin-top: 15px;
    &:last-child {
      margin-bottom: 10px;
    }
  }
  .avatar-uploader {
    height: 82px;
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
    border: 1px solid rgb(220, 223, 230);
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
  .wt-240 {
    width: 240px;
  }
  .wt-85 {
    width: 80px;
    margin: 0 10px;
    input {
      height: 34px !important;
    }
  }
  .el-date-editor {
    margin: 0 10px;
    height: 34px !important;
    .el-range__icon,
    .el-input__icon,
    .el-range-separator {
      display: flex;
      align-items: center;
    }
    .el-range__icon {
      margin-left: 9px;
    }
  }
  .wt-50 {
    width: 50px;
    margin: 0 10px;
    input {
      height: 34px !important;
    }
  }
  .mb-16 {
    margin-bottom: 16px;
  }
  .condition.el-icon-plus {
    line-height: 0;
    margin-top: 1px;
  }
  .my-dialog-form {
    .el-dropdown-link {
      cursor: pointer;
      color: #20a0ff;
    }
  }
  .inline-form {
    white-space: nowrap;
    overflow-x: auto;
    border-bottom: 1px dashed #ddd;
    margin-bottom: 20px;
    .inline-form-item {
      display: inline-block;
      vertical-align: top;
      &.first {
        width: 560px;
      }
      &.second {
        border-left: 1px dashed #ddd;
      }
    }
  }
}
</style>
