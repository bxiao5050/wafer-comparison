import Vue from 'vue'
import Vuex from 'vuex'
import Actions from './actions'
Vue.use(Vuex)

let state = {
  // activityCondition:null, // 活动元数据
  // rewardCondit-ion:null,  // 礼包/奖励元数据
  isLogined: false,
  // requestUrl: '1' == 'development' ? 'http://172.16.3.144:8081' : 'https://activity.pocketgamesol.com', // 请求服务端地址
  userInfo: {
    username: localStorage.userName || '',
    password: ''
  }, // 用户名密码Base64编码
  env: true, //'1' == 'development',
  appList: [], // 游戏列表
  activityGroup: [], // 活动组列表
  activityInfo: null, // 活动列表
  selectedGroup: null, // 选中的活动组
  selectedActivity: null, // 选中的活动
  signCode: '2bfed5901e4dccd1a373338acdaf7982',
  userCode: localStorage.userCode || ''

}
state.requestUrl = state.env ? 'http://172.16.3.144:8081' : 'https://activity.pocketgamesol.com';

let mutations = {

  setUserInfo: (state, userInfo) => {
    state.userInfo = userInfo;
    localStorage.userName = userInfo.username
  },
  setIsLogined: (state, isLogined) => {
    state.isLogined = isLogined;
  },
  setLoginCode: (state, code) => {
    state.userCode = localStorage.userCode = btoa(code)
  },
  /**
   * 设置活动元数据
   */
  // setActivityCondition: (state,condition) => {
  //   state.activityCondition = condition
  // },
  /**
   * 设置活礼包/奖励元数据
   */
  // setRewardCondition: (state,condition) => {
  //   state.rewardCondition = condition
  // },
  /**
   * 设置游戏列表
   */
  setAppList: (state, appList) => {
    state.appList = appList
  },
  /**
   * 设置活动组列表值
   */
  setActivityGroup: (state, list) => {
    state.activityGroup = list
  },
  /**
   * 设置活动列表
   */
  setActivityInfo: (state, list) => {
    state.activityInfo = list
  },
  /**
   * 选中活动组 (跳转活动)
   */
  selectGroup: (state, item) => {
    state.selectedGroup = item
  },
  /**
   * 选中活动 (跳转礼包)
   */
  selectActivity: (state, item) => {
    state.selectedActivity = item
  }
}

let actions = Actions

let getters = {

}
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
export default store
