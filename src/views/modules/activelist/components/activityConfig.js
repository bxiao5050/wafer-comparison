import conditionConfig from '../../conditionConfig'
// 正常情况下条件配置
let config = [
  // "3e15383b-634b-4e10-b3ff-6da94da573dd", // 受邀人条件
  "5a13b590-8821-4fb5-a18e-9a10eeaeb2a1", // 统计人数数量
  // "66c3e106-f15c-4c1e-8e4b-94d53e66c738", // 参与人数配置
  "4b90b47a-2dbe-4b67-a261-8811a70faeec", // 参与次数配置
  "c89101da-32d5-49aa-8136-421cee9bb822", // 游戏登录要求
  "5d4b9651-d16d-40d2-a512-7c5c8a7c57a2", // 预注册
  "ce59f4f3-75c9-472b-bfe7-0280405df206", // 固定玩家资格配置
  "c9d389b8-e8a2-48a5-ae91-5ef24e8bc8a7", // 等级要求
  "2d0c5927-53af-4b95-b27e-209b84a4bd72", // 充值条件
  "cbc307bf-ffc3-4122-978c-05442191f4bf", // 消费条件
  "0f8323f5-a158-43c6-9931-fcfdcd52d2a6", // 限制参与人数
  // "a8b8e4cd-92c4-400f-8768-53cc81a9d213", // 绑定用户配置
  "c5ffb6b3-79b9-4a54-bdfe-d022b98423c3", // 限制区服

  "a8888a60-54c4-4307-b68d-8dba3daa36b4", // 竞猜
  "a4ded85d-69e3-4132-90d3-59dadc98312f", // 投票
]
//特别情况下条件配置(邀请或者召回)
let specialConfig = [
  "3e15383b-634b-4e10-b3ff-6da94da573dd", // 受邀人条件
  "c89101da-32d5-49aa-8136-421cee9bb822", // 游戏登录要求
  "5d4b9651-d16d-40d2-a512-7c5c8a7c57a2", // 预注册
  "ce59f4f3-75c9-472b-bfe7-0280405df206", // 固定玩家资格配置
  "c9d389b8-e8a2-48a5-ae91-5ef24e8bc8a7", // 等级要求
  "2d0c5927-53af-4b95-b27e-209b84a4bd72", // 充值条件
  "cbc307bf-ffc3-4122-978c-05442191f4bf", // 消费条件
  "0f8323f5-a158-43c6-9931-fcfdcd52d2a6", // 限制参与人数
  // "a8b8e4cd-92c4-400f-8768-53cc81a9d213", // 绑定用户配置
  "c5ffb6b3-79b9-4a54-bdfe-d022b98423c3", // 限制区服

  "a8888a60-54c4-4307-b68d-8dba3daa36b4", // 竞猜
]
let normal = []
config.forEach(configitem => {
  conditionConfig.forEach(item => {
    if (configitem == item.conditionId) {
      normal.push(item)
    }
  })
})
let special = []
specialConfig.forEach(configitem => {
  conditionConfig.forEach(item => {
    if (configitem == item.conditionId) {
      special.push(item)
    }
  })
})
export default { normal, special }
// export default [{
//   joinCount: 0,
//   randomCount: 0,
//   sumCount: 0,
//   joinCountDays: 0,
//   conditionType: 0,
//   conditionId: "66c3e106-f15c-4c1e-8e4b-94d53e66c738",
//   conditionName: "参与人数配置",
//   hasResource: false
// }, {
//   loginType: 0,
//   LoginCount: 0,
//   start: '',
//   end: '',
//   conditionType: 2,
//   conditionId: "c89101da-32d5-49aa-8136-421cee9bb822",
//   conditionName: "游戏登录要求",
//   hasResource: false
// },
// {
//   importId: '',
//   conditionType: 2,
//   conditionId: "ce59f4f3-75c9-472b-bfe7-0280405df206",
//   conditionName: "固定玩家资格配置",
//   hasResource: true
// },
// {
//   conditionType: 2,
//   conditionId: "29a206ba-59db-4505-b2e2-7a7bc7e1fb5c",
//   conditionName: "消耗配置",
//   hasResource: false
// },
// {
//   level: 0,
//   conditionType: 2,
//   conditionId: "c9d389b8-e8a2-48a5-ae91-5ef24e8bc8a7",
//   conditionName: "等级要求",
//   hasResource: false
// },
// {
//   chargeMoneny: 0,
//   conditionType: 2,
//   conditionId: "2d0c5927-53af-4b95-b27e-209b84a4bd72",
//   conditionName: "充值条件",
//   hasResource: false
// }, {
//   limitBindCount: 0,
//   limitUserLevel: 0,
//   conditionId: "a8b8e4cd-92c4-400f-8768-53cc81a9d213",
//   conditionName: "绑定用户配置",
//   hasResource: false
// }]
