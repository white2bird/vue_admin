<template>
	<div style="width: 100%;"> 
	  <div style="text-align: center;  padding-top: 10px; font-size: 23px; float: left;">
		  <span>xxxx系统欢迎你</span>
	  </div>
	  <div class="toolbar" style="margin-right: 5px; float: right; height: 100%; padding-top: 20px; text-align: center; ">
		<span>{{store.getters.getName}}</span>
		<el-dropdown>
		  <el-icon style="margin-right: 8px; margin-left: 4px;">
			  <setting/>
		  </el-icon>
		  <template #dropdown>
			<el-dropdown-menu>
			  <el-dropdown-item @click="toUser">个人资料</el-dropdown-item>
			  <el-dropdown-item @click="logout">退出</el-dropdown-item>
			</el-dropdown-menu>
		  </template>
		</el-dropdown>
		
	  </div>
	
	</div>
</template>

<script lang="ts" setup>
	import { ref,getCurrentInstance } from 'vue'
	import { useStore } from "vuex";
	import { useRouter} from "vue-router"
	import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
	const currentInstance = getCurrentInstance()
    const { $http, $message, $route, $pre_url } = currentInstance.appContext.config.globalProperties
	
	const store = useStore()
	const router = useRouter();
	
	function toUser(){
		console.log('--user---');
	}
	function logout(){
		
		$http.get($pre_url +"/user/logout")
		.then(res=>res.data)
		.then(res=>{
			store.commit("setNoload")
			store.dispatch("LoginOut")
			router.replace("/")
			
		})
	}
</script>

<style>
</style>