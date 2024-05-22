<template>
	<div style="width: 100%;">
		<el-table :data="tableData" style="display: flex;" :header-cell-style="{ background: '#f3f6fd', color: '#555' ,height:'60px'}">
		  <el-table-column prop="id" label="反馈id" width="160" />
		  <el-table-column prop="pic" label="图片" width="160">
			  <template  #default="scope">
			        <img :src="scope.row.pic" min-width="70" height="70" />
			   </template>   
			  
		  </el-table-column>
		  <el-table-column prop="contactUser" label="联系人" width="160"/>
		  <el-table-column prop="mobile" label="联系方式" width="160"/>
		  <el-table-column prop="content" label="反馈内容" width="160" />
		 

		</el-table>
		
		 <el-pagination
		      v-model:current-page="currentPage"
		      v-model:page-size="pageSize"
		      :page-sizes="[6, 100, 200, 400]"
		      :small="small"

		      layout="total, sizes, prev, pager, next, jumper"
		      :total="total"
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		    />
		
	</div>
</template>

<script lang="ts" setup>
	import { reactive } from 'vue'
	import { ElMessageBox,ElMessage } from 'element-plus'
	import { ref,getCurrentInstance } from 'vue'
	const currentInstance = getCurrentInstance()
	const { $http, $message, $route, $pre_url } = currentInstance.appContext.config.globalProperties
	

	let tableData = ref([])
	
	
	// 权限
	const cities = ref([])
	
	const getAllMenu = ()=>{
		$http.get($pre_url+'/menu/getAllMenuList')
		.then(res=>res.data)
		.then(res=>{
			cities.value =res.data
		})
	}
	
	getAllMenu()

	
	
	const small = ref(false)
	const currentPage = ref(1)
	const pageSize = ref(6)
	const total = ref(0)

    
	const getUser = () => {
	
		$http.post($pre_url + '/feedBack/query', {
			'pageNo':currentPage.value,
			'pageSize': pageSize.value
		})
		.then((res: { data: any; }) => {return res.data})
		.then((res: {
			total: number; data: any; 
			}) => {
			var data_list = res.data;
			tableData.value = data_list;
			total.value = res.total;
		})
	};
	
	
	
	const handleSizeChange = (val: number) => {
	  pageSize.value = val;
	  getUser();
	}
	const handleCurrentChange = (val: number) => {
	  currentPage.value = val;
	  getUser();
	}
	

	
	getUser();
</script>

<style>
</style>