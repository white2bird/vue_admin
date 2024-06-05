<template>
	 <h1>{{userName}}收藏</h1>
	 <div class="image-container">
	    
	     <div class="image-list">
	       <div v-for="image in images" :key="image.id" class="image-item">
	         <img :src="image.img" :alt="image.name">
	         <p>{{ image.name }}</p>
	       </div>
	     </div>
	   </div>
</template>

<script lang="ts" setup>
	import { reactive,ref,getCurrentInstance,onMounted} from 'vue'
	import { useRouter } from 'vue-router';
	const currentInstance = getCurrentInstance()
	const { $http, $message, $route, $pre_url } = currentInstance.appContext.config.globalProperties
	const id = ref(-1)
	
	const router = useRouter()
	const userName = ref('')
	
	const images = ref([])
	
	onMounted(() => {
	  if(router.currentRoute.value.query.id){
		  id.value = Number(router.currentRoute.value.query.id)
	  }
	
	  $http.get($pre_url + '/foodMenu/getStoredMenusById?userId='+id.value)
	  .then(res=> {return res.data})
	  .then(res=>{
		  if(res.data){
			  userName.value = res.data.name;
			  images.value = res.data.subArr;
		  }
		 
	  })
	})
	
</script>

	
	
<style>
	.image-container {
	  display: flex; /* 使用flexbox布局 */
	  flex-wrap: wrap; /* 允许换行 */
	}
	
	.image-list {
	  display: flex; /* 使用flexbox布局 */
	  flex-wrap: wrap; /* 允许换行 */
	}
	
	.image-item {
	  flex: 0 0 200px; /* 固定宽度为200px */
	  margin: 10px; /* 设置间距 */
	}
</style>