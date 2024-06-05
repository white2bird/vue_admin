import {createRouter, createWebHashHistory} from 'vue-router'
import { defineAsyncComponent } from "vue"
import Login from "../components/Login.vue"
import Index from "../components/Index.vue"
import Info from "../components/Info.vue"
import NotFound from "../components/NotFound.vue"
import Main from "../components/Main.vue"
import Manage from "../components/Manage.vue"
import store from '../store/index.js'
import http from '../http.js'

const modules = import.meta.glob('../components/*.vue');
const routes = [
	{
		path: '/',
		name: '/M',
		component: Login
	},
	{
		path: '/Login',
		name: 'login',
		component: Login
	},
	{
		path: '/Index',
		name: 'index',
		component: Index,
		children: [
			{
						path: '/Info',
						name: 'info',
						component: Info
					},
					{
					        path: '/:pathMatch(.*)',
					        name: '404',
					        component: NotFound
					}
		]
	},
	
	
]

const children_routes = [
		{
			path: '/Main',
			name: 'main',
			component: Main
		},
		
		{
			path: '/Manage',
			name: 'Manage',
			component: Manage
		}
		]
		


const router = createRouter({ 
	history: createWebHashHistory(),
	routes
})


function asyncHandleMenus(routes){
	return routes.map(router=>{
		const filepath = `../components/${router.name}.vue`
		
		router.component = modules[filepath];
		return router
	})
}

async function loadMenus(next, to){
	const res = await http.get('http://localhost:8080/menu/menuList')
	const routes = asyncHandleMenus(res.data.data)
	routes.forEach(route=>{
		router.addRoute('index',route)
	})
    next({...to, replace: true})
}
let refreshed = true

router.beforeEach((to, from, next) => {
  if(to.path == '/'){
	  next()
  }else{
	 if(store.getters.getIsLogin === true){
		 // 如果已经加载了路由
		 if(store.getters.getLoad === true && refreshed === false){
			
			 next()
		 }else{
			//
			refreshed = false;
			loadMenus(next, to)
			store.commit("setHasLoad")
		 }
		 
	 }else{
		 next("/")
	 }
  }
})

export default router