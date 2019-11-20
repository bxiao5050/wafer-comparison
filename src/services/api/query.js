/**
 * Created by linlin.zhang on 2017/12/7.
 */
import http from '../http'

export default {
  queryGetRewardHistory:params=>{
    return http.get('/admin/query/history', params)
  },
  sendMail:params=> {
    return http.get('/admin/tools/sendemail', params)
  },
  editLotteryUser:params =>{
    return http.get('/admin/tools/editLotteryUser', params)
  },
  queryLotteryUser:params =>{
    return http.get('/admin/query/lotteryUser', params)
  }
}
