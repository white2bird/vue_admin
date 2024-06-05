import axios from 'axios'
import store from './store'
import router from './router';
import { ElMessageBox,ElMessage } from 'element-plus'

/**
 * 请求拦截
 */
axios.interceptors.request.use(
    config => {
        if (store.state.token != null &&  store.state.token != "") {
            // 请求头的 Authorization 加上 token 数据
            config.headers.token = store.state.token;
        }else {
			
        }
        return config;
    },
    error => {
        console.log('error in request');
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
function (response) {
  // 响应状态码为 2xx 时触发成功的回调，形参中的 response 是“成功的结果”
  console.log('res->',response)
  if(response.data && response.data.code == 304){
	  ElMessage({
	      message: '登录失效，重新登录',
	      type: 'error',
	      plain: true,
	    })
	  router.push('/login')
  }
  return response
}, function (error) {
  
  return error
}
);

// 导出给 main.js 挂载
export default axios;
