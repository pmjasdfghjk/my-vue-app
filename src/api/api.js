// 整个项目api的统一管理
import request from "./request";
 
// 请求页左侧表格的数据

export default{
  getTableData(){
    return request({
      url:'/home/getTableData',
      method:'get',
      mock:false,
    })
  },
  getCountData(){
    return request({
      url:'/home/getCountData',
      method:'get',
    })
  },
  getChartData(){
    return request({
      url:'/home/getChartData',
      method:'get',
    })
  },
  getUserList(data){
    return request({
      url:'/home/getUserList',
      method:'get',
      data,
      // get用的是parms，但是我们做了一个处理使得post和get都直接发送data即可
    })
  },
  deleteUserList(data){
    return request({
      url:'/user/deleteUserList',
      method:'get',
      data,
      // get用的是parms，但是我们做了一个处理使得post和get都直接发送data即可
    })
  },
  addUser(data){
    return request({
      url:'/user/addUser',
      method:'post',
      data,
      // get用的是parms，但是我们做了一个处理使得post和get都直接发送data即可
    })
  },
  editUser(params) {
    return request({
      url: '/user/editUser',
      method: 'post',
      data: params
    })
  },
  getMenu(params){
    return request({
      url:'/permission/getMenu',
      method:'post',
      data:params,
    })
  },
  getMallData(params){
    return request({
      url:'/mall/getmall',
      method:'post',
      data:params,
    })
  }
}