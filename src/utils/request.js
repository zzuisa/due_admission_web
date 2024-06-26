import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import i18n from '@/i18n'
import util from '@/libs/util.js'
// create an axios instance
const service = axios.create({
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log('res', res)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      if (res.code == 1) {
        console.log('!!!!!!!')
        Message({
          message: i18n.t('message.error.not_login'),
          type: 'error',
          duration: 2 * 1000
        })
        util.cookies.remove('token')
        util.cookies.remove('user')
        util.cookies.remove('student')
        window.location.href = ('#/login')
      } else if (res.code == 2) {
        axios.get(`google/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=${res.content}`).then(r => {
          console.log(r, i18n.locale)
          Message({
            message: i18n.locale === 'en' ? r.data[0][0][0] : r.data[0][0][1],
            type: 'error',
            duration: 2 * 1000
          })
        }).catch(() => [
          Message({
            message: res.content,
            type: 'error',
            duration: 2 * 1000
          })
        ])
      } else if (res.code == 3) {
        Message({
          message: i18n.t('message.error.not_activate'),
          type: 'error',
          duration: 2 * 1000
        })
      } else if (res.code == 4) {
        Message({
          message: i18n.t('message.error.login_failed'),
          type: 'error',
          duration: 2 * 1000
        })
      }

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.content || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
