<template>
	<div style="width: 100%;">
		<div>
			<el-input v-model="goodName" placeholder="搜索订单" style="width: 240px;float: left;" clearable></el-input>
			<el-button type="primary" style="float: left;" @click="search">搜索订单</el-button>
<!-- 			<el-button type="info" style="float: left;" @click="createUser">新</el-button> -->
		</div>
		<el-table :data="tableData" style="display: flex;" :header-cell-style="{ background: '#f3f6fd', color: '#555' ,height:'60px'}">
		  <el-table-column prop="id" label="订单id" width="100" />
		  <el-table-column prop="orderNo" label="订单编号" width="160" />
		  <el-table-column prop="goodName" label="商品名字" width="160"/>
		  <el-table-column prop="username" label="用户名字" width="160"/>
		  <el-table-column label="图片" width="160">
			   <template  #default="scope">            
			         <img :src="scope.row.goodPic" min-width="70" height="70" />
			    </template>   

			   <!-- <img v-if="goodPic" :src="goodPic" class="avatar" /> -->
		  </el-table-column>
		  <el-table-column prop="totalPrice" label="总价格" width="160"/>
		  <el-table-column prop="goodCount" label="数量" width="160"/>
		  <el-table-column prop="createTime" label="订单时间" width="300"/>
			  <!-- <template #default="scope">
				  <el-button type="success" @click="updateUser(scope.row)">编辑</el-button>
				  <el-button type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
			  </template>
		  </el-table-column> -->
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
			v-model="dialogVisible"
			:title="form_title"
			width="500"
			:before-close="handleClose"
		  >
		  
		   <el-form :model="form" label-width="auto" style="max-width: 600px">
		      <el-form-item label="商品名字">
		        <el-col :span="15">
					<el-input v-model="form.goodName" />
				</el-col>
		      </el-form-item>
			  
			  <el-form-item label="商品数量">
			    <el-col :span="15">
			  		<el-input v-model="form.goodCount" />
			  	</el-col>
			  </el-form-item>
			  
			  <el-form-item label="图片">
				  <el-upload
				      class="avatar-uploader"
				      action="http://127.0.0.1:8080/manager/upload"
				      :show-file-list="false"
				      :on-success="handleAvatarSuccess"
				      :before-upload="beforeAvatarUpload"
				    >
				      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
				      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
				    </el-upload>
			  </el-form-item>
			  
							
				
			  <el-form-item label="价格">
			    <el-col :span="15">
			  		<el-input v-model="form.price" />
			  	</el-col>
			  </el-form-item>
		
			  <el-form-item label="介绍">
			    <el-col :span="15">
			  		<el-input v-model="form.detail" />
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
	import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
	
	import type { UploadFile } from 'element-plus'
	
	const imageUrl = ref('');
	const handleAvatarSuccess =(res, file) => {
	      // imageUrl.value = URL.createObjectURL(file.raw);
		  imageUrl.value = res.data
		  form.goodPic = res.data;
	}
	
	const handleFileChange = (event) => {
	  const file = event.target.files[0];
	  const reader = new FileReader();

	  reader.onload = () => {
		imageUrl.value = reader.result;
	  };

	  if (file) {
		reader.readAsDataURL(file);
	  }
	};
	

	let tableData = ref([])
	
	let update_type = 0;

	
	const dialogVisible = ref(false)
	const goodName = ref("")
	const small = ref(false)
	const currentPage = ref(1)
	const pageSize = ref(6)
	const total = ref(0)
	const form_title = ref('创建用户')
    const currentInstance = getCurrentInstance()
    const { $http, $message, $route, $pre_url } = currentInstance.appContext.config.globalProperties
	
	
	
	const form = reactive({
	  id:0,
	  goodName: '',
	  goodCount: '',
	  price: 0,
	  goodPic: '',
	  detail: '',
	});
	
	
	const search = ()=>{
		getUser()
	}
	

    
	const getUser = () => {
		$http.post($pre_url + '/order/getList', {
			'orderNo': goodName.value,
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
			$http.post($pre_url + '/good/updateGood', form)
			.then(res=>res.data)
			.then(res => {
				if(res.code === 200){
					ElMessage({
					    message: '商品更改成功',
					    type: 'success',
					    plain: true,
					  });
					getUser();
				
				}else{
					ElMessage({
					    message: '商品更改失败',
					    type: 'error',
					    plain: true,
					  })
				}
			})
		}else{
			$http.post($pre_url + '/good/createGood', form)
			.then((res : {data : any}) => res.data)
			.then(
				res => {
					dialogVisible.value = false;
					if(res.code === 200){
						ElMessage({
						    message: '商品创建成功',
						    type: 'success',
						    plain: true,
						  });
						getUser();
					
					}else{
						ElMessage({
						    message: '商品创建失败',
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
		form.goodName = '';
		form.goodCount = '';
		form.goodPic = '';
		form.detail = '';
		imageUrl.value = ''
	}
	
	const cancel_submit = ()=>{
		dialogVisible.value = false;
		clear_form();
	}
	
	const createUser = ()=>{
		form_title.value = "创建商品";
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
		form_title.value = "更改商品";
		form.id = row.id;
		form.goodName = row.goodName;
		form.goodCount = row.goodCount;
		form.goodPic = row.goodPic;
		form.detail = row.detail;
		imageUrl.value = row.goodPic
		dialogVisible.value = true;
		update_type = 1;
	}
	
	const deleteUser = (id) =>{
		$http.post($pre_url + '/good/deleteGood', 
			String(id),
			{headers: {'Content-Type': 'application/json'}}
		)
		.then((res : {data : any}) => res.data)
		.then(
			res => {
				dialogVisible.value = false;
				if(res.data === true){
					ElMessage({
					    message: '商品删除成功',
					    type: 'success',
					    plain: true,
					  });
					getUser();
				
				}else{
					ElMessage({
					    message: '商品删除失败',
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
	
	.avatar-uploader .el-upload {
	  border: 1px dashed #d9d9d9;
	  border-radius: 6px;
	  cursor: pointer;
	  position: relative;
	  overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
	  border-color: #409eff;
	}
	.avatar-uploader-icon {
	  font-size: 28px;
	  color: #8c939d;
	  width: 78px;
	  height: 78px;
	  line-height: 78px;
	  text-align: center;
	}
	.avatar {
	  width: 78px;
	  height: 78px;
	  display: block;
	}
</style>