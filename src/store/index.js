import {
	createStore
} from 'vuex'
import {
	useRouter
} from 'vue-router'
import createPersistedState from 'vuex-persistedstate'
import router from '../router'


// const router = useRouter()
export default createStore({
	state: {
		hasLoad: false,
		name: '',
		token: '',
		routes: []
	},
	getters: {
		getToken(state) {
			return state.token
		},
		getName(state) {
			return state.name
		},
		getIsLogin(state) {
			return state.token !== null && state.name !== null
		},
		getRoutes(state){
			return state.routes
		},
		getLoad(state){
			return state.hasLoad
		}
	},
	mutations: {
		setName(state, name) {
			state.name = name;
		},

		setToken(state, token) {
			state.token = token;
		},

		LoginOut: state => {
			state.token = ''
			state.name = null
			state.isLogin = false
			state.routes = [],
			state.hasLoad = false
		},
		
		setHasLoad(state){
			state.hasLoad = true;
		},
		setNoload(state){
			state.hasLoad = false;
		},
		// 添加动态路由，并同步到状态管理器中，这个地方逻辑是写的最简单的方式，大家可以根据自己的业务需求来改写，本质就是使用addRoute来实现
		addRoutes(state, param) {
			
			// data.forEach(m => {
			// 	this.routes.push({
			// 		path: m.path,
			// 		name: m.name,
			// 		// 错误示例：components:()=>import(`../views/Pages/{m.component}`)
			// 		// 正确示例如下：
			// 		component: modules[`../components/{m.component}.vue`],
			// 	})
			// })
			// console.log('this.routes',this.routes)
			// this.routes.forEach(m => router.addRoute(m))
			const router = param.router
			const cur_routes = param.routes
			// router.options.routes.forEach(m=>{
			// 	if(m.path == '/Index'){
			// 		cur_routes.forEach(it=>{
			// 			m.children.push(it)
			// 		})
			// 	}
			// })
			cur_routes.forEach(m=>{
				router.addRoute("index", m);
			})
			console.log(router)
		}
	},
	actions: {
		SetToken(context, token) {
			context.commit('setToken', token)
		},

		SetToken(context, name) {
			context.commit('setName', name)
		},
		
		setNoload(context){
			context.commit('setNoload')
		},


		LoginOut(context) {
			context.commit('LoginOut')
		},
		
	},
	modules: {

	},

	plugins: [
		createPersistedState({
			// storage: window.localStorage
		})
	]

})