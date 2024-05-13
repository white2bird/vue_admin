<template>
	<div style="width: 100%;">
		<el-button type="info" style="float: left;" @click="createUser">新增角色</el-button>
		<el-table :data="tableData" style="display: flex;" :header-cell-style="{ background: '#f3f6fd', color: '#555' ,height:'60px'}">
		  <el-table-column prop="id" label="角色id" width="160" />
		  <el-table-column prop="name" label="角色名称" width="160" />
		  <el-table-column prop="createDate" label="创建时间" width="160"/>
		 
		  <el-table-column prop="operate" label="操作" width="160">
			  <template #default="scope">
				  <el-button type="success" @click="updateUser(scope.row.id)">编辑权限</el-button>
				  <!-- <el-button type="danger" @click="deleteUser(scope.row.id)">删除</el-button> -->
			  </template>
		  </el-table-column>
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
			
		<el-dialog
			v-model="updateRole"
			title="更改权限"
			width="500"
			:before-close="handleCloseRole"
		  >
		  
		  <el-checkbox
		      v-model="checkAll"
		      :indeterminate="isIndeterminate"
		      @change="handleCheckAllChange"
		    >
		      Check all
		    </el-checkbox>
		    <el-checkbox-group
		      v-model="checkedCities"
		      @change="handleCheckedCitiesChange"
		    >
		      <el-checkbox v-for="city,index in cities" :key="city.id" :label="city" :value="city.id">
		        {{ city.menuName }}
		      </el-checkbox>
		    </el-checkbox-group>
		  
		 <!-- <el-form :model="form" label-width="auto" style="max-width: 600px">
		      <el-form-item label="角色名称">
		        <el-col :span="15">
					<el-input v-model="form.name" />
				</el-col>
		      </el-form-item>
			  
		    </el-form>
		  -->
		
			<template #footer>
			  <div class="dialog-footer">
				<el-button @click="cancel_submit_role">取消</el-button>
				<el-button type="primary" @click="updateSubmitRule">
				  确认
				</el-button>
			  </div>
			</template>
		  </el-dialog>
			
		<el-dialog
			v-model="dialogVisible"
			:title="form_title"
			width="500"
			:before-close="handleClose"
		  >
		  
		  <el-form :model="form" label-width="auto" style="max-width: 600px">
		      <el-form-item label="角色名称">
		        <el-col :span="15">
					<el-input v-model="form.name" />
				</el-col>
		      </el-form-item>
			  
		    </el-form>
		  
		
			<template #footer>
			  <div class="dialog-footer">
				<el-button @click="cancel_submit">取消</el-button>
				<el-button type="primary" @click="submitCreateUser">
				  确认
				</el-button>
			  </div>
			</template>
		  </el-dialog>
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
	const updateRole = ref(false);
	const update_role_id = ref(0);
	const checkAll = ref(false)
	const isIndeterminate = ref(true)
	const checkedCities = ref([])
	const cities = ref([])
	
	const getAllMenu = ()=>{
		$http.get($pre_url+'/menu/getAllMenuList')
		.then(res=>res.data)
		.then(res=>{
			cities.value =res.data
		})
	}
	
	getAllMenu()
	
	const handleCheckAllChange = (val: boolean) => {
	  checkedCities.value = val ? cities.value.map(i=>i.id) : []
	  isIndeterminate.value = false
	}
	const handleCheckedCitiesChange = (value: string[]) => {
	  const checkedCount = value.length
	  checkAll.value = checkedCount === cities.value.length
	  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.value.length
	}
	
	const updateSubmitRule = ()=>{
		const menus = checkedCities.value.map(i=>{
			return i;
		})
		$http.post($pre_url+'/roleMenu/update', {
			roleId: update_role_id.value,
			menuId: menus
		},{
		 Headers: { 'Content-Type': 'application/json;' } 
		})
		.then(res=>res.data)
		.then(res=>{
			updateRole.value = false;
		})
	}
	
	const dialogVisible = ref(false)
	
	const small = ref(false)
	const currentPage = ref(1)
	const pageSize = ref(6)
	const total = ref(0)
	const form_title = ref('创建用户')
    
   
	
	const form = reactive({
	  id:0,
	  name: '',
	  createDate: '',
	
	});
	
    
	const getUser = () => {
		console.log($http)
		$http.post($pre_url + '/role/getPageList', {
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
	
	const submitCreateUser = ()=>{
		$http.post($pre_url + '/role/createRole', form)
		.then((res : {data : any}) => res.data)
		.then(
			res => {
				dialogVisible.value = false;
				if(res.code === 200){
					ElMessage({
						message: '角色创建成功',
						type: 'success',
						plain: true,
					  });
					getUser();
				
				}else{
					ElMessage({
						message: '角色创建失败',
						type: 'error',
						plain: true,
					  })
				}
				
			}
		
		)
		
		clear_form();
	}
	const clear_form = () => {
		form.id = 0;
		form.name = '';
		form.createDate = '';
	
	}
	
	const cancel_submit = ()=>{
		dialogVisible.value = false;
		clear_form();
	}
	const cancel_submit_role = ()=>{
		updateRole.value=false;
	}
	
	const createUser = ()=>{
		form_title.value = "创建用户";
		dialogVisible.value=true;
	}
	
	const handleSizeChange = (val: number) => {
	  pageSize.value = val;
	  getUser();
	}
	const handleCurrentChange = (val: number) => {
	  currentPage.value = val;
	  getUser();
	}
	
	const handleClose = (done: () => void) => {
		clear_form();
		done();
	}
	
	const handleCloseRole = (done: () => void) => {
		done();
	}
	
	const updateUser = (id)=>{
		
		$http.get($pre_url + "/menu/menuListByRoleId?roleId="+id)
		.then(res=>res.data)
		.then(res=>{
			 const roles = res.data;
			 checkedCities.value = roles ? roles.map(i=>i.id) : []
		})
		// 更改对应的id
		update_role_id.value = id;
		updateRole.value = true;
		// update_type = 1;
	}
	
	const deleteUser = (id) =>{
		$http.post($pre_url + '/user/deleteUser', 
			String(id),
			{headers: {'Content-Type': 'application/json'}}
		)
		.then((res : {data : any}) => res.data)
		.then(
			res => {
				dialogVisible.value = false;
				if(res.data === true){
					ElMessage({
					    message: '用户删除成功',
					    type: 'success',
					    plain: true,
					  });
					getUser();
				
				}else{
					ElMessage({
					    message: '用户删除失败',
					    type: 'error',
					    plain: true,
					  })
				}
				
			}
		
		)
	}
	
	getUser();
</script>

<style>
</style>