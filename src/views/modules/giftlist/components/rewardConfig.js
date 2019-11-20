import conditionConfig from '../../conditionConfig'
let config = [
  "cdecc0f8-618e-4ec3-947b-96ab360f6a8b", // 抽奖奖励配置
  "48d5f4a0-153e-49fd-ac3b-b5d8250714d3", // 活动到达指定天数可领取
  "9b0ad46c-6138-40aa-9a86-ea76c117dac1", // 领取人数到达指定数量可以领取配置
  "66c3e106-f15c-4c1e-8e4b-94d53e66c738", // 参与人数配置
  "4b90b47a-2dbe-4b67-a261-8811a70faeec", // 参与次数配置
  "c89101da-32d5-49aa-8136-421cee9bb822", // 游戏登录要求
  "5d4b9651-d16d-40d2-a512-7c5c8a7c57a2", // 预注册
  "29a206ba-59db-4505-b2e2-7a7bc7e1fb5c", // 消耗配置
  "4a71353d-b195-46d4-a5ce-335778fa59fc", // 内定条件配置
  "2d0c5927-53af-4b95-b27e-209b84a4bd72", // 充值条件
  "c9d389b8-e8a2-48a5-ae91-5ef24e8bc8a7", // 等级要求
  "cbc307bf-ffc3-4122-978c-05442191f4bf", // 消费条件
  "0f8323f5-a158-43c6-9931-fcfdcd52d2a6", // 限制参与人数
  "c5ffb6b3-79b9-4a54-bdfe-d022b98423c3", // 限制区服
  "97046173-2b9b-478b-8b4f-f81122150589", // 在线时长配置
  "bb1963c6-454f-4b6b-b894-71ef9198469c", // 受邀数量达成

  "6710ab18-e933-411f-abfe-67b404193ba1", // 猜中个数
  "9dffc34c-72fa-4d48-b160-e05377be5446", //限制参与次数配置,满足条件放入奖池，不满足不放入
  "f43bffe8-37af-4f78-bf79-6de2677717af", // 游戏任务积分条件
]
let rewardConfig = []
config.forEach(configitem => {
  conditionConfig.forEach(item => {
    if (configitem == item.conditionId) {
      rewardConfig.push(item)
    }
  })
})
export default rewardConfig
// export default [
//   {
//     percent: 0,
//     conditionType: 0,
//     conditionId: "cdecc0f8-618e-4ec3-947b-96ab360f6a8b",
//     conditionName: "抽奖奖励配置",
//     hasResource: false
//   },
//   {
//     conditionType: 0,
//     conditionId: "29a206ba-59db-4505-b2e2-7a7bc7e1fb5c",
//     conditionName: "消耗配置",
//     hasResource: false
//   },
//   {
//     thirdGameZoneId: "",
//     userId: "",
//     conditionType: 0,
//     conditionId: "4a71353d-b195-46d4-a5ce-335778fa59fc",
//     conditionName: "内定条件配置",
//     hasResource: false
//   },
//   {
//     loginType: 0,
//     LoginCount: 0,
//     start: "",
//     end: "",
//     conditionType: 0,
//     conditionId: "c89101da-32d5-49aa-8136-421cee9bb822",
//     conditionName: "游戏登陆要求",
//     hasResource: false
//   },
//   {
//     chargeMoneny: 0,
//     conditionType: 0,
//     conditionId: "2d0c5927-53af-4b95-b27e-209b84a4bd72",
//     conditionName: "充值条件",
//     hasResource: false
//   },
//   {
//     level: 0,
//     conditionType: 0,
//     conditionId: "c9d389b8-e8a2-48a5-ae91-5ef24e8bc8a7",
//     conditionName: "等级要求",
//     hasResource: false
//   }
// ]
