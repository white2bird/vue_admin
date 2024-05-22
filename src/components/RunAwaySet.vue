<template>
	<div style="width: 100%;">
		<el-button type="info" style="float: left;" @click="createUser">新增避难点</el-button>
		<el-table :data="tableData" style="display: flex;" :header-cell-style="{ background: '#f3f6fd', color: '#555' ,height:'60px'}">
		  <el-table-column prop="id" label="避难点id" width="160" />
		  <el-table-column prop="longitude" label="经度" width="160" />
		  <el-table-column prop="latitude" label="纬度" width="160"/>
		 
		  <el-table-column prop="operate" label="操作" width="160">
			  <template #default="scope">
				  <el-button type="success" @click="updateUser(scope.row)">编辑避难点</el-button>
	<!-- 			  <el-button type="danger" @click="deleteUser(scope.row.id)">删除</el-button> -->
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
			title="更改避难点"
			width="500"
			:before-close="handleCloseRole"
		  >
		  
		  
		 <el-form :model="form" label-width="auto" style="max-width: 600px">
		      <el-form-item label="精度">
		        <el-col :span="15">
					<el-input v-model="form.longitude" />
				</el-col>
		      </el-form-item>
			  <el-form-item label="纬度">
			    <el-col :span="15">
						<el-input v-model="form.latitude" />
					</el-col>
			  </el-form-item>
			  
		    </el-form>
		 
		
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
		      <el-form-item label="经度">
		        <el-col :span="15">
					<el-input v-model="form.longitude" />
				</el-col>
		      </el-form-item>
			  <el-form-item label="纬度">
			    <el-col :span="15">
					<el-input v-model="form.latitude" />
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
		$http.post($pre_url+'/runAway/update', 
			form
		,{
		 Headers: { 'Content-Type': 'application/json;' } 
		})
		.then(res=>res.data)
		.then(res=>{
			updateRole.value = false;
			clear_form()
			getUser()
		})
	}
	
	const dialogVisible = ref(false)
	
	const small = ref(false)
	const currentPage = ref(1)
	const pageSize = ref(20)
	const total = ref(0)
	const form_title = ref('创建避难点')
    
   
	
	const form = reactive({
	  id:0,
	  longitude: '',
	  latitude: '',
	
	});
	
    
	const getUser = () => {
		$http.get($pre_url + '/runAway/list', {
			'pageNo':currentPage.value,
			'pageSize': pageSize.value
		})
		.then((res: { data: any; }) => {return res.data})
		.then((res: {
			total: number; data: any; 
			}) => {
			var data_list = res.data;
			tableData.value = data_list;
			total.value = res.data.length;
		})
	};
	
	const submitCreateUser = ()=>{
		$http.post($pre_url + '/runAway/save', form)
		.then((res : {data : any}) => res.data)
		.then(
			res => {
				dialogVisible.value = false;
				if(res.code === 200){
					ElMessage({
						message: '避难点创建成功',
						type: 'success',
						plain: true,
					  });
					getUser();
				
				}else{
					ElMessage({
						message: '避难点创建失败',
						type: 'error',
						plain: true,
					  })
				}
				clear_form()
				getUser()
				
			}
		
		)
		
		clear_form();
	}
	const clear_form = () => {
		form.id = 0;
		form.longitude = '';
		form.latitude = '';
	
	}
	
	const cancel_submit = ()=>{
		dialogVisible.value = false;
		clear_form();
	}
	const cancel_submit_role = ()=>{
		updateRole.value=false;
	}
	
	const createUser = ()=>{
		form_title.value = "创建避难点";
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
	
	const updateUser = (raw)=>{
		console.log(raw)
		
		// 更改对应的id
		form.longitude = raw.longitude
		form.latitude = raw.latitude
		form.id = raw.id
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