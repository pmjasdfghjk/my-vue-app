import axios from "axios";
import { ElMessage } from "element-plus";
import config from "../config";
// 添加请求拦截器

const NETWORK_ERROR='网络错误，无法获取'
const service=axios.create(
  {
    baseURL:config.baseApi
  }
)
service.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(
 (res)=>{ 
  const {code,data,msg}=res.data
  if(code===200){
    return data
  }
  else{
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg ||NETWORK_ERROR)
  }
 }
);

function request(options){
  options.method=options.method ||"get";
  // 关于get请求参数的调整，post是data，get是parms,最好统一都穿data
  if(options.method.toLowerCase()==='get'){
    options.params=options.data
  }
  // isMock控制是否使用假的数据，如果里面没有就默认使用配置环境里面的（config。mock，但是如果有的话那就就是options.mock
  // 也就是说，配置文件让整个ismock为false，但是个别接口想自己去调试的话那就可以自己设置为true
  let isMock=config.mock
  if(typeof options.mock !== 'undefined'){
    isMock=options.mock
  }
  // 针对环境做一个处理，就是说第一步，看你是要走mock还是不走mock，第二步，看你的环境是test，开发中，还是走产品上架了，
  // 如果是产品了那就算上面要走mock也不能走，因为是假数据，但是是其他，那就可以根据具体的mock来看基础链接
  if(config.env==='prod'){
    // 产品了肯定不能用mock
    service.defaults.baseURL=config.baseApi
  }else{
    service.defaults.baseURL=isMock?config.mockApi:config.baseApi
    // 如果是要不使用mock，那就走baseApi，走mock，那就走mockApi
  }
  return service(options)

}

export default request