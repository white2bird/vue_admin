import axios from 'axios'
import store from './store'



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



// 导出给 main.js 挂载
export default axios;
