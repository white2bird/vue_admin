<template>
  <div class="home">
    <div class="page-bg"></div>
    <div id="bgDarkMask"></div>
    <div class="page-container">
      <div class="page-left">
        <div class="time-display">
          <div class="now-date">{{ now_date }} {{ now_week }}</div>
          <div class="now-time">{{ now_time }}</div>
        </div>
        <div class="social-contact">
          <div v-for="link in Link" :key="link.name" class="link">
            <a :href="link.url" target="_blank">
              <span> {{ link.name }}</span>
            </a>
          </div>
        </div>
      </div>
      <div class="page-right">
        <h3 style="font-size: 30px; margin-bottom: 20px">我的作品</h3>
        <div class="item-content">
          <div
            class="item-list"
            v-for="zp in zp"
            :key="zp.name"
            @click="project_page(zp.url)"
          >
            <div class="img-box">
              <img
                :src="zp.preview_img"
                :alt="zp.name"
                class="preview-img"
                :title="zp.name"
                v-if="zp.preview_img"
              />
            </div>
            <div class="item-desc">
              <span :title="zp.name">{{ zp.name }}</span>
            </div>
          </div>
          <!-- <a :href="zp.url" target="_blank">{{ zp.url }}</a> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import dayjs from "dayjs";

let Link = ref([
	{name: 'B站', url: 'https://space.bilibili.com/'},
	{name: 'CSDN', url: 'https://blog.csdn.net/'},
	{name: '稀土掘金', url: 'https://juejin.cn/'},
	{name: 'Gitee', url: 'https://gitee.com/'},
	{name: 'GitHub', url: 'https://github.com/'},
	
]);
let zp = ref([]);
// console.log(navigator);

const now_date = ref("");
const now_week = ref("");
const now_time = ref("");
const get_nowTime = () => {
  setInterval(() => {
    now_date.value = dayjs().format("YYYY 年 MM 月 DD 日");
    now_week.value = get_weekNum(dayjs().day());
    now_time.value = dayjs().format("HH:mm:ss");
  }, 1000);
  // console.log(get_weekNum(dayjs().day()));
};

// 获取周几
const get_weekNum = (num) => {
  var arr1 = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  if (num === 0) return "星期日";
  if (!num || isNaN(num)) return "零";
  var english = num.toString().split("");
  var result = "";
  for (var i = 0; i < english.length; i++) {
    var des_i = english.length - 1 - i; // 倒序排列设值
    var arr1_index = english[des_i];
    result = arr1[arr1_index] + result;
  }
  return "星期" + result;
};

const project_page = (e) => {
  window.open(e, "_blank");
};

onMounted(() => {
  get_nowTime();
  now_date.value = dayjs().format("YYYY 年 MM 月 DD 日");
  now_week.value = get_weekNum(dayjs().day());
  now_time.value = dayjs().format("HH:mm:ss");
});
</script>

<style lang="less" scoped>
.page-bg {
  position: fixed;
  background-image: url("https://images.pexels.com/photos/3788183/pexels-photo-3788183.jpeg?auto=compress&cs=tinysrgb&w=1600");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center top;
  background-color: rgb(255, 255, 255);
  z-index: -100;
  inset: 0px;
  width: 100%;
  height: 100%;
  transition: transform 1.5s, opacity 1s;
}
#bgDarkMask,
.mask {
  z-index: -99;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: 0.25s;
}
.page-container {
  .page-left {
    width: 100%;
    text-align: center;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .social-contact {
      margin-top: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      height: 42px;
      border-radius: 6px;
      backdrop-filter: blur(0);
      .link {
        padding: 10px 20px;
        box-shadow: 4px 4px 4px rgba(59, 59, 59, 0.5);
        background-color: rgba(181, 181, 181, 0.4);
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          background-color: rgba(101, 101, 101, 0.5);
        }
      }
      .link > a {
        color: #f0f0f0;
        font-size: 26px;
      }
    }
  }
  .page-right {
    height: 100%;
    align-items: center;
    position: relative;
    top: 100%;
    width: 100%;
    padding-top: 80px;
    padding-bottom: 100px;
    background-color: rgb(245, 245, 245);
  }
}
.time-display {
  padding: 20px;
  display: flex;
  width: 350px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.3);
  box-shadow: 6px 6px 4px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
  border-radius: 4px;
  font-size: 18px;
  margin: 0 auto;
  .now-date {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: "Source Han Sans CN-Medium";
    font-weight: 700;
  }
  .now-time {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 2px;
    margin-top: 10px;
    // font-size: 38px;
    font-size: 4rem;
    font-family: "DS-Digital";
  }
}
.item-content {
  display: flex;
  max-width: 1100px;
  margin: 0 auto;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  .item-list {
    width: 300px;
    text-align: left;
    background-color: rgba(255, 255, 255, 1);
    backdrop-filter: blur(10px);
    border-radius: 4px;
    margin: 24px 15px;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.03) 0 5px 10px;
    &:hover {
      box-shadow: 10px 2px 20px #cacaca;
    }
    .img-box {
      width: 100%;
      height: 155px;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      .preview-img {
        width: 100%;
        height: 100%;
        // border-radius: 6px;
        transition: transform 0.5s ease-in-out;
      }
      .preview-img:hover {
        transform: scale(1.2) translateY(-5px);
      }
    }
    .item-desc {
      padding: 8px;
      color: #1c1c1c;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      font-weight: 700;
      span {
        cursor: pointer;
      }
    }
  }
}
</style>