<template>
	<div class="login">
		<div class="mylogin" align="center">
			<h4>登录</h4>
			<el-form :model="loginForm" :rules="loginRules" label-width="10px">
				<el-form-item label="" prop="username" style="margin-top: 10px">
					<el-row style="width: 100%;">
						<el-col :span="2">
							<el-icon>
								<UserFilled />
							</el-icon>
						</el-col>
						<el-col :span="22">
							<el-input class="inps" placeholder="账号" v-model="loginForm.username">
							</el-input>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="" prop="password">
					<el-row style="width: 100%;">
						<el-col :span="2">
							<el-icon>
								<Briefcase />
							</el-icon>
						</el-col>
						<el-col :span="22">
							<el-input class="inps" type="password" placeholder="密码"
								v-model="loginForm.password"></el-input>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item style="margin-top: 55px">
					<el-button type="primary" round class="submitBtn" @click="submitForm">登录
					</el-button>
				</el-form-item>
				<div class="unlogin">
					<router-link :to="{ path: '/forgetpwd' }"> 忘记密码? </router-link>
					|
					<router-link :to="{ path: '/register' }">
						<a href="register.vue" target="_blank" align="right">注册新账号</a>
					</router-link>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { ref, getCurrentInstance, reactive } from 'vue'
	import { ElMessageBox, ElMessage } from 'element-plus'
	import { useRouter } from "vue-router";
	import { useStore } from "vuex";
	const currentInstance = getCurrentInstance()
	const { $http, $message, $route, $pre_url } = currentInstance.appContext.config.globalProperties
	const store = useStore()
	const router = useRouter()
	const loginForm = reactive({
		username: "",
		password: "",
	});
	const loginRules = reactive({
		username: [{ required: true, message: "请输入账号", trigger: "blur" }],
		password: [{ required: true, message: "请输入密码", trigger: "blur" }],
	});


	const submitForm = () => {
		$http.post($pre_url + "/user/login", loginForm, { Headers: { 'Content-Type': 'application/json;' } })
			.then(res => res.data)
			.then(res => {
				if (res.code === 200) {
					store.commit("setToken", res.data.token)
					store.commit("setName", loginForm.username)
					store.commit("setNoload")
					router.push("/info");
				} else {
					ElMessage({
						message: '账号或者密码错误',
						type: 'error',
						plain: true
					})
				}

			})
	}

	const logined = () => {
		if (window.localStorage.getItem("token")) {
			router.push("/Info")
		}
	}

	logined()
</script>

<style>
	.login {
		width: 100vw;
		padding: 0;
		margin: 0;
		height: 100vh;
		font-size: 16px;
		background-position: left top;
		background-color: #242645;
		color: #fff;
		font-family: "Source Sans Pro";
		position: relative;
	}

	.mylogin {
		width: 240px;
		height: 280px;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		padding: 50px 40px 40px 40px;
		box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
		opacity: 1;
		background: linear-gradient(230deg,
				rgba(53, 57, 74, 0) 0%,
				rgb(0, 0, 0) 100%);
	}

	.inps input {
		border: none;
		/* color: #fff; */
		background-color: transparent;
		font-size: 12px;
	}

	.submitBtn {
		background-color: transparent;
		color: #39f;
		margin-left: 30px;
		width: 200px;
	}
</style>