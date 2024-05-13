<template>
  <div>
    <div
        id="aplayer"
        ref="aplayerBox"
        @mouseenter="ishow && show(true)"
        @mouseleave="ishow && show(false)"
    >
      <aplayer
          ref="aplayer"
          :autoplay="true"
          @loadstart="loadstart"
          :audio="musicList"
          @listSwitch="listSwitch"
          :lrcType="1"
          listFolded
          order="random"
          :volume="1"
          v-if="musicList.length"
      />
      <a href="javascript:;" title="锁定播放器">
        <i @click="locking"
           class="iconfont suo"
           :class="lock ? 'icon-mima':'icon-kaisuo'"></i>
      </a>
    </div>
  </div>
</template>
<script>
// import Aplayer from 'vue-aplayer'

// 异步加载组件
export default {
  name: 'App',
  computed: {
    key() {
      return this.$route.path
    }
  },
  data() {
    return {
      musicList: [], // 播放列表
      songUrl: null, // 歌曲地址
      songLrc: null, // 歌曲歌词
      songName: null, // 歌名
      lock: false, // 用于切换音乐播放器的图标
      ishow: true // 用于锁定播放器
    }
  },
  methods: {
    // 当切换歌曲时触发
    listSwitch() {
      let index = this.musicList.findIndex(item => item.id == this.$refs.aplayer.currentMusic.id)
      // 根据下标切换歌曲
      this.$refs.aplayer.switch(index);
      this.$refs.aplayer.play();
    },
    // 锁定播放器
    locking() {
      this.lock = !this.lock
      // 取反值
      this.ishow = this.lock ? false : true
      // 清除定时器
      if (this.setId) {
        clearTimeout(this.setId)
        this.setId = null
      }
      this.show(this.lock)
    },
    // 更改音乐播放器的样式
    show(flag) {
      // 清除定时器
      if (this.setId) {
        clearTimeout(this.setId)
        this.setId = null
      }
      let bt = flag ? 0 : -70
      this.$refs.aplayerBox.style.bottom = bt + 'px'
    },
    // 音乐播放器加载数据完成时触发
    loadstart() {
      // 更改音乐播放器的样式
      this.show(true)
      // 自动隐藏 判断是否锁定了播放器
      if (!this.lock) {
        this.setId = setTimeout(() => {
          this.show(false)
          this.lock = false
        }, 3000)
      }
    },
    // 获取歌曲地址
    async getUrl(id) {
      let {data} = await this.$API.music.getUrl(id)
      this.songUrl = data[0].url
    },
    // 获取歌曲歌词
    async getLyrics(id) {
      let {lrc} = await this.$API.music.getLyrics(id)
      // 获取歌词
      lrc = lrc ? lrc.lyric : '没有找到歌词'
      lrc = lrc ? lrc : '没有找到歌词'
      this.songLrc = lrc
    }
  },
  mounted() {
    // 清除默认音乐数据
    localStorage.removeItem('aplayer-setting')
    // 调用vuex获取标签数据
    // this.$store.dispatch('getPlayList')
    // this.$store.dispatch('songlist/getSongList')
    // 切换当前播放歌曲
    this.$bus.$on('play', async ({id, name, img}) => {
      try {
        // 歌手名及歌名
        const [singerName, songName] = name.split('-')
        this.songName = songName.trim()
        // 查看本地是否有数据
        let data = this.musicList.find(item => item.id == id)
        if (!data) {
          await this.getUrl(id)
          await this.getLyrics(id)
        } else {
          this.songUrl = data.url // 歌曲地址
          this.songLrc = data.lrc // 歌曲歌词
        }
        // 遍历数组不添加重复的歌曲
        let mark = this.musicList.findIndex(item => item.id == id)
        if (mark !== -1) {
          this.$refs.aplayer.toggle();
          // 根据歌曲的索引切换歌曲
          this.loadstart()
          this.$refs.aplayer.switch(mark);
          return
        }
        // 判断音乐能不能播放
        if (this.songUrl) {
          // name: string | VNode; // 音频名称
          // artist: string | VNode; // 音频艺术家
          // url: string; // 音频播放地址
          // cover: string; // 音频封面
          // lrc?: string; // lrc 歌词
          this.musicList.unshift({
            id: +id,
            name: songName.trim(),  // 歌名
            artist: singerName.trim(),  // 歌手
            url: this.songUrl,
            cover: img,
            lrc: this.songLrc
          })
          // 首次播放不会触发
          if (this.$refs.aplayer) {
            this.$refs.aplayer.switch(songName.trim())
            this.$refs.aplayer.play();
          }
        } else {
          this.$message.error('播放失败')
        }
      } catch (e) {
        console.log(e.message)
      }
    })
  },
  beforeDestroy() {
    // 清除默认音乐数据
    localStorage.removeItem('aplayer-setting')
    this.$bus.$off('play')
  }
}
</script>
<style lang="less">
#aplayer {
  position: fixed;
  bottom: -70px;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  transition: all .5s ease;
}

#aplayer .aplayer {
  margin: 0;
}

.aplayer-notice {
  display: none;
}

.suo {
  position: absolute;
  top: -20px;
  right: 10px;
  font-size: 20px;
  color: #000;
  cursor: pointer;
}

.bx {
  width: 1200px;
  margin: 0 auto;
}
</style>