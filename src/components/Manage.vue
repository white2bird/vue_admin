<template>
  <el-upload
    class="upload-demo"
    drag
	:headers="upload.headers"
	:accept="acceptedFormats"
    action="http://localhost:8080/manager/upload"
    multiple
	
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 100MB
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import {reactive} from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { useStore } from "vuex";
const  acceptedFormats =  'image/*,audio/*,video/*'

const store = useStore()
const upload = reactive({
	// 是否显示弹出层（用户导入）
	open: false,
	// 弹出层标题（批量邀约）
	title: "",
	// 是否禁用上传
	isUploading: false,
	// 是否更新已经存在的用户数据
	updateSupport: 0,
	// 设置上传的请求头部
	headers: { token:  store.getters.getToken},
	// 上传的地址
});

</script>
