/**
 * Created by linlin.zhang on 2017/12/18.
 */
import store from '../store/index.js'

// var adminList = ['linlin.zhang', 'xiaoyi', 'karl.zheng', 'jo', 'weiqiang.yu'];


var isPermiss = function (createUser) {
  // var currentUser = store.state.userInfo.username;
  // for (var i = 0; i < adminList.length; i++) {
  //   if (currentUser === adminList[i]) {
  //     return true;
  //   }
  // }
  // if (createUser === currentUser) {
  //   return true;
  // }
  return true;
}

export default isPermiss;
