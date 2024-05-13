import { createApp } from 'vue'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import AudioPlayer from '@liripeng/vue-audio-player'
import Player from "xgplayer";
import "xgplayer/dist/index.min.css";


// import store from './store'

// import VueRouter from 'vue-router'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/global.css';
import axios from './http';
import store from './store'


const vue = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  vue.component(key, component)
}
vue.config.globalProperties.$http = axios
vue.config.globalProperties.$pre_url = 'http://localhost:8080'
vue.use(AudioPlayer)
vue.use(Player)
vue.use(ElementPlus)
vue.use(router)
vue.use(store)
vue.mount('#app')

export default vue



