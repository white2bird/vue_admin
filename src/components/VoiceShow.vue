<template>
  <div>
    {{ currentAudioName || audioList[0].name }}
    <AudioPlayer
      ref="audioPlayer"
      :audio-list="audioList.map(elm => elm.url)"
      :before-play="handleBeforePlay"
      theme-color="#ff2929"
    />
  </div>
</template>

<script>
import http from '../http'
export default {
  
 // 局部引入

  data() {
	
    return {
      currentAudioName: '',
      audioList: [
       
      ]
    }
  },

  methods: {
    // 播放前做的事
    handleBeforePlay(next) {
      // 这里可以做一些事情...
      this.currentAudioName = this.audioList[this.$refs.audioPlayer.currentPlayIndex].name

      next() // 开始播放
    },
	getData(){
		http.post('http://localhost:8080/resources/getResourcesByType', {
			pageNo: 1,
			pageSize: 100,
			type: [2]
		}, 
		{ Headers: { 'Content-Type': 'application/json;' } })
		.then(res=>res.data)
		.then(res=>{
			this.audioList = res.data.map(item=>{
				item.name = item.title;
				item.url = item.href;
				return item;
			})
		})
	}
  },
  
  created(){
	  console.log("res")
	  this.getData()
  }
}
</script>