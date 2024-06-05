<template>
	<div style="width: 100%;">
		<el-button type="info" style="float: left;" @click="createUser">新增用户</el-button>
		<el-table :data="tableData" style="display: flex;" :header-cell-style="{ background: '#f3f6fd', color: '#555' ,height:'60px'}">
		  <el-table-column prop="id" label="用户id" width="100" />
		  <el-table-column prop="username" label="用户昵称" width="160" />
		  <el-table-column prop="realName" label="真实姓名" width="160"/>
		 <!-- <el-table-column prop="gender" label="性别" width="160">
			<template #default="scope">
			  <el-tag
				:type="scope.row.gender === 1 ? 'primary' : 'success'"
				disable-transitions
				>{{ scope.row.gender === 1 ? '男' : '女' }}</el-tag
			  >
			</template>
		  </el-table-column> -->
<!-- 		  <el-table-column prop="superAdmin" label="是否管理员" width="160">
			  <template #default="scope">
				<el-tag
				:type="scope.row.superAdmin === 1 ? 'danger' : 'info'"
				disable-transitions
				>{{ scope.row.superAdmin === 1 ? '是' : '否' }}</el-tag
				>
			  </template>
		  </el-table-column> -->
		  <el-table-column prop="mobile" label="手机号" width="160"/>
		  <el-table-column prop="createDate" label="创建时间" width="160"/>
		  <el-table-column prop="operate" label="操作" width="350">
			  <template #default="scope">
				  <el-button type="success" @click="updateUser(scope.row)">编辑</el-button>
				  <el-button type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
				  <el-button type="danger" size="mini" @click="updateRole(scope.row.id)">编辑角色</el-button>
				  <el-button type="success" size="mini" @click="look(scope.row.id)">查看</el-button>
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
			v-model="updateRoleShow"
			title="更改角色"
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
		        {{ city.name }}
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
		      <el-form-item label="昵称">
		        <el-col :span="15">
					<el-input v-model="form.username" />
				</el-col>
		      </el-form-item>
			  
			  <el-form-item label="密码">
			    <el-col :span="15">
			  		<el-input v-model="form.password" />
			  	</el-col>
			  </el-form-item>
			  
			  <el-form-item label="真实姓名">
			    <el-col :span="15">
			  		<el-input v-model="form.realName" />
			  	</el-col>
			  </el-form-item>
			  
			<!--  <el-form-item label="性别">
				<el-radio-group v-model="form.gender">
				  <el-radio value="0">女</el-radio>
				  <el-radio value="1">男</el-radio>
				</el-radio-group>
			  </el-form-item>
			  -->
			  
			 <!-- <el-form-item label="是否管理员">
				<el-radio-group v-model="form.superAdmin">
				  <el-radio value="0">否</el-radio>
				  <el-radio value="1">是</el-radio>
				</el-radio-group>
			  </el-form-item> -->
			  
			  <el-form-item label="手机">
			    <el-col :span="15">
			  		<el-input v-model="form.mobile" />
			  	</el-col>
			  </el-form-item>
			  
			 <!-- <el-form-item label="邮箱">
			    <el-col :span="15">
			  		<el-input v-model="form.email" />
			  	</el-col>
			  </el-form-item> -->
		     
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
	import { useRouter } from "vue-router"
	
	const route = useRouter()

	let tableData = ref([])
	
	let update_type = 0;
	
	
	const dialogVisible = ref(false)
	
	const small = ref(false)
	const currentPage = ref(1)
	const pageSize = ref(6)
	const total = ref(0)
	const form_title = ref('创建用户')
    const currentInstance = getCurrentInstance()
    const { $http, $message, $route, $pre_url } = currentInstance.appContext.config.globalProperties
	
	// 权限
	const updateRoleShow = ref(false);
	const update_role_id = ref(0);
	const checkAll = ref(false)
	const isIndeterminate = ref(true)
	const checkedCities = ref([])
	const cities = ref([])
	
	const getAllMenu = ()=>{
		$http.post($pre_url+'/role/getPageList', {
			pageNo: 1,
			pageSize: 100
		},{
			 Headers: { 'Content-Type': 'application/json;' } 
		})
		.then(res=>res.data)
		.then(res=>{
			cities.value =res.data
		})
	}
	
	const cancel_submit_role = ()=>{
		updateRoleShow.value=false;
	}
	
	
	getAllMenu()
	
	const handleCloseRole = (done: () => void) => {
		done();
	}
	
	const handleCheckAllChange = (val: boolean) => {
	  checkedCities.value = val ? cities.value.map(i=>i.id) : []
	  isIndeterminate.value = false
	}
	const handleCheckedCitiesChange = (value: string[]) => {
	  const checkedCount = value.length
	  checkAll.value = checkedCount === cities.value.length
	  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.value.length
	}
	
	const look = (id)=>{
		console.log('look', id)
		route.push({
			
			path: "/userCollect",
			query: {
				id: id,
			},
		})
	}
	
	const updateSubmitRule = ()=>{
		const menus = checkedCities.value.map(i=>{
			return i;
		})
		$http.post($pre_url+'/userRole/update', {
			userId: update_role_id.value,
			roleIds: menus
		},{
		 Headers: { 'Content-Type': 'application/json;' } 
		})
		.then(res=>res.data)
		.then(res=>{
			updateRoleShow.value = false;
		})
	}
	
	
	// 编辑角色
	const updateRole = (id)=>{
		update_role_id.value = id;
		$http.get($pre_url + "/role/getRolesByUserId?userId="+id)
		.then(res=>res.data)
		.then(res=>{
			 const roles = res.data;
			 checkedCities.value = roles ? roles.map(i=>i.id) : []
		})
		updateRoleShow.value = true;
	}
	
	
	const form = reactive({
	  id:0,
	  username: '',
	  password: '',
	  realName: '',
	  mobile: '',
	  email: '',
	  gender: '0',
	  superAdmin: '0'
	});
	
    
	const getUser = () => {
		$http.post($pre_url + '/user/getList', {
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
		dialogVisible.value = false;
		if(update_type == 1){
			$http.post($pre_url + '/user/updateUser', form)
			.then(res=>res.data)
			.then(res => {
				if(res.code === 200){
					ElMessage({
					    message: '用户更改成功',
					    type: 'success',
					    plain: true,
					  });
					getUser();
				
				}else{
					ElMessage({
					    message: '用户更改失败',
					    type: 'error',
					    plain: true,
					  })
				}
			})
		}else{
			$http.post($pre_url + '/user/createUser', form)
			.then((res : {data : any}) => res.data)
			.then(
				res => {
					dialogVisible.value = false;
					if(res.code === 200){
						ElMessage({
						    message: '用户创建成功',
						    type: 'success',
						    plain: true,
						  });
						getUser();
					
					}else{
						ElMessage({
						    message: '用户创建失败',
						    type: 'error',
						    plain: true,
						  })
					}
					
				}
			
			)
		}
		clear_form();
	}
	const clear_form = () => {
		form.id = 0;
		form.username = '';
		form.password = '';
		form.realName = '';
		form.mobile = '';
		form.gender ='0';
		form.superAdmin = '0';
		form.email = '';
	}
	
	const cancel_submit = ()=>{
		dialogVisible.value = false;
		clear_form();
	}
	
	const createUser = ()=>{
		form_title.value = "创建用户";
		dialogVisible.value=true;
		update_type = 0;
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
	
	const updateUser = (row)=>{
		form_title.value = "更改用户";
		form.id = row.id;
		form.username = row.username;
		form.password = row.password;
		form.realName = row.realName;
		form.mobile = row.mobile;
		form.gender = String(row.gender);
		form.superAdmin = String(row.superAdmin);
		form.email = row.email;
		dialogVisible.value = true;
		update_type = 1;
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