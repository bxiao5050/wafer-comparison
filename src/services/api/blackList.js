import http from '../http'
var baseUrl = "http://52.221.145.234:9999";
export default {
  query: (params) => {
    return http.get('/admin/api/blacklist/query', params)
  },
  add:(params) => {
    return http.get('/admin/api/blacklist/add', params)
  },
  del:(params) => {
    return http.get('/admin/api/blacklist/delete', params)
  }
}
