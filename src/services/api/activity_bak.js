import http from '../http'

export default {
  /**
   * 获取活动列表
   */
  getActivityList: (params) => {
    return http.get('/activity', params)
  },
  /**
   * 获取条件配置
   */
  conditionConfigure: (params) => {
    return http.get('/condition/configure', params)
  },
  /**
   * 获取活动配置
   */
  activityList: (params) => {
    return http.get('/activity/configure', params)
  },
  /**
   * 获取所有奖励配置
   */
  activityConfigure: (params) => {
    return http.get('/reward/configure', params)
  },
  /**
   * 获取活动
   * params {
   *  actId 活动ID
   * }
   */
  getActivity: (params) => {
    return http.get('/activity/get', params)
  },
  /**
   * 配置活动
   * params {
   *  actId 活动ID
   *  configureList 配置列表
   * }
   */
  connectionActivity: (params) => {
    return http.get('/activity/configure/add', params)
  },
  /**
   * 配置条件
   * params {
   *  conditionId 条件id
   *  andConfigure  and配置
   *  orConfigure or配置
   * }
   */
  connectionCondition: (params) => {
    return http.get('/condition/configure/add', params)
  },
  /**
   * 奖励配置
   * params{
   *  rewardId 奖励id
   *  configureList 配置列表
   * }
   */
  connectionReward: (params) => {
    return http.get('/reward/configure/add', params)
  },
  /**
   * 更新活动
   * params{
   *  actInfo 活动信息
   * }
   */
  updateActivity: (params) => {
    return http.get('/activity/update', params)
  },
  /**
   * 更新条件
   * params{
   *  conditionInfo 条件信息
   * }
   */
  updateCondition: (params) => {
    return http.get('/condition/update', params)
  },
  /**
   * 更新奖励
   * params{
   *  rewardInfo 奖励信息
   * }
   */
  updateReward:(params) => {
    return http.get('/reward/update', params)
  }
}
