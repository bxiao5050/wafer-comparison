export default [{
  limitBindCount: 0, // 限制绑定数量
  limitUserLevel: 0, // 限制用户等级
  conditionId: "a8b8e4cd-92c4-400f-8768-53cc81a9d213",
  conditionName: "绑定用户配置",
  hasResource: false
}, {
  OverDate: 0, // 到达指定天数可领取
  conditionId: "48d5f4a0-153e-49fd-ac3b-b5d8250714d3",
  conditionName: "活动天数达指定天数可以领取配置",
  hasResource: false
},
// {
//   percent: 0, // 奖励概率
//   conditionId: "cdecc0f8-618e-4ec3-947b-96ab360f6a8b",
//   conditionName: "抽奖奖励配置",
//   hasResource: false
// },
{
  level: 0, // 最大等级
  conditionType: 2,
  conditionId: "c9d389b8-e8a2-48a5-ae91-5ef24e8bc8a7",
  conditionName: "等级要求",
  hasResource: false
}, {
  currentCount: 0, // 当前人数
  limitCount: 0,  // 到达数量可以领取
  conditionId: "9b0ad46c-6138-40aa-9a86-ea76c117dac1",
  conditionName: "领取人数到达指定数量可以领取配置",
  hasResource: false
}, {
  loginType: 1, // 登陆类型 1 登陆 2 累计登陆 3 不登录
  LoginCount: 0, // 登陆次数
  start: '',  // 开始时间
  end: '',  // 结束时间
  conditionType: 2,
  conditionId: "c89101da-32d5-49aa-8136-421cee9bb822",
  conditionName: "游戏登录要求",
  hasResource: false,
  activeLoginType: 1
}, {
  type: 1, // 1 消耗 2 累计
  ActivityId: '',// 关联的活动ID
  count: 0,// 消耗数量
  conditionType: 2,
  conditionId: "29a206ba-59db-4505-b2e2-7a7bc7e1fb5c",
  conditionName: "关联消耗品",
  hasResource: false
}, {
  importId: '',  // 导入固定玩家数据
  conditionType: 2,
  conditionId: "ce59f4f3-75c9-472b-bfe7-0280405df206",
  conditionName: "固定玩家资格配置",
  hasResource: true
}, {
  chargeMoneny: 0, // 最小充值数量
  changeType: 1,
  conditionType: 2,
  conditionId: "2d0c5927-53af-4b95-b27e-209b84a4bd72",
  conditionName: "充值条件",
  hasResource: false
}, {
  thirdGameZoneId: '', // 限制区服
  userId: '', // 限制用户
  conditionId: "4a71353d-b195-46d4-a5ce-335778fa59fc",
  conditionName: "内定玩家",
  hasResource: false
}, {
  baseCount: 0, // 基础参与人数
  randomCount: 1, // 随机增长数量
  conditionId: "5a13b590-8821-4fb5-a18e-9a10eeaeb2a1",
  conditionName: "统计人数数量",
  hasResource: false
}, {
  sumCount: 0,  // 总参与人数
  joinCountDays: 0, // 每日参与数量
  type: 1, // 1 用户参与数量 2 活动参与数量
  conditionType: 0,
  conditionId: "66c3e106-f15c-4c1e-8e4b-94d53e66c738",
  conditionName: "参与人数配置",
  hasResource: false
}, {
  sumTime: 0,  // 单人总参与次数
  dayTime: 0, // 单人每日总参与人数
  conditionType: 0,
  conditionId: "4b90b47a-2dbe-4b67-a261-8811a70faeec",
  conditionName: "参与次数配置",
  hasResource: false
}, {
  gameZoneLimit: '', // 限制区服
  conditionType: 0,
  conditionId: "c5ffb6b3-79b9-4a54-bdfe-d022b98423c3",
  conditionName: "限制区服",
  hasResource: false
}, {
  isInvited: false, // 是否是受邀人
  invitedCount: 0, // 受邀人数量
  conditionType: 0,
  conditionId: "3e15383b-634b-4e10-b3ff-6da94da573dd",
  conditionName: "受邀人条件",
  hasResource: false
}, {
  onlineTime: 0, // 在线时长,单位秒
  conditionType: 0,
  conditionId: "97046173-2b9b-478b-8b4f-f81122150589",
  conditionName: "在线时长配置",
  hasResource: false
}, {
  invitedCount: 0, // 受邀人数量,用于奖励
  conditionType: 0,
  conditionId: "bb1963c6-454f-4b6b-b894-71ef9198469c",
  conditionName: "受邀数量达成",
  hasResource: false
}, {
  type: '', // 1 email 2 phone
  conditionType: 0,
  conditionId: "5d4b9651-d16d-40d2-a512-7c5c8a7c57a2",
  conditionName: "预注册",
  hasResource: false
}, {
  ticketCount: 0, // 猜中个数
  conditionType: 0,
  conditionId: "6710ab18-e933-411f-abfe-67b404193ba1",
  conditionName: "猜中个数",
  hasResource: false
}, {
  steps: [{
    allowCount: 0,
    systemCount: 0,
    startTime: '',
    endTime: '',
    publicTime: ''
  }],
  conditionType: 0,
  conditionId: "a8888a60-54c4-4307-b68d-8dba3daa36b4",
  conditionName: "竞猜",
  hasResource: false
}, {
  chargeMoney: 0, // 最小消费数量
  changeType: 1, // 类型 1 单次消费 2 累计消费
  conditionType: 0,
  conditionId: "cbc307bf-ffc3-4122-978c-05442191f4bf",
  conditionName: "消费条件",
  hasResource: false
}, {
  dayJoinCountLimit: 0, // 每日只允许指定数量的用户参与活动
  totalJoinCountLimit: 0, // 只允许指定数量的用户参与活动
  conditionType: 0,
  conditionId: "0f8323f5-a158-43c6-9931-fcfdcd52d2a6",
  conditionName: "限制参与人数",
  hasResource: false
}, {
  operatorId: '', // 操作
  toolsId: '', // 道具ID
  type: '', // 类型
  logic: '',// 逻辑
  calcWay: 1,// 计算方式 1 累计变化值 2 日志记录条数
  dateType: 1,// 1 每日任务 2 循环任务
  achieveValue: '',// 达成值
  changev: '', // 变化值
  conditionType: 0,
  conditionId: "f43bffe8-37af-4f78-bf79-6de2677717af",
  conditionName: "游戏任务积分条件",
  hasResource: false
}, {
  resourceId: '',  // 由资源上传返回资源id
  conditionType: 2,
  conditionId: "a4ded85d-69e3-4132-90d3-59dadc98312f",
  conditionName: "投票",
  hasResource: true
},]
