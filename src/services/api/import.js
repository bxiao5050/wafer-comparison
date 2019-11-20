import http from '../http'

export default {
  /**
   * cdkey数据上传上传格式txt,一行一个激活码
   */
  // importCDkey: (params) => {
  //   return http.importFile('/upload/cdkey', params)
  // },
  /**
  * 上传图片格式
  */
  // importImage: (params) => {
  //   return http.importFile('/upload/image', params)
  // },
  /**
  * 上传资源，自定义
  */
  // importResource: (params) => {
  //   return http.importFile('/upload/resource', params)
  // }
  getImage: (params) => {
    return http.get('/import/image/get', params)
  }
}