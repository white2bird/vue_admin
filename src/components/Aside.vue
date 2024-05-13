<template>
	<div>
		<el-menu default-active="Info" style="height: 100vh;"  active-text-color="#ffd04b"
        background-color="#545c64" text-color="#fff" router>
		<el-menu-item index="Info">
			<el-icon><House /></el-icon>
			主页
			</el-menu-item>
		<!-- <el-menu-item index="Main">
			<el-icon>
				<Grid />
				</el-icon>
			用户管理
			</el-menu-item>
			
		<el-menu-item index="Manage">
			<el-icon><Tools /></el-icon>
			设备管理
			</el-menu-item> -->
			
		<el-menu-item :index="item.name" v-for="(item,i) in menuList" :key="i">
			<el-icon>
				<component :is="item.icon" :index="item.name" ></component>
			</el-icon>
			{{item.menuName}}
		</el-menu-item>
		</el-menu>
		
		
	</div>
</template>


<!-- <template>
	<div>
		<el-menu :default-openeds="['1']" style="height: 100vh;"  active-text-color="#ffd04b"
        background-color="#545c64" text-color="#fff">
		  <el-sub-menu index="1">
		    <template #title class="el-icon-s-home">
		      <el-icon><House /></el-icon>主页
		    </template>
		      <el-menu-item index="1-1">
				<span>Option 1</span>
			  </el-menu-item>
		      <el-menu-item index="1-2">Option 2</el-menu-item>
		  </el-sub-menu>
		  <el-sub-menu index="2">
		    <template #title>
		      <el-icon><icon-menu /></el-icon>导航2
		    </template>

			  <el-menu-item index="2-1">Option 1</el-menu-item>
			  <el-menu-item index="2-2">Option 2</el-menu-item>
			
		  </el-sub-menu>
		  <el-sub-menu index="3">
		    <template #title>
		      <el-icon><setting /></el-icon>Navigator Three
		    </template>
		      <el-menu-item index="3-1">Option 1</el-menu-item>
		      <el-menu-item index="3-2">Option 2</el-menu-item>
		  </el-sub-menu>
		</el-menu>
	</div>
</template -->>

<script lang="ts" setup>
	import { ref, reactive, getCurrentInstance } from 'vue'
	import { Menu as IconMenu, Message, Setting, House, SetUp } from '@element-plus/icons-vue'
	const currentInstance = getCurrentInstance()
	const { $http, $message, $route, $pre_url } = currentInstance.appContext.config.globalProperties
	
	const menuList = reactive([])
	
	$http.get('http://localhost:8080/menu/menuList')
	.then(res=>res.data)
	.then(res=>{
		menuList.splice(0,menuList.length,...res.data)
	})
	
	
	
	
	
	
</script>

<style>

	.el-menu-item .el-icon {
	  font-size: 16px; /* 调整图标的大小 */
	}
	.layout-container-demo .el-aside {
	  color: var(--el-text-color-primary);
	  background: var(--el-color-primary-light-8);
	}
</style>