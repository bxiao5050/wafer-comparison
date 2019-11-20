import http from '../http'

export default {
  /**
   * 获取游戏列表
   */
  getApps: (params) => {
    return http.post('/admin/apps', params)
  },
  /**
   * 获取活动条件的元数据信息
   */
  getActivityCondition: (params) => {
    return http.post('/admin/activity/condition', params)
  },
  /**
   * 获取活动组条件的元数据信息
   */
  getGroupCondition: (params) => {
    return http.post('/admin/group/condition', params)
  },
  /**
   * 获取奖励条件的元数据信息
   */
  getRewardCondition: (params) => {
    return http.post('/admin/reward/condition', params)
  },
  /**
   * 获取所有活动组
   */
  getAllGroup: (params) => {
    return http.post('/admin/group', params)
  },
  /**
   * 删除活动组，下面有活动无法删除
   * groupId - 活动组id
   */
  groupRemove: (params) => {
    return http.post('/admin/group/remove', params)
  },
  /**
   * 删除活动，下面有奖励无法删除
   * groupId - 活动组id
   * actId - 活动id
   */
  activityRemove: (params) => {
    return http.post('/admin/activity/remove', params)
  },
  /**
   * 删除奖励，下面有活动无法删除
   * actId - 活动id
   * rewardId - 奖励id
   */
  rewardRemove: (params) => {
    return http.post('/admin/reward/remove', params)
  },
  /**
   * 获取指定id的活动组
   * actId - 活动id
   */
  getGroup: (params) => {
    return http.post('/admin/group/get', params)
  },
  /**
   * 更新、添加、修改活动组
   * { 文字类型 活动组名称 title; 文字类型 活动组id groupId 0 数字类型 appId 游戏id 数字类型 结束时间 end 文字类型组成的数组类型 活动id列表 activityList :['1','2']}
   * actInfo - 活动信息
   */
  updateGroup: (params) => {
    return http.post('/admin/group/update', params)
  },
  /**
   * 更新、添加、修改活动
   * groupId - 活动组id
   * conditionInfo - 条件信息 文字类型 活动id actId; { 文字类型 活动名称 actName; 文字类型 活动状态 state 0 停止 1 开启; 数字类型 开始时间 start 数字类型 结束时间 end 子结构 或奖励条件 orConditions :{ 文字类型 奖励条件的元数据id 文字类型 奖励条件的元数据描述 条件配置 condition { 条件信息 ......从另外一个接口里取，或者你自己写死，随便 } } 子结构 且奖励条件 andConditions :{ 文字类型 奖励条件的元数据id 文字类型 奖励条件的元数据描述 条件配置 condition { 条件信息 ......从另外一个接口里取，或者你自己写死，随便 } } }
   */
  updateActivity: (params) => {
    return http.post('/admin/activity/update', params)
  },
  /**
   * 更新、添加、修改奖励
   * rewardInfo - 奖励视图信息 { 文字类型 奖励id rewardId; 文字类型 奖励名称 rewardName; 数字类型 奖励的类型 goodsType 1 cdkeys 2 积分; 数字类型 奖励总数 sumCount 数字类型 当前数量 currentCount 文字类型 奖励图片地址 image 子结构 分批奖励 goodsList :{ 时间类型 开始时间 start 时间类型 结束时间 end 文字类型 资源id ,就是你导入资源返回的id resource } 子结构 奖励条件 condition :{ 文字类型 奖励条件的元数据id 文字类型 奖励条件的元数据描述 条件配置 condition { 条件信息 ......从另外一个接口里取，或者你自己写死，随便 } } }
   */
  updateReward: (params) => {
    return http.post('/admin/reward/update', params)
  },
  /**
   * 复制活动组
   * groupId -- 活动组Id
   */
  copyGroup: (params) => {
    return http.post('/admin/group/copy',params)
  },
  publicGroup: (params) => {
    return http.post('/admin/public/activity',params)
  },
  clearActivityInfo: (params) => {
    return http.post('/admin/activity/clear',params)
  }
}
