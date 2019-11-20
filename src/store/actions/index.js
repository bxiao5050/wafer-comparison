import services from '@/services'
import { Notification } from 'element-ui';
export default {
  // getActivityCondition: ({ commit }) => {
  //   services.activity.getActivityCondition({}).then(data => {
  //     if (data.code == 200) {
  //       commit('setActivityCondition', data.state)
  //     }
  //     else {
  //       Notification({
  //         message: data.message || data,
  //         type: 'warning'
  //       })
  //     }
  //   })
  // },
  // getRewardCondition: ({ commit }) => {
  //   services.activity.getRewardCondition({}).then(data => {
  //     if (data.code == 200) {
  //       commit('setRewardCondition', data.state)
  //     }
  //     else {
  //       Notification({
  //         message: data.message || data,
  //         type: 'warning'
  //       })
  //     }
  //   })
  // },
  /**
   * 获取游戏信息
   */
  getApps: ({ commit }) => {
    services.activity.getApps({}).then(data => {
      if (data.code == 200) {
        commit('setAppList', data.state)
      }
      else {
        Notification({
          message: data.message || data,
          type: 'warning'
        })
      }
    })
  },
  /**
   * 获取活动列表
   */
  getActivityGroup: ({ commit }) => {
    services.activity.getAllGroup({}).then(data => {
      if (data.code == 200) {
        commit('setActivityGroup', data.state)
      }
      else {
        Notification({
          message: data.message || data,
          type: 'warning'
        })
      }
    })
  },
  getActivityInfo({ commit }, groupId) {
    if (!groupId) {
      Notification({
        message: '请选择活动组!',
        type: 'warning'
      })
      return
    }
    let params = {
      actId: groupId
    }
    services.activity.getGroup(params).then(data => {
      if (data.code == 200) {
        // this.activityInfo = data.state
        commit('setActivityInfo', data.state)
      } else {
        Notification({
          message: data.message,
          type: 'warning'
        })
      }
    })
  },
}