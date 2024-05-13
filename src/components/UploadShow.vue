<template>
  <div>
    <gallery :images="images" :index="index" @close="index = null"></gallery>
    <div
      class="image"
      v-for="(image, imageIndex) in images"
      :key="imageIndex"
      @click="index = imageIndex"
      :style="{ backgroundImage: 'url(' + image.thumbnail + ')', width: '300px', height: '200px' }"
    ></div>
	
	<div class="paginationClass">
		<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="currentPage"
		      :page-sizes="[6, 200, 300, 400]"
		      :page-size="pageSize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="total">
		    </el-pagination>
	</div>
				
  </div>
</template>
 
<script>
  import VueGallery from 'vue-gallery';
  import http from '../http'
  export default {
    data: function () {
      return {
		currentPage : 1,
		pageSize : 6,
		small: false,
		total: 0,
        images: [],
        index: null,
      };
    },
	methods:{
	 //    handleSizeChange: function(val) {
		//   this.pageSize = val;
		//   this.getData();
		
		// },
	 //    handleCurrentChange: function(val) {
		//   this.currentPage = val;
		//   this.getData();
		// },
		
		handleSizeChange(val) {
		       this.pageSize = val;
			   this.getData();
		      },
		  handleCurrentChange(val) {
			this.currentPage = val;
			this.getData();
		  },
		
		getData(){
			http.post('http://localhost:8080/resources/getResourcesByType', {
				pageNo: this.currentPage,
				pageSize: this.pageSize,
				type: [1,3]
			}, 
			{ Headers: { 'Content-Type': 'application/json;' } })
			.then(res=>res.data)
			.then(res=>{
				console.log(res, '::::::::;')
				this.images = res.data;
				this.total = res.total;
			})
		}
	},
 
    components: {
      'gallery': VueGallery
    },
	created() {
		this.getData();
	}
  }
</script> 
 
<style scoped>
  .image {
    float: left;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    border: 1px solid #ebebeb;
    margin: 5px;
  }
  
  .paginationClass {
      position: fixed;
      bottom: 0;
      height: 40px;
      width: 100%;
      text-align: center;
   }
</style>