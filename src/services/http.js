import axios from 'axios'
import qs from 'qs'
import {
  Notification,
  Loading
} from 'element-ui';
import store from '../store/index.js'
import router from '../router/index.js'

let options = {
  fullscreen: true,
  customClass: 'my-loading'
}
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
let jsonp = (url, params) => {
  let loadingInstance = Loading.service(options)
  return new Promise((resolve, reject) => {
    axios({
      url: store.state.requestUrl + url,
      dataType: 'jsonp',
      data: params,
      headers: {
        Authorization: 'Basic ' + store.state.userCode
      },
      jsonp: 'callback',
      xhrFields: {
        withCredentials: true
      }
    }).then(
      (data) => {
        loadingInstance.close();
        resolve(data.data)
      },
      (err) => {
        loadingInstance.close();
        console.dir(err)
        Notification.error({
          title: err.response ? err.response.data.error : '提示',
          message: err.response ? err.response.data.message : '异常错误'
        })
        console.error(err)
      }
    )
  })
}
let post = (url, params, base) => {
  let loadingInstance = Loading.service(options)
  return new Promise((resolve, reject) => {
    axios({
      url: store.state.requestUrl + url,
      method: 'post',
      data: qs.stringify(params),
      headers: {
        Authorization: 'Basic ' + store.state.userCode
      },
      xhrFields: {
        withCredentials: true
      }
    }).then(
      (data) => {
        loadingInstance.close();
        store.state.isLogined = true;
        resolve(data.data)
      },
      (err) => {
        loadingInstance.close();
        console.dir(err)
        Notification.error({
          title: err.response ? err.response.data.error : '提示',
          message: err.response ? err.response.data.message : '异常错误'
        })
        if (err.response.data.status == 401) {
          if (!store.state.isLogined) {
            router.push({
              name: 'login'
            })
          }
        }
        console.error(err)
      }
    )
  })
}

let get = (url, params) => {
  let loadingInstance = Loading.service(options)
  return new Promise((resolve, reject) => {
    axios({
      url: store.state.requestUrl + url,
      method: 'get',
      headers: {
        Authorization: 'Basic ' + store.state.userCode
      },
      params: params,
      xhrFields: {
        withCredentials: true
      }
    }).then(
      (data) => {
        loadingInstance.close();
        resolve(data.data)
      },
      (err) => {
        loadingInstance.close();
        console.dir(err)
        Notification.error({
          title: err.response ? err.response.data.error : '提示',
          message: err.response ? err.response.data.message : '异常错误'
        })
        console.error(err)
      }
    )
  })
}

let customGet = (url, params) => {
  let loadingInstance = Loading.service(options)
  return new Promise((resolve, reject) => {
    axios({
      url: store.state.requestUrl + url,
      method: 'get',
      params: params
    }).then(
      (data) => {
        loadingInstance.close();
        resolve(data.data)
      },
      (err) => {
        loadingInstance.close();
        console.dir(err)
        Notification.error({
          title: err.response ? err.response.data.error : '提示',
          message: err.response ? err.response.data.message : '异常错误'
        })
        console.error(err)
      }
    )
  })
}
export default {
  post,
  get,
  jsonp,
  customGet
}
