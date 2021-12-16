<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div class="page-login--layer page-login--layer-time" flex="main:center cross:center">{{time}}</div>
    <div class="page-login--layer">
      <div class="page-login--content" flex="dir:top main:justify cross:center box:justify">
        <div class="page-login--content-header">
          <p class="page-login--content-header-motto">
            <!-- {{时间是一切财富中最宝贵的财富。}}
            <span>—— 德奥弗拉斯多</span>-->
            {{$t('message.student.login.saying')}}
            <span>{{$t('message.student.login.saying_author')}}</span>
          </p>
        </div>
        <div class="page-login--content-main" flex="dir:top main:center cross:center">
          <!-- logo -->
          <!-- 表单 -->
          <div class="page-login--form">
            <img class="page-login--logo" src="./image/logo@2x.png" />
            <el-card shadow="never" v-if="r_register" class="transition-box">
              <el-form
                ref="registerForm"
                label-position="top"
                :rules="rules"
                :model="formRegister"
                size="default"
              >
                <el-form-item prop="username">
                  <el-input
                    type="text"
                    v-model="formRegister.username"
                    :placeholder="$t('message.common.username')"
                  >
                    <i slot="prepend" class="fa fa-user-circle-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="email">
                  <el-input
                    type="text"
                    v-model="formRegister.email"
                    :placeholder="$t('message.common.email')"
                  >
                    <i slot="prepend" class="fa fa-keyboard-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    v-model="formRegister.password"
                    :placeholder="$t('message.common.password')"
                  >
                    <i slot="prepend" class="fa fa-keyboard-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    v-model="formRegister.rePassword"
                    :placeholder="$t('message.common.re_password')"
                  >
                    <i slot="prepend" class="fa fa-keyboard-o"></i>
                  </el-input>
                </el-form-item>

                <el-button
                  size="default"
                  @click="submit(2)"
                  type="primary"
                  class="button-login"
                >{{$t('message.student.login.register_user')}}</el-button>
              </el-form>
            </el-card>
            <el-card shadow="never" v-if="r_login" class="transition-box">
              <el-form
                ref="loginForm"
                label-position="top"
                :rules="rules"
                :model="formLogin"
                size="default"
              >
                <el-form-item prop="username">
                  <el-input
                    type="text"
                    v-model="formLogin.username"
                    :placeholder="$t('message.common.username')"
                  >
                    <i slot="prepend" class="fa fa-user-circle-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    v-model="formLogin.password"
                    :placeholder="$t('message.common.password')"
                  >
                    <i slot="prepend" class="fa fa-keyboard-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-input type="text" v-model="formLogin.code" placeholder="- - - -">
                    <template slot="prepend">{{$t('message.student.login.Captcha')}}</template>
                    <template slot="append">
                      <img class="login-code" src="./image/login-code.png" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-button
                  size="default"
                  @click="submit(1)"
                  type="primary"
                  class="button-login"
                >{{$t('message.student.login.login')}}</el-button>
              </el-form>
            </el-card>
            <p class="page-login--options" flex="main:justify cross:center">
              <span>
                <d2-icon name="question-circle" />
                {{$t('message.student.login.forget_password')}}
              </span>
              <span @click="changeText()">{{hintText}}</span>
            </p>
            <!-- 快速登录按钮 -->
            <el-button
              class="page-login--quick"
              size="default"
              type="info"
              @click="dialogVisible = true"
            >{{$t('message.student.login.quick_login.tip')}}</el-button>
          </div>
          <div class="locale-changer">
            {{$t('message.common.change_language')}}
            <a-select @change="saveLanguage" style="float:right;margin-left:15px" v-model="$i18n.locale">
              <a-select-option
                v-for="(lang, i) in langs"
                :key="`Lang${i}`"
                :value="lang"
              >{{ lang==='en'?'English':'简体中文' }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="page-login--content-footer">
          <p class="page-login--content-footer-options">
            <a href="#">{{$t('message.student.login.footer_help')}}</a>
            <a href="#">{{$t('message.student.login.footer_privacy')}}</a>
            <a href="#">{{$t('message.student.login.footer_terms')}}</a>
          </p>
          <p class="page-login--content-footer-copyright">
            Copyright
            <d2-icon name="copyright" />
            {{$t('message.student.login.footer_words')}}
            <a href="https://gitee.com/zzuisa">@Ao</a>
          </p>
        </div>
      </div>
    </div>
    <el-dialog :title="$t('message.student.login.quick_login.title')" :visible.sync="dialogVisible" width="400px">
      <el-row :gutter="10" style="margin: -20px 0px -10px 0px;">
        <el-col v-for="(user, index) in users" :key="index" :span="8">
          <div class="page-login--quick-user" @click="handleUserBtnClick(user)">
            <d2-icon name="user-circle-o" />
            <span>{{user.name}}</span>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import util from '@/libs/util.js'
import { mapActions } from 'vuex'
import { frameInRoutes, router2 } from '@/config/routes'
import { menuHeader, menuAside2, menuAside } from '@/config/menu'
import $http from 'axios'
import i18n from '@/i18n'
import request from '@/utils/request'
import zhCN from '@/i18n/lang/cn'
import en from '@/i18n/lang/en'

export default {
  data () {
    return {
      langs: ['en', 'cn'],
      r_login: true,
      r_register: false,
      timeInterval: null,
      hintText: i18n.t('message.student.login.register_user'),
      time: dayjs().format('HH:mm:ss'),
      // 快速选择用户
      dialogVisible: false,
      users: [
        {
          name: i18n.t('message.student.login.quick_login.admin'),
          username: 'admin',
          password: 'admin'
        },
        {
          name: i18n.t('message.student.login.quick_login.user1'),
          username: 'ao',
          password: '123'
        }
      ],
      // 表单
      formLogin: {
        username: 'admin',
        password: 'admin',
        code: 'v9am'
      },
      formRegister: {
        username: '',
        password: '',
        rePassword: '',
        email: ''
      },
      // 校验
      rules: {
        username: [
          {
            required: true,
            message: i18n.t('message.student.login.hint1'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: i18n.t('message.student.login.hint2'),
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: i18n.t('message.student.login.hint3'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    let c = util.cookies.get('user')
    if (c != undefined) {
      let user = JSON.parse(c)
      if (user.username != 'admin') {
        this.$router.push({ path: '/' })
      } else {
        this.$router.push({ path: '/admin/student' })
      }
    }
    this.timeInterval = setInterval(() => {
      this.refreshTime()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  },
  methods: {
    ...mapActions('d2admin/account', ['login']),
    refreshTime () {
      this.time = dayjs().format('HH:mm:ss')
    },
    saveLanguage (e) {
      util.cookies.set('locale', e)
    },
    changeText () {
      let _this = this
      if (_this.hintText == i18n.t('message.student.login.register_user')) {
        _this.hintText = i18n.t('message.student.login.login_right_now')
        console.log('@@@')
        _this.formRegister = {}
        _this.r_login = false
        _this.r_register = true
      } else {
        console.log('@@@2')

        _this.hintText = i18n.t('message.student.login.register_user')
        _this.formLogin = {}
        _this.r_login = true
        _this.r_register = false
      }
    },
    /**
     * @description 接收选择一个用户快速登录的事件
     * @param {Object} user 用户信息
     */
    handleUserBtnClick (user) {
      this.formLogin.username = user.username
      this.formLogin.password = user.password
      this.submit(1)
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit (key) {
      if (key == 1) {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            let url = `/api/member/login`
            request({
              url,
              method: 'post',
              data: this.formLogin
            })
              .then(res => {
                this.$message({
                  message: i18n.t('message.student.login.success'),
                  type: 'success'
                })
                let path = '/profile'
                if (res.content.member.username == 'admin') {
                  this.$store.commit('d2admin/menu/asideSet', menuAside2)
                  path = '/admin/student'
                } else {
                  this.$store.commit('d2admin/menu/asideSet', menuAside)
                }
                // this.$store.commit("d2admin/page/init", router2);
                console.log('@@')

                util.cookies.set('user', res.content.member)
                util.cookies.set('token', res.content.token)
                if (res.content.student != undefined) {
                  util.cookies.set('student', res.content.student)
                }
                this.formLogin = {}
                console.log('user:', res.content)
                this.$router.push({ path: path })
              })
              .catch(e => {
                this.$message.error(e)
              })
          } else {
            // 登录表单校验失败
            this.$message.error()
          }
        })
      } else if (key == 2) {
        this.$refs.registerForm.validate(valid => {
          if (valid) {
            // 登录
            // 注意 这里的演示没有传验证码
            // 具体需要传递的数据请自行修改代码
            delete this.formRegister.rePassword
            let url = `/api/member/join`
            request({
              url,
              method: 'post',
              data: this.formRegister
            }).then(res => {
              this.formRegister = {}
              this.$message({
                message: i18n.t('message.student.login.success_register'),
                type: 'success'
              })
            })
          } else {
            // 登录表单校验失败
            this.$message.error(
              i18n.t('message.student.login.form_verify_failed')
            )
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.transition-box {
  margin-bottom: 10px;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  box-sizing: border-box;
}
.page-login {
  @extend %unable-select;
  $backgroundColor: #f0f2f5;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;
  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }
  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
  }
  // header
  .page-login--content-header {
    padding: 1em 0;
    .page-login--content-header-motto {
      margin: 0px;
      padding: 0px;
      color: $color-text-normal;
      text-align: center;
      font-size: 12px;
      span {
        color: $color-text-sub;
      }
    }
  }
  // main
  .page-login--logo {
    width: 360px;
    margin-bottom: 2em;
    margin-top: -2em;
  }
  // 登录表单
  .page-login--form {
    width: 420px;
    // 卡片
    .el-card {
      margin-bottom: 15px;
    }
    // 登录按钮
    .button-login {
      width: 100%;
    }
    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0px 14px;
    }
    .login-code {
      height: 40px - 2px;
      display: block;
      margin: 0px -20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }

    // 登陆选项
    .page-login--options {
      margin: 0px;
      padding: 0px;
      font-size: 14px;
      color: $color-primary;
      margin-bottom: 15px;
      font-weight: bold;
      span {
        cursor: pointer;
      }
    }
    .page-login--quick {
      width: 100%;
    }
  }
  // 快速选择用户面板
  .page-login--quick-user {
    @extend %flex-center-col;
    padding: 10px 0px;
    border-radius: 4px;
    &:hover {
      background-color: $color-bg;
      i {
        color: $color-text-normal;
      }
      span {
        color: $color-text-normal;
      }
    }
    i {
      font-size: 36px;
      color: $color-text-sub;
    }
    span {
      font-size: 12px;
      margin-top: 10px;
      color: $color-text-sub;
    }
  }
  // footer
  .page-login--content-footer {
    padding: 1em 0;
    .page-login--content-footer-options {
      padding: 0px;
      margin: 0px;
      margin-bottom: 10px;
      font-size: 14px;
      text-align: center;
      a {
        color: $color-text-normal;
        margin: 0 1em;
      }
    }
    .page-login--content-footer-copyright {
      padding: 0px;
      margin: 0px;
      font-size: 12px;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
      }
    }
  }
  .locale-changer {
    line-height: 30px;
    display: flex;
    justify-content: center;
    margin-top: 22px;
  }
  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #fff;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100% {
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
