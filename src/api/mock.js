import Mock from 'mockjs'
import homeApi from './mockData/home'
import userApi from './mockData/user'
import menuApi from './mockData/permission';
import mallApi from './mockData/mall';
Mock.mock(/api\/home\/getTableData/,"get",homeApi.getTableData);
// 1拦截的路径，2拦截的犯法，3制造出的家数据
Mock.mock(/api\/home\/getCountData/,"get",homeApi.getCountData);
Mock.mock(/api\/home\/getChartData/,"get",homeApi.getChartData);
Mock.mock(/api\/home\/getUserList/,"get",userApi.getUserList);
Mock.mock(/api\/user\/deleteUserList/,"get",userApi.deleteUser);
Mock.mock(/api\/user\/addUser/,"post",userApi.createUser);
Mock.mock(/api\/user\/editUser/, "post",userApi.updateUser)
Mock.mock(/api\/permission\/getMenu/, "post", menuApi.getMenu);
Mock.mock(/api\/mall\/getmall/, "post", mallApi.getMallData);